
// src/helpers/kanban.ts
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

export async function handleKanbanUpdate(from: string, contactName: string, body: string): Promise<any> {
    // Usamos runTransaction para evitar condiciones de carrera (tarjetas duplicadas)
    return db.runTransaction(async (transaction) => {
        // 1. Buscamos si ya existe una tarjeta con este número (LECTURA)
        const cardsRef = db.collectionGroup('cards').where('contactNumber', '==', from);
        const existingCardSnapshot = await transaction.get(cardsRef);

        if (!existingCardSnapshot.empty) {
            // --- CASO 1: LA TARJETA YA EXISTE ---
            functions.logger.info(`[Transaction] Existing card found for ${from}. Updating it.`);
            
            const cardDoc = existingCardSnapshot.docs[0];
            const cardRef = cardDoc.ref;

            const updateData = {
                lastMessage: body,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                messages: admin.firestore.FieldValue.arrayUnion({
                    sender: 'user', text: body, timestamp: new Date(),
                }),
            };

            // Ejecutamos la actualización dentro de la transacción
            transaction.update(cardRef, updateData);

            // Devolvemos los datos simulados (ya que la transacción no devuelve el doc actualizado automáticamente)
            const currentData = cardDoc.data();
            return { 
                ...currentData, 
                lastMessage: body,
                isNew: false 
                // Nota: updatedAt será un timestamp de servidor real en la BD, aquí lo aproximamos si se necesita en el return inmediato
            };

        } else {
            // --- CASO 2: CREAR NUEVA TARJETA ---
            functions.logger.info(`[Transaction] No existing card for ${from}. Creating a new one.`);

            // Necesitamos encontrar el grupo "Bandeja de Entrada".
            // Hacemos la consulta dentro de la transacción para mantener la consistencia.
            const groupsRef = db.collection('kanban-groups');
            const inboxGroupQuery = groupsRef.where('name', '==', 'Bandeja de Entrada').limit(1);
            const inboxGroupSnapshot = await transaction.get(inboxGroupQuery);
            
            let groupId;
            if (!inboxGroupSnapshot.empty) {
                groupId = inboxGroupSnapshot.docs[0].id;
            } else {
                functions.logger.warn('"Bandeja de Entrada" group not found. Using the first available group.');
                // Fallback: buscar cualquier grupo ordenado
                const anyGroupQuery = groupsRef.orderBy('order').limit(1);
                const anyGroupSnapshot = await transaction.get(anyGroupQuery);
                
                if (anyGroupSnapshot.empty) {
                    functions.logger.error("No groups found in Firestore at all.");
                    throw new Error('No groups found in Firestore.');
                }
                groupId = anyGroupSnapshot.docs[0].id;
            }

            // Crear la referencia del nuevo documento (auto-ID)
            const newCardRef = db.collection('kanban-groups').doc(groupId).collection('cards').doc();

            const newCardData = {
                contactName,
                contactNumber: from,
                lastMessage: body,
                groupId: groupId, // Guardamos el groupId en el documento para referencias fáciles
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                messages: [{ sender: 'user', text: body, timestamp: new Date() }],
            };

            // Ejecutamos la creación (SET) dentro de la transacción
            transaction.set(newCardRef, newCardData);

            // Devolvemos los datos de la nueva tarjeta
            return { 
                ...newCardData, 
                id: newCardRef.id, // Es útil devolver el ID generado
                isNew: true 
            };
        }
    });
}
