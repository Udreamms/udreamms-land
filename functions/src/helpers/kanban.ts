
// src/helpers/kanban.ts
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

export async function handleKanbanUpdate(from: string, contactName: string, body: string): Promise<any> {
    const cardsRef = db.collectionGroup('cards').where('contactNumber', '==', from);
    const existingCardSnapshot = await cardsRef.get();

    if (existingCardSnapshot.empty) {
        functions.logger.info(`No existing card found for ${from}. Creating a new one.`);
        return createNewCard(contactName, from, body);
    } else {
        functions.logger.info(`Existing card found for ${from}. Updating it.`);
        const cardDocRef = existingCardSnapshot.docs[0].ref;
        const updateData = {
            lastMessage: body,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            messages: admin.firestore.FieldValue.arrayUnion({
                sender: 'user', text: body, timestamp: new Date(),
            }),
        };
        await cardDocRef.update(updateData);
        const updatedDoc = await cardDocRef.get();
        return { ...(updatedDoc.data() as object), isNew: false };
    }
}

async function createNewCard(contactName: string, from: string, body: string): Promise<any> {
    const groupsRef = db.collection('kanban-groups');
    const inboxGroupQuery = groupsRef.where('name', '==', 'Bandeja de Entrada').limit(1);
    const inboxGroupSnapshot = await inboxGroupQuery.get();
    
    let groupId;
    if (!inboxGroupSnapshot.empty) {
        groupId = inboxGroupSnapshot.docs[0].id;
    } else {
        functions.logger.warn('"Bandeja de Entrada" group not found. Using the first available group.');
        const anyGroupSnapshot = await groupsRef.orderBy('order').limit(1).get();
        if (anyGroupSnapshot.empty) {
            functions.logger.error("No groups found in Firestore at all.");
            throw new Error('No groups found in Firestore.');
        }
        groupId = anyGroupSnapshot.docs[0].id;
    }

    const newCardData = {
        contactName,
        contactNumber: from,
        lastMessage: body,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        messages: [{ sender: 'user', text: body, timestamp: new Date() }],
    };

    const newCardRef = await db.collection('kanban-groups').doc(groupId).collection('cards').add(newCardData);
    const newCard = await newCardRef.get();
    // Return the newly created card's data along with a flag indicating it's new
    return { ...(newCard.data() as object), isNew: true };
}
