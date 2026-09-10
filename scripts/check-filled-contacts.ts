import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

async function main() {
  const { db } = await import('../src/backend/firebase/admin');
  if (!db) return;

  const snap = await db.collection('contacts').get();
  console.log(`=== Total contacts: ${snap.size} ===`);
  snap.forEach(doc => {
    const d = doc.data();
    const filledKeys = Object.entries(d).filter(([k, v]) => v && (typeof v === 'string' ? v.trim().length > 0 : true));
    console.log(`\nDoc ${doc.id}: ${d.name || d.firstName || ''} ${d.lastName || ''} | email: ${d.email} | phone: ${d.phone} | Filled fields: ${filledKeys.length}`);
    if (filledKeys.length > 10) {
      console.log('Key fields:', filledKeys.slice(0, 15).map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`));
    }
  });

  console.log(`\n=== solicitudes_visas ===`);
  const snapVisas = await db.collection('solicitudes_visas').get();
  console.log(`Total solicitudes_visas: ${snapVisas.size}`);
  snapVisas.forEach(doc => {
    console.log(`\n[solicitudes_visas] ${doc.id}:`);
    console.log(JSON.stringify(doc.data(), null, 2));
  });
}

main().catch(console.error);
