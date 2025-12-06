
// updateBotFlow.js

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// IMPORTANT: Make sure you have the serviceAccountKey.json file in the root directory.
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const botId = 'wN9t3wJ4xxF3HUXurWt2'; // The ID of your bot

async function fixBotFlow() {
  const botRef = db.collection('chatbots').doc(botId);
  try {
    const doc = await botRef.get();
    if (!doc.exists) {
      console.error(`❌ Bot with ID ${botId} not found.`);
      return;
    }

    const flow = doc.data().flow;
    const { nodes, edges } = flow;

    const fixedEdges = edges.map(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      
      // If the source node is a Quick Reply or List Message and the connection has no specific handle
      if ((sourceNode?.type === 'quickReplyNode' || sourceNode?.type === 'listMessageNode') && !edge.sourceHandle) {
        let firstOption;
        
        if (sourceNode.type === 'quickReplyNode' && sourceNode.data.buttons?.length > 0) {
          firstOption = sourceNode.data.buttons[0];
        } else if (sourceNode.type === 'listMessageNode' && sourceNode.data.sections?.[0]?.options?.length > 0) {
          firstOption = sourceNode.data.sections[0].options[0];
        }
        
        if (firstOption) {
          console.log(`🔧 Fixing edge from node ${sourceNode.id}. Attaching to handle: "${firstOption}"`);
          return {
            ...edge,
            sourceHandle: firstOption // Attach the edge to the first available option
          };
        }
      }
      
      // Return the edge unmodified if no fix is needed
      return edge;
    });

    const newFlow = { ...flow, edges: fixedEdges };

    await botRef.update({ flow: newFlow });
    console.log(`✅ Flow for bot ${botId} has been successfully fixed and updated.`);

  } catch (error) {
    console.error(`❌ Error fixing bot flow for ${botId}:`, error);
  }
}

fixBotFlow();
