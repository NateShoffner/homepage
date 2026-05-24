import { notFound } from 'next/navigation'
import path from 'path'
import fs from 'fs'
import { getPostsDir, parsePostFile } from '@/lib/admin'
import EditorPage from '@components/admin/EditorPage'

interface Props {
  params: Promise<{ filepath: string[] }>
}

export default async function EditPostPage({ params }: Props) {
  const { filepath } = await params
  const postsDir = getPostsDir()
  const filePath = path.join(postsDir, ...filepath) + '.md'
  if (!fs.existsSync(filePath)) notFound()
  const post = parsePostFile(filePath)
  return <EditorPage initialDraft={post} mode="post" />
}
