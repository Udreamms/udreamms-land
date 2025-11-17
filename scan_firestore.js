const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

// Carga la llave de servicio que descargaste.
// ¡¡¡NO COMPARTAS ESTE ARCHIVO 'serviceAccountKey.json' CON NADIE!!!
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const output = {};

async function getCollection(collectionPath, parentObject) {
  const collectionRef = db.collection(collectionPath);
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    console.log(`Colección vacía o no encontrada: ${collectionPath}`);
    return;
  }

  console.log(`Escaneando colección: ${collectionPath} (${snapshot.size} documentos)`);
  parentObject[collectionPath] = {};

  for (const doc of snapshot.docs) {
    const docData = doc.data();
    parentObject[collectionPath][doc.id] = docData;
    
    // Buscar subcolecciones
    const subcollections = await doc.ref.listCollections();
    if (subcollections.length > 0) {
        parentObject[collectionPath][doc.id]['__subcollections__'] = {};
        for (const subcollection of subcollections) {
            await getCollection(`${collectionPath}/${doc.id}/${subcollection.id}`, parentObject[collectionPath][doc.id]['__subcollections__']);
        }
    }
  }
}

async function main() {
  try {
    console.log('Iniciando escaneo de Firestore...');
    const collections = await db.listCollections();
    for (const collection of collections) {
      await getCollection(collection.id, output);
    }

    fs.writeFileSync('database_structure.json', JSON.stringify(output, null, 2));
    console.log('\n¡Escaneo completo! La estructura ha sido guardada en "database_structure.json"');
  } catch (error) {
    console.error('Error durante el escaneo:', error);
  }
}

main();