import React from 'react'
import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { getResume } from '@lib/resume'
import { ResumePDFDoc } from '@components/resume/ResumePDFDoc'

export const dynamic = 'force-dynamic'

export async function GET() {
  const resume = getResume()
  const buffer = await renderToBuffer(<ResumePDFDoc resume={resume} />)
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="nate-shoffner-resume.pdf"',
    },
  })
}
