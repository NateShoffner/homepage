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

export default function NavCircuitTraces() {
  return (
    <div
      className="d-none d-lg-block nav-circuit-traces"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}
    >
      {/* Top-left */}
      <svg style={{ position: "absolute", top: 0, left: 0 }} width="110" height="95" viewBox="0 0 110 95" fill="none">
        <TraceLine spd="7.1s" dim x1="0" y1="20" x2="38" y2="20" stroke="var(--circuit-stroke-dim)" />
        <Dot cx={38} cy={20} />

        <Trace spd="4.3s" points="0,35 70,35 70,72 100,72" stroke="var(--circuit-stroke)" />
        <Dot cx={70} cy={35} />
        <Dot cx={70} cy={72} />
        <Dot cx={100} cy={72} />

        <Trace spd="6.2s" dim points="0,54 48,54 48,82" stroke="var(--circuit-stroke-dim)" />
        <Dot cx={48} cy={54} />
        <Dot cx={48} cy={82} />
      </svg>

      {/* Top-right: offset 40px lower than top-left */}
      <svg style={{ position: "absolute", top: 40, right: 0 }} width="110" height="95" viewBox="0 0 110 95" fill="none">
        <Trace spd="5.0s" points="110,25 48,25 48,78" stroke="var(--circuit-stroke)" />
        <Dot cx={48} cy={25} />
        <Dot cx={48} cy={78} />

        <Trace spd="8.4s" dim points="110,44 68,44 68,85" stroke="var(--circuit-stroke-dim)" />
        <Dot cx={68} cy={44} />
        <Dot cx={68} cy={85} />
      </svg>

      {/* Bottom-left: sits above social buttons, routes upward */}
      <svg style={{ position: "absolute", bottom: 110, left: 0 }} width="110" height="80" viewBox="0 0 110 80" fill="none">
        <Trace spd="4.7s" points="0,55 62,55 62,22 92,22" stroke="var(--circuit-stroke)" />
        <Dot cx={62} cy={55} />
        <Dot cx={62} cy={22} />
        <Dot cx={92} cy={22} />

        <Trace spd="7.8s" dim points="0,70 40,70 40,40" stroke="var(--circuit-stroke-dim)" />
        <Dot cx={40} cy={70} />
        <Dot cx={40} cy={40} />
      </svg>

      {/* Bottom-right: higher than bottom-left */}
      <svg style={{ position: "absolute", bottom: 152, right: 0 }} width="110" height="80" viewBox="0 0 110 80" fill="none">
        <Trace spd="5.5s" points="110,48 68,48 68,28 40,28" stroke="var(--circuit-stroke)" />
        <Dot cx={68} cy={48} />
        <Dot cx={68} cy={28} />
        <Dot cx={40} cy={28} />

        <Trace spd="9.2s" dim points="110,68 80,68 80,52 60,52" stroke="var(--circuit-stroke-dim)" />
        <Dot cx={80} cy={68} />
        <Dot cx={80} cy={52} />
        <Dot cx={60} cy={52} />
      </svg>
    </div>
  );
}
