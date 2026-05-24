import { getAllDraftFiles, getAllPostFiles } from '@/lib/admin'
import AdminDashboard from '@components/admin/AdminDashboard'

export default function AdminPage() {
  const drafts = getAllDraftFiles()
  const posts = getAllPostFiles()
  return (
    <div className="container py-4">
      <AdminDashboard drafts={drafts} posts={posts} />
    </div>
  )
}
