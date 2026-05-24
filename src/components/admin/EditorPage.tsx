'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import EditorToolbar from './EditorToolbar'
import FrontmatterEditor from './FrontmatterEditor'
import MarkdownEditorPanel from './MarkdownEditorPanel'
import PreviewPanel from './PreviewPanel'
import ImageUploadModal from './ImageUploadModal'
import type { DraftFrontmatter, DraftDetail } from '@/src/types/admin'
import type { ICommand } from '@uiw/react-md-editor'

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error'

interface Props {
  initialDraft?: DraftDetail
  mode?: 'draft' | 'post'
}

function todayIso(): string {
  const d = new Date()
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

function emptyFrontmatter(): DraftFrontmatter {
  return { title: '', date: todayIso(), lastUpdated: '', description: '', type: '', tags: [], categories: [], image: '' }
}

export default function EditorPage({ initialDraft, mode = 'draft' }: Props) {
  const router = useRouter()
  const apiBase = mode === 'post' ? '/api/admin/posts' : '/api/admin/drafts'

  const [filename, setFilename] = useState<string | null>(initialDraft?.filepath ?? null)
  const [frontmatter, setFrontmatter] = useState<DraftFrontmatter>(
    initialDraft?.frontmatter ?? emptyFrontmatter()
  )
  const [content, setContent] = useState(initialDraft?.content ?? '')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [imageInsertCallback, setImageInsertCallback] = useState<((filename: string) => void) | null>(null)

  const filenameRef = useRef(filename)
  const isDirty = useRef(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    filenameRef.current = filename
  }, [filename])

  const save = useCallback(async (fm: DraftFrontmatter, body: string) => {
    setSaveStatus('saving')
    try {
      if (mode === 'draft' && !filenameRef.current) {
        const res = await axios.post<{ filename: string }>('/api/admin/drafts', {
          title: fm.title || 'untitled',
        })
        const newFilename = res.data.filename
        filenameRef.current = newFilename
        setFilename(newFilename)
        window.history.replaceState(null, '', `/admin/drafts/${newFilename}`)
      }
      await axios.put(`${apiBase}/${filenameRef.current}`, { frontmatter: fm, content: body })
      setSaveStatus('saved')
      setLastSavedAt(new Date())
    } catch {
      setSaveStatus('error')
    }
  }, [mode, apiBase])

  useEffect(() => {
    if (!isDirty.current) {
      isDirty.current = true
      return
    }
    setSaveStatus('unsaved')
    if (mode === 'post') return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      save(frontmatter, content)
    }, 2500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [content, frontmatter, save, mode])

  async function handlePublish() {
    setPublishError(null)
    if (!filename) {
      await save(frontmatter, content)
    }
    const fp = filenameRef.current
    if (!fp) return
    try {
      const res = await axios.post<{ publishedPath: string }>(`/api/admin/publish/${fp}`)
      setTimeout(() => router.push('/admin/drafts'), 2000)
      alert(`Published! View at ${res.data.publishedPath}`)
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setPublishError(err.response.data.error as string)
      } else {
        setPublishError('Publish failed')
      }
    }
  }

  const imageToolbarCommand: ICommand = {
    name: 'image-upload',
    keyCommand: 'image-upload',
    buttonProps: { 'aria-label': 'Insert image', title: 'Insert image' },
    icon: <span>🖼</span>,
    execute: (state, api) => {
      setImageInsertCallback(() => (filename: string) => {
        api.replaceSelection(`![image](/assets/images/posts/${filename})`)
      })
      setShowImageModal(true)
    },
  }

  function handleImageSelect(filename: string) {
    if (imageInsertCallback) {
      imageInsertCallback(filename)
      setImageInsertCallback(null)
    }
  }

  function handleFeaturedImageBrowse() {
    setImageInsertCallback(() => (filename: string) => {
      setFrontmatter((fm) => ({ ...fm, image: filename }))
    })
    setShowImageModal(true)
  }

  return (
    <>
      <EditorToolbar
        saveStatus={saveStatus}
        lastSavedAt={lastSavedAt}
        onPublish={handlePublish}
        publishError={publishError}
        showPublish={mode === 'draft'}
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-lg-5">
            <FrontmatterEditor
              frontmatter={frontmatter}
              onChange={setFrontmatter}
              onOpenImageModal={handleFeaturedImageBrowse}
            />
            <MarkdownEditorPanel
              value={content}
              onChange={setContent}
              extraCommands={[imageToolbarCommand]}
            />
          </div>
          <div className="col-12 col-lg-7">
            <PreviewPanel frontmatter={frontmatter} content={content} />
          </div>
        </div>
      </div>
      <ImageUploadModal
        show={showImageModal}
        onHide={() => { setShowImageModal(false); setImageInsertCallback(null) }}
        onSelect={handleImageSelect}
      />
    </>
  )
}
