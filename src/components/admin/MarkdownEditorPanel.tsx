'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { ICommand } from '@uiw/react-md-editor'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Props {
  value: string
  onChange: (value: string) => void
  extraCommands?: ICommand[]
}

function useColorMode() {
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    function read() {
      setMode(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return mode
}

export default function MarkdownEditorPanel({ value, onChange, extraCommands }: Props) {
  const colorMode = useColorMode()
  return (
    <div data-color-mode={colorMode}>
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? '')}
        preview="edit"
        height={500}
        extraCommands={extraCommands}
      />
    </div>
  )
}
