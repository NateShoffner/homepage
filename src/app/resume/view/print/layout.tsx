// Dedicated layout for the print page — no site chrome, clean white body.
// Inherits fonts from root layout but strips all nav/footer and body padding.

export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-print-page style={{ margin: 0, padding: 0, background: '#fff' }}>
      {children}
    </div>
  )
}
