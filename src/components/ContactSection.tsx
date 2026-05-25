"use client";

import { useState, useRef, useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

type Status = "idle" | "submitting" | "success" | "error" | "error-captcha";

type FieldErrors = { name?: string; email?: string; message?: string };
type TouchedFields = { name?: boolean; email?: boolean; message?: boolean };

const MESSAGE_MIN_LENGTH = 20;
const MESSAGE_MAX_LENGTH = 1000;

function validateName(value: string): string | undefined {
  if (!value.trim()) return "Name is required.";
}

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Please enter a valid email address.";
}

function validateMessage(value: string): string | undefined {
  if (!value.trim()) return "Message is required.";
  if (value.trim().length < MESSAGE_MIN_LENGTH)
    return `Message must be at least ${MESSAGE_MIN_LENGTH} characters.`;
}

function isFormValid(name: string, email: string, message: string): boolean {
  return !validateName(name) && !validateEmail(email) && !validateMessage(message);
}

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const tokenRef = useRef<string | null>(null);

  function setFieldError(field: keyof FieldErrors, value: string) {
    const error =
      field === "name" ? validateName(value) :
      field === "email" ? validateEmail(value) :
      validateMessage(value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  }

  function handleBlur(field: keyof FieldErrors, value: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFieldError(field, value);
  }

  function renderTurnstile() {
    if (!window.turnstile || !turnstileRef.current || widgetIdRef.current !== null) return;
    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
      callback: (token: string) => { tokenRef.current = token; },
      "expired-callback": () => { tokenRef.current = null; },
    });
  }

  useEffect(() => {
    if (window.turnstile) renderTurnstile();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const messageError = validateMessage(message);
    setTouched({ name: true, email: true, message: true });
    setErrors({ name: nameError, email: emailError, message: messageError });
    if (nameError || emailError || messageError) return;
    if (!tokenRef.current) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, turnstileToken: tokenRef.current }),
      });
      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
        setErrors({});
        setTouched({});
        tokenRef.current = null;
        if (widgetIdRef.current !== null && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus(data.error === "captcha" ? "error-captcha" : "error");
        if (widgetIdRef.current !== null && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
        tokenRef.current = null;
      }
    } catch {
      setStatus("error");
    }
  }

  const charsLeft = MESSAGE_MAX_LENGTH - message.length;
  const nearLimit = charsLeft <= 100;
  const valid = isFormValid(name, email, message);

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
        Have a question or just want to say hello? Fill out the form below and
        I&apos;ll get back to you.
      </p>

      <div className="row justify-content-center">
        <div className="col-xl-6 col-lg-8 col-md-10">
          {status === "success" ? (
            <div className="contact-success">
              <i className="fa fa-check-circle contact-success-icon" />
              <h4 className="mt-3 mb-2">Message sent!</h4>
              <p className="text-muted mb-0">Thanks! I&apos;ll get back to you as soon as possible.</p>
            </div>
          ) : (
          <>
          {(status === "error" || status === "error-captcha") && (
            <div className="contact-feedback contact-feedback-error mb-3">
              <i className="fa fa-exclamation-circle me-2" />
              {status === "error-captcha"
                ? "CAPTCHA verification failed. Please complete the challenge and try again."
                : "Your message could not be sent. Please try again later."}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label htmlFor="name" className="form-label small text-muted mb-1">Name</label>
                  <input
                    type="text"
                    className={`form-control${touched.name && errors.name ? " is-invalid" : ""}`}
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (touched.name) setFieldError("name", e.target.value);
                    }}
                    onBlur={(e) => handleBlur("name", e.target.value)}
                  />
                  {touched.name && errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label htmlFor="email" className="form-label small text-muted mb-1">Email</label>
                  <input
                    type="email"
                    className={`form-control${touched.email && errors.email ? " is-invalid" : ""}`}
                    id="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touched.email) setFieldError("email", e.target.value);
                    }}
                    onBlur={(e) => handleBlur("email", e.target.value)}
                  />
                  {touched.email && errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="form-group mt-2">
              <div className="d-flex justify-content-between align-items-baseline mb-1">
                <label htmlFor="message" className="form-label small text-muted mb-0">Message</label>
                {message.length > 0 && (
                  <small className={nearLimit ? "text-danger" : "text-muted"}>
                    {message.length} / {MESSAGE_MAX_LENGTH}
                  </small>
                )}
              </div>
              <textarea
                id="message"
                className={`form-control${touched.message && errors.message ? " is-invalid" : ""}`}
                placeholder="What's on your mind?"
                rows={5}
                maxLength={MESSAGE_MAX_LENGTH}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (touched.message) setFieldError("message", e.target.value);
                }}
                onBlur={(e) => handleBlur("message", e.target.value)}
              />
              {touched.message && errors.message ? (
                <div className="invalid-feedback">{errors.message}</div>
              ) : message.length > 0 && message.trim().length < MESSAGE_MIN_LENGTH && (
                <small className="text-muted">
                  {message.trim().length} / {MESSAGE_MIN_LENGTH} characters minimum
                </small>
              )}
            </div>
            <div className="mt-3">
              <div ref={turnstileRef} />
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={!valid || status === "submitting"}
              >
                {status === "submitting" ? "Sending…" : "Send Message"}
              </button>
            </div>
          </form>
          </>
          )}
        </div>
      </div>
    </>
  );
}

export default ContactSection;
