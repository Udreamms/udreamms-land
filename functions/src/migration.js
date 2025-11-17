
// Este es un script de migración de un solo uso.
const admin = require('firebase-admin');

// Nota: La inicialización se toma del entorno de ejecución de Firebase.
// No es necesario inicializar la app si se corre en el contexto adecuado.
try {
  admin.initializeApp();
} catch (e) {
  // Evita el error de "ya inicializado" si se corre múltiples veces.
}

const db = admin.firestore();

const migrateData = async () => {
  const userEmail = process.argv[2];
  if (!userEmail) {
    console.error('ERROR: Por favor, proporciona un email como argumento.');
    process.exit(1);
  }

  console.log(`Iniciando migración de datos para el usuario: ${userEmail}...`);

  let user;
  try {
    user = await admin.auth().getUserByEmail(userEmail);
    console.log(`Usuario encontrado. UID: ${user.uid}`);
  } catch (error) {
    console.error(`\nERROR CRÍTICO: No se pudo encontrar al usuario con el email '${userEmail}'.`);
    console.error('Por favor, asegúrate de que este usuario se haya registrado en tu aplicación ANTES de correr la migración.');
    process.exit(1);
  }

  const targetUid = user.uid;
  const collectionsToMigrate = ['workflows', 'opportunities', 'conversations', 'userStates'];
  let totalUpdates = 0;

  for (const collectionName of collectionsToMigrate) {
    console.log(`\nProcesando colección: ${collectionName}...`);
    const collectionRef = db.collection(collectionName);
    // Busca documentos donde el campo 'userId' NO exista.
    const snapshot = await collectionRef.where('userId', '==', null).get();

    if (snapshot.empty) {
      console.log(` -> No se encontraron documentos sin 'userId' en '${collectionName}'.`);
      continue;
    }

    console.log(` -> Se encontraron ${snapshot.size} documentos para migrar.`);
    const batch = db.batch();

    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { userId: targetUid });
    });

    await batch.commit();
    totalUpdates += snapshot.size;
    console.log(` -> Migración completada para ${snapshot.size} documentos en '${collectionName}'.`);
  }

  console.log(`\n\n--- MIGRACIÓN COMPLETA ---`);
  console.log(`Se actualizaron un total de ${totalUpdates} documentos.`);
  console.log(`Todos los datos sin propietario ahora pertenecen a ${userEmail} (UID: ${targetUid}).`);
  console.log('La plataforma está lista para nuevos registros.');

};

migrateData().catch(err => {
    console.error("\nOcurrió un error inesperado durante la migración:", err);
    process.exit(1);
});
