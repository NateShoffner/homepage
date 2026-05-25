'use client'

import { useState, useRef, useEffect } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id: string) => void
      remove: (id: string) => void
    }
  }
}

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'error-captcha'

export function ContactSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const tokenRef = useRef<string | null>(null)

  function renderTurnstile() {
    if (!window.turnstile || !turnstileRef.current || widgetIdRef.current !== null) return
    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
      callback: (token: string) => { tokenRef.current = token },
      'expired-callback': () => { tokenRef.current = null },
    })
  }

  useEffect(() => {
    if (window.turnstile) renderTurnstile()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tokenRef.current) {
      setStatus('error')
      return
    }
    setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, turnstileToken: tokenRef.current }),
      })
      if (res.ok) {
        setStatus('success')
        setName('')
        setEmail('')
        setMessage('')
        tokenRef.current = null
        if (widgetIdRef.current !== null && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current)
        }
      } else {
        const data = await res.json().catch(() => ({}))
        setStatus(data.error === 'captcha' ? 'error-captcha' : 'error')
        if (widgetIdRef.current !== null && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current)
        }
        tokenRef.current = null
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        onLoad={renderTurnstile}
      />

      <h2 className="mb-2 text-center">
        Contact <span className="text-highlight">Me</span>
      </h2>

      <p className="mb-4 text-center">
        Have a question or just want to say hello? Fill out the form below and I&apos;ll get back to you.
      </p>

      <div className="row justify-content-center">
        <div className="col-xl-6 col-lg-8 col-md-10">
          {status === 'success' && (
            <div className="alert alert-success" role="alert">
              Your message has been sent! I&apos;ll get back to you as soon as possible. Thanks!
            </div>
          )}
          {status === 'error' && (
            <div className="alert alert-danger" role="alert">
              Your message could not be sent. Please try again later.
            </div>
          )}
          {status === 'error-captcha' && (
            <div className="alert alert-danger" role="alert">
              CAPTCHA verification failed. Please complete the challenge and try again.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label htmlFor="name" className="form-label small text-muted mb-1">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label htmlFor="email" className="form-label small text-muted mb-1">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form-group mt-2">
              <label htmlFor="message" className="form-label small text-muted mb-1">Message</label>
              <textarea
                id="message"
                className="form-control"
                placeholder="What's on your mind?"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <div className="mt-3">
              <div ref={turnstileRef} />
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending…' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ContactSection
