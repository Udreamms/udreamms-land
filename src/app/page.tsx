import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Link href="/login" passHref>
        <button style={{ padding: '10px 20px', fontSize: '18px', cursor: 'pointer' }}>
          Login
        </button>
      </Link>
    </div>
  );
}
