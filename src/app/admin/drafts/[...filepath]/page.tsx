import { notFound } from 'next/navigation'
import path from 'path'
import fs from 'fs'
import { getDraftsDir, parseDraftFile } from '@/lib/admin'
import EditorPage from '@components/admin/EditorPage'

interface Props {
  params: Promise<{ filepath: string[] }>
}

export default async function EditDraftPage({ params }: Props) {
  const { filepath } = await params
  const draftsDir = getDraftsDir()
  const filePath = path.join(draftsDir, ...filepath) + '.md'
  if (!fs.existsSync(filePath)) notFound()
  const draft = parseDraftFile(filePath)
  return <EditorPage initialDraft={draft} />
}
