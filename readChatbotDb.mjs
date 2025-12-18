
// readChatbotDb.mjs
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBKkNyleaQC52S1s1v13WfQ7-U7wol-SVA",
  authDomain: "udreamms-platform-1.firebaseapp.com",
  projectId: "udreamms-platform-1",
  storageBucket: "udreamms-platform-1.appspot.com",
  messagingSenderId: "860170719759",
  appId: "1:860170719759:web:cb8e6008e08c19b0e7897a",
  measurementId: "G-GP2PVZBTQP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getChatbotData(chatbotId) {
  try {
    const docRef = doc(db, 'chatbots', chatbotId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Contenido del chatbot en la base de datos:");
      // Imprime el documento completo en un formato legible
      console.log(JSON.stringify(docSnap.data(), null, 2));
    } else {
      console.log(`No se encontró ningún documento con el ID: ${chatbotId}`);
    }
  } catch (error) {
    console.error("Error al leer el documento:", error);
  } finally {
    // Es importante cerrar la conexión para que el script termine
    process.exit(0);
  }
}

const chatbotId = 'wN9t3wJ4xxF3HUXurWt2';
getChatbotData(chatbotId);
