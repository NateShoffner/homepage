"use client";

import { useState, useEffect } from "react";
import { ReactTyped } from "react-typed";

// ── JSON display helpers ───────────────────────────────────────────────────────

const JK = ({ k }: { k: string }) => (
  <>
    <span className="json-token-punctuation">&quot;</span>
    <span className="json-token-key">{k}</span>
    <span className="json-token-punctuation">&quot;: </span>
  </>
);
const JS = ({ v }: { v: string }) => (
  <>
    <span className="json-token-punctuation">&quot;</span>
    <span className="json-token-string">{v}</span>
    <span className="json-token-punctuation">&quot;</span>
  </>
);
const JP = ({ c }: { c: string }) => (
  <span className="json-token-punctuation">{c}</span>
);
const JArr = ({ items }: { items: string[] }) => (
  <>
    <JP c="[" />
    {items.map((item, i) => (
      <div key={i} style={{ paddingLeft: "1.2em" }}>
        <JS v={item} />
        {i < items.length - 1 && <JP c="," />}
      </div>
    ))}
    <JP c="]" />
  </>
);

// ── Per-item reveal component ──────────────────────────────────────────────────

interface RevealProps {
  jsonContent: React.ReactNode;
  children: React.ReactNode;
  revealed: boolean;
  revealDelay?: number;
  appearDelay: string;
  asList?: boolean;
}

function AboutReveal({
  jsonContent,
  children,
  revealed,
  revealDelay = 0,
  appearDelay,
  asList,
}: RevealProps) {
  const [state, setState] = useState<"json" | "fading" | "rendered">("json");
  const Tag = asList ? "li" : "div";

  useEffect(() => {
    if (!revealed) return;
    const t1 = setTimeout(() => setState("fading"), revealDelay);
    const t2 = setTimeout(() => setState("rendered"), revealDelay + 160);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [revealed, revealDelay]);

  if (state === "rendered") {
    return (
      <Tag
        className="about-item about-reveal-in"
        style={{ "--ad": "0s" } as React.CSSProperties}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={`about-item about-json-reveal${state === "fading" ? " about-json-fading" : ""}`}
      style={{ "--ad": appearDelay } as React.CSSProperties}
    >
      {jsonContent}
    </Tag>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────

const INTERESTS = [
  "Full-Stack & API Development",
  "Observability & Data Engineering (ELK)",
  "Mobile Development",
  "Embedded & IoT (ESP32)",
  "Reverse Engineering",
  "Homelab & Home Automation",
];

// ── Main component ─────────────────────────────────────────────────────────────

export function AboutSection() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const tid = setTimeout(() => setRevealed(true), 900);
    return () => clearTimeout(tid);
  }, []);

  return (
    <div>
      {/* ── Name ── */}
      <AboutReveal
        revealed={revealed}
        revealDelay={0}
        appearDelay="0s"
        jsonContent={
          <>
            <JK k="author" />
            <JS v="Nate Shoffner" />
          </>
        }
      >
        <h1 className="mb-5">
          <ReactTyped
            strings={['Nate <span class="text-highlight">Shoffner</span>']}
            typeSpeed={50}
            showCursor={true}
          />
        </h1>
      </AboutReveal>

      <div className="row">
        {/* ── About column ── */}
        <div className="col-12 col-md-12 col-lg-6">
          <AboutReveal
            revealed={revealed}
            revealDelay={85}
            appearDelay="0.2s"
            jsonContent={
              <>
                <JK k="about" />
                <JP c="{" />
              </>
            }
          >
            <h3 className="subheading mb-5">About</h3>
          </AboutReveal>

          <AboutReveal
            revealed={revealed}
            revealDelay={190}
            appearDelay="0.25s"
            jsonContent={
              <>
                <JK k="location" />
                <JS v="Lancaster, Pennsylvania" />
              </>
            }
          >
            <p>Software engineer based in Lancaster, Pennsylvania.</p>
          </AboutReveal>

          <AboutReveal
            revealed={revealed}
            revealDelay={300}
            appearDelay="0.33s"
            jsonContent={
              <>
                <JK k="description" />
                <JS v="Passionate about all things tech, solving interesting problems, learning how things work, and [simultaneously] breaking and building things." />
              </>
            }
          >
            <p>
              Passionate about all things tech, solving interesting problems,
              learning how things work, and [simultaneously] breaking and
              building things.
            </p>
          </AboutReveal>

          <AboutReveal
            revealed={revealed}
            revealDelay={410}
            appearDelay="0.42s"
            jsonContent={
              <>
                <JK k="roles" />
                <JP c="[" />
                <div style={{ paddingLeft: "1.2em" }}>
                  <JP c="{ " />
                  <JK k="title" />
                  <JS v="Senior Software Engineer" />
                  <JP c=" }," />
                </div>
                <div style={{ paddingLeft: "1.2em" }}>
                  <JP c="{ " />
                  <JK k="title" />
                  <JS v="Elastic Certified Engineer" />
                  <JP c=", " />
                  <JK k="url" />
                  <JS v="https://certified.elastic.co/d2170b39-7c27-4811-952f-3085d6a0dda5" />
                  <JP c=" }" />
                </div>
                <JP c="]" />
              </>
            }
          >
            <p>
              Currently working as a Senior Software Engineer and{" "}
              <a href="https://certified.elastic.co/d2170b39-7c27-4811-952f-3085d6a0dda5">
                Elastic Certified Engineer
              </a>
              .
            </p>
          </AboutReveal>

          <AboutReveal
            revealed={revealed}
            revealDelay={520}
            appearDelay="0.52s"
            jsonContent={
              <>
                <JK k="links" />
                <JArr
                  items={["github.com/nateshoffner", "techlancaster.org"]}
                />
              </>
            }
          >
            <p className="mb-5">
              I enjoy working on lots of little passion projects which you can
              find on my <a href="https://github.com/nateshoffner">GitHub</a>{" "}
              and getting involved within the{" "}
              <a href="https://techlancaster.org/">Lancaster Tech</a> scene.
            </p>
          </AboutReveal>
        </div>

        {/* ── Focus Areas column ── */}
        <div className="col-12 col-md-12 col-lg-6">
          <AboutReveal
            revealed={revealed}
            revealDelay={115}
            appearDelay="0.22s"
            jsonContent={
              <>
                <JK k="focus_areas" />
                <JP c="[" />
              </>
            }
          >
            <h3 className="subheading mb-5">Focus Areas</h3>
          </AboutReveal>

          <ul className="highlighted inlined-list">
            {INTERESTS.map((item, i) => (
              <AboutReveal
                key={item}
                asList
                revealed={revealed}
                revealDelay={200 + i * 70}
                appearDelay={`${0.28 + i * 0.05}s`}
                jsonContent={
                  <>
                    <JS v={item} />
                    {i < INTERESTS.length - 1 && <JP c="," />}
                  </>
                }
              >
                {item}
              </AboutReveal>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
