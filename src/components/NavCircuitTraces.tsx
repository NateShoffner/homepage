'use client'

import { useEffect, useState } from 'react'

const DR = 2;

function Dot({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx} cy={cy} r={DR} fill="var(--circuit-dot)" />;
}

function Trace({
  spd, dim, ...props
}: { spd: string; dim?: boolean } & React.SVGProps<SVGPolylineElement>) {
  const pulseClass = `nct-pulse${dim ? " nct-dim" : ""}`;
  return (
    <>
      <polyline strokeWidth={dim ? 1 : 1.2} {...props} />
      <polyline
        className={pulseClass}
        style={{ "--spd": spd } as React.CSSProperties}
        strokeWidth={2}
        {...props}
      />
    </>
  );
}

function TraceLine({
  spd, dim, ...props
}: { spd: string; dim?: boolean } & React.SVGProps<SVGLineElement>) {
  const pulseClass = `nct-pulse${dim ? " nct-dim" : ""}`;
  return (
    <>
      <line strokeWidth={dim ? 1 : 1.2} {...props} />
      <line
        className={pulseClass}
        style={{ "--spd": spd } as React.CSSProperties}
        strokeWidth={2}
        {...props}
      />
    </>
  );
}

// Grid: background-size 24px, dot centers at (12+24n, 12+24m) in navbar-relative coords.
// Left SVGs (left:0): svgX = navbarX → valid x: 12, 36, 60, 84, 108
// Right SVGs (right:0, sidebar 240px, width 110): navbarX = 130+svgX → valid svgX: 26, 50, 74, 98
// Top SVGs aligned exactly; bottom SVGs (bottom-relative) have grid-aligned x only.

export default function NavCircuitTraces() {
  const [bottomTop, setBottomTop] = useState<number | null>(null)

  useEffect(() => {
    const measure = () => {
      const social = document.querySelector<HTMLElement>('#navbar ul.social-list')
      const navbar = document.querySelector<HTMLElement>('#navbar')
      if (social && navbar) {
        const navbarRect = navbar.getBoundingClientRect()
        const socialRect = social.getBoundingClientRect()
        // Position SVG so its bottom (120px tall) ends one grid row above the social list
        const socialRelTop = socialRect.top - navbarRect.top
        const rawTop = socialRelTop - 120
        const snapped = Math.round((rawTop - 12) / 24) * 24 + 12
        setBottomTop(snapped)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const btL = bottomTop ?? -9999
  const btR = bottomTop != null ? bottomTop - 24 : -9999

  return (
    <div
      className="d-none d-lg-block nav-circuit-traces"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}
    >
      {/* Top-left: top:0, left:0 */}
      <svg style={{ position: "absolute", top: 0, left: 0 }} width="110" height="96" viewBox="0 0 110 96" fill="none">
        {/* open-ended: enters from left, terminates inside */}
        <TraceLine spd="5.0s" dim x1="0" y1="12" x2="36" y2="12" stroke="var(--circuit-stroke-dim)" />
        <Dot cx={36} cy={12} />

        <Trace spd="3.0s" points="0,36 84,36 84,60 108,60" stroke="var(--circuit-stroke)" />
        <Dot cx={84} cy={36} />
        <Dot cx={84} cy={60} />
        <Dot cx={108} cy={60} />

        {/* closed-loop diagonal: enters left, diagonal, exits left */}
        <Trace spd="4.3s" dim points="0,60 36,60 60,84 0,84" stroke="var(--circuit-stroke-dim)" />
        <Dot cx={36} cy={60} />
        <Dot cx={60} cy={84} />
      </svg>

      {/* Top-right: top:40, right:0 */}
      <svg style={{ position: "absolute", top: 40, right: 0 }} width="110" height="96" viewBox="0 0 110 96" fill="none">
        {/* closed-loop diagonal: enters right, diagonal, exits right */}
        <Trace spd="3.5s" points="110,20 74,20 50,44 110,44" stroke="var(--circuit-stroke)" />
        <Dot cx={74} cy={20} />
        <Dot cx={50} cy={44} />

        {/* open-ended: enters from right, terminates inside */}
        <Trace spd="5.9s" dim points="110,68 74,68 74,92" stroke="var(--circuit-stroke-dim)" />
        <Dot cx={74} cy={68} />
        <Dot cx={74} cy={92} />
      </svg>

      {/* Bottom-left: dynamically positioned below navbar-collapse */}
      <svg style={{ position: "absolute", top: btL, left: 0 }} width="110" height="120" viewBox="0 0 110 120" fill="none">
        {/* open-ended: enters from left, terminates inside */}
        <Trace spd="3.3s" points="0,24 60,24 60,48 84,48" stroke="var(--circuit-stroke)" />
        <Dot cx={60} cy={24} />
        <Dot cx={60} cy={48} />
        <Dot cx={84} cy={48} />

        {/* closed-loop diagonal: enters left, diagonal, exits left */}
        <Trace spd="5.5s" dim points="0,72 36,72 60,96 0,96" stroke="var(--circuit-stroke-dim)" />
        <Dot cx={36} cy={72} />
        <Dot cx={60} cy={96} />
      </svg>

      {/* Bottom-right: dynamically positioned below navbar-collapse */}
      <svg style={{ position: "absolute", top: btR, right: 0 }} width="110" height="120" viewBox="0 0 110 120" fill="none">
        {/* closed-loop diagonal: enters right, diagonal, exits right */}
        <Trace spd="3.9s" points="110,24 74,24 50,48 110,48" stroke="var(--circuit-stroke)" />
        <Dot cx={74} cy={24} />
        <Dot cx={50} cy={48} />

        {/* open-ended: enters from right, terminates inside */}
        <Trace spd="6.4s" dim points="110,72 98,72 98,96" stroke="var(--circuit-stroke-dim)" />
        <Dot cx={98} cy={72} />
        <Dot cx={98} cy={96} />
      </svg>
    </div>
  );
}
