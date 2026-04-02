export default function BartlettPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0f1117',
      color: '#c8ccd4',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <p style={{ color: '#c8ccd4' }}>Bartlett is coming.</p>
      <p style={{ color: '#8a8f98', fontSize: 14 }}>Finish Joan first.</p>
    </main>
  )
}
