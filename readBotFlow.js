
// readBotFlow.js
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// This script assumes you have the serviceAccountKey.json file in the root directory.
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const botId = 'wN9t3wJ4xxF3HUXurWt2'; // The ID of your bot

async function readBot() {
  const botRef = db.collection('chatbots').doc(botId);
  try {
    const doc = await botRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Current Bot Flow:', JSON.stringify(doc.data().flow, null, 2));
    }
  } catch (error) {
    console.error(`❌ Error reading bot ${botId}:`, error);
  }
}

readBot();
