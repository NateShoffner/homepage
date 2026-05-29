export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-print-page style={{ margin: 0, padding: 0, background: '#fff' }}>
      {children}
    </div>
  )
}
