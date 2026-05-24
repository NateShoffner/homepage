'use client'

import { useState, useEffect, useRef } from 'react'
import { Modal, Nav, ProgressBar } from 'react-bootstrap'
import axios from 'axios'

interface ImageItem {
  filename: string
  url: string
}

interface Props {
  show: boolean
  onHide: () => void
  onSelect: (filename: string) => void
}

export default function ImageUploadModal({ show, onHide, onSelect }: Props) {
  const [activeTab, setActiveTab] = useState<'upload' | 'browse'>('upload')
  const [images, setImages] = useState<ImageItem[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (show) {
      setSelected(null)
      setPreview(null)
      setProgress(null)
      setUploadError(null)
      fetchImages()
    }
  }, [show])

  async function fetchImages() {
    try {
      const res = await axios.get<{ images: ImageItem[] }>('/api/admin/images')
      setImages(res.data.images)
    } catch {
      // ignore
    }
  }

  async function handleFileChange(file: File | null) {
    if (!file) return
    setUploadError(null)
    setPreview(URL.createObjectURL(file))
    const formData = new FormData()
    formData.append('file', file)
    try {
      setProgress(0)
      const res = await axios.post<{ filename: string; url: string }>('/api/admin/images', formData, {
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100))
        },
      })
      await fetchImages()
      setSelected(res.data.filename)
      setProgress(null)
      setActiveTab('browse')
    } catch {
      setUploadError('Upload failed')
      setProgress(null)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    handleFileChange(e.dataTransfer.files[0] ?? null)
  }

  function handleInsert() {
    if (selected) {
      onSelect(selected)
      onHide()
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Images</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link active={activeTab === 'upload'} onClick={() => setActiveTab('upload')}>
              Upload
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link active={activeTab === 'browse'} onClick={() => setActiveTab('browse')}>
              Browse
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {activeTab === 'upload' && (
          <div>
            <div
              className="border rounded p-4 text-center"
              style={{ cursor: 'pointer', borderStyle: 'dashed' }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="preview" className="img-fluid" style={{ maxHeight: 200 }} />
              ) : (
                <span className="text-muted">Click or drag an image here to upload</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="d-none"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
            {progress !== null && (
              <ProgressBar now={progress} label={`${progress}%`} className="mt-2" />
            )}
            {uploadError && <div className="text-danger mt-2">{uploadError}</div>}
          </div>
        )}

        {activeTab === 'browse' && (
          <div>
            {images.length === 0 ? (
              <p className="text-muted">No images uploaded yet.</p>
            ) : (
              <div className="d-flex flex-wrap" style={{ gap: '0.5rem' }}>
                {images.map((img) => (
                  <div
                    key={img.filename}
                    className={`border rounded p-1 ${selected === img.filename ? 'border-primary border-2' : ''}`}
                    style={{ cursor: 'pointer', width: 100 }}
                    onClick={() => setSelected(img.filename)}
                  >
                    <img
                      src={img.url}
                      alt={img.filename}
                      style={{ width: '100%', height: 80, objectFit: 'cover' }}
                    />
                    <div className="text-truncate small mt-1" title={img.filename}>
                      {img.filename}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary btn-sm" onClick={onHide}>
          Cancel
        </button>
        <button
          className="btn btn-primary btn-sm"
          disabled={!selected}
          onClick={handleInsert}
        >
          Insert
        </button>
      </Modal.Footer>
    </Modal>
  )
}
