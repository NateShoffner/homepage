import { notFound } from 'next/navigation'
import '@assets/css/admin.scss'

export const metadata = { title: 'Admin' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound()
  return <div className="admin-layout">{children}</div>
}
