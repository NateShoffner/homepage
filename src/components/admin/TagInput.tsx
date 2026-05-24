'use client'

import { useState, KeyboardEvent } from 'react'

interface Props {
  label: string
  values: string[]
  onChange: (values: string[]) => void
}

export default function TagInput({ label, values, onChange }: Props) {
  const [input, setInput] = useState('')

  function addTag(tag: string) {
    const trimmed = tag.trim()
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed])
    }
    setInput('')
  }

  function removeTag(tag: string) {
    onChange(values.filter((v) => v !== tag))
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && values.length) {
      onChange(values.slice(0, -1))
    }
  }

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div
        className="d-flex flex-wrap p-2 border rounded admin-tag-input"
        style={{ gap: '0.25rem' }}
      >
        {values.map((tag) => (
          <span
            key={tag}
            className="badge d-flex align-items-center admin-tag-badge"
            style={{ gap: '0.25rem' }}
          >
            {tag}
            <button
              type="button"
              className="admin-tag-remove"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          className="border-0 flex-grow-1 bg-transparent"
          style={{ outline: 'none', minWidth: 120 }}
          placeholder="Add and press Enter…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => { if (input) addTag(input) }}
        />
      </div>
    </div>
  )
}
