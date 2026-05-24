'use client'

import { useState } from 'react'
import { Collapse } from 'react-bootstrap'
import TagInput from './TagInput'
import type { DraftFrontmatter } from '@/src/types/admin'

interface Props {
  frontmatter: DraftFrontmatter
  onChange: (fm: DraftFrontmatter) => void
  onOpenImageModal: () => void
}

export default function FrontmatterEditor({ frontmatter, onChange, onOpenImageModal }: Props) {
  const [open, setOpen] = useState(true)

  function update(partial: Partial<DraftFrontmatter>) {
    onChange({ ...frontmatter, ...partial })
  }

  return (
    <div className="mb-3">
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary w-100 d-flex justify-content-between align-items-center mb-2"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>Frontmatter</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      <Collapse in={open}>
        <div>
          <div className="mb-2">
            <label className="form-label">Title</label>
            <input
              className="form-control form-control-sm"
              value={frontmatter.title}
              onChange={(e) => update({ title: e.target.value })}
            />
          </div>
          <div className="row mb-2">
            <div className="col">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={frontmatter.date ? frontmatter.date.slice(0, 10) : ''}
                onChange={(e) => update({ date: e.target.value })}
              />
            </div>
            <div className="col">
              <label className="form-label">Last Updated</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={frontmatter.lastUpdated ? frontmatter.lastUpdated.slice(0, 10) : ''}
                onChange={(e) => update({ lastUpdated: e.target.value })}
              />
            </div>
          </div>
          <div className="mb-2">
            <label className="form-label">Description</label>
            <textarea
              className="form-control form-control-sm"
              rows={2}
              value={frontmatter.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Type</label>
            <input
              className="form-control form-control-sm"
              value={frontmatter.type}
              onChange={(e) => update({ type: e.target.value })}
            />
          </div>
          <TagInput label="Tags" values={frontmatter.tags} onChange={(tags) => update({ tags })} />
          <TagInput
            label="Categories"
            values={frontmatter.categories}
            onChange={(categories) => update({ categories })}
          />
          <div className="mb-2">
            <label className="form-label">Featured Image</label>
            <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
              <input
                className="form-control form-control-sm"
                value={frontmatter.image}
                onChange={(e) => update({ image: e.target.value })}
                placeholder="filename.jpg"
              />
              <button
                type="button"
                className="btn btn-sm btn-outline-primary text-nowrap"
                onClick={onOpenImageModal}
              >
                Browse
              </button>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  )
}
