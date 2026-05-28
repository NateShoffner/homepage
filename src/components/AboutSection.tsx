"use client";

import { useState, useEffect, useMemo } from "react";
import { ReactTyped } from "react-typed";
import { tokenizeJson } from "../utils/jsonTokenizer";
import type { Profile, ProfileRole } from "@/lib/profile";

// Render a JSON snippet string with syntax coloring.
// Multi-line snippets (containing \n) are split into <div> rows so indentation
// whitespace tokens (which carry white-space:pre) render correctly.
function jsnip(snippet: string): React.ReactNode {
  if (!snippet.includes("\n")) {
    return tokenizeJson(snippet).map(({ text, type }, i) => (
      <span key={i} className={`json-token-${type}`}>
        {text}
      </span>
    ));
  }
  return snippet.split("\n").map((line, li) => (
    <div key={li}>
      {tokenizeJson(line).map(({ text, type }, i) => (
        <span key={i} className={`json-token-${type}`}>
          {text}
        </span>
      ))}
    </div>
  ));
}

// Produces `"key": <serialized value>` with standard 2-space indent for objects/arrays.
function field(key: string, value: unknown): string {
  return `${JSON.stringify(key)}: ${JSON.stringify(value, null, 2)}`;
}

// Roles are serialized as compact single-line objects rather than the verbose
// multi-line default so they fit naturally in the brief JSON reveal phase.
function rolesSnippet(roles: ProfileRole[]): string {
  const lines = roles.map((r, i) => {
    const obj: Record<string, unknown> = { title: r.title, current: r.current };
    if (r.verified !== undefined) obj.verified = r.verified;
    return `  ${JSON.stringify(obj)}${i < roles.length - 1 ? "," : ""}`;
  });
  return `"roles": [\n${lines.join("\n")}\n]`;
}

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
  const [jsonFading, setJsonFading] = useState(false);
  const [jsonGone, setJsonGone] = useState(false);
  const Tag = asList ? "li" : "div";

  useEffect(() => {
    if (!revealed) return;
    const t1 = setTimeout(() => setJsonFading(true), revealDelay);
    const t2 = setTimeout(() => setJsonGone(true), revealDelay + 180);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [revealed, revealDelay]);

  return (
    <Tag
      className={`about-item${asList && !jsonGone ? " about-list-json-phase" : ""}`}
      style={{ "--ad": appearDelay, position: "relative" } as React.CSSProperties}
    >
      {/* Real content always in DOM — sets the container height.
          Use span for list items so the ::before bullet stays inline. */}
      {asList ? (
        <span
          style={{
            opacity: jsonGone ? 1 : 0,
            transition: jsonGone ? "opacity 0.28s cubic-bezier(0,0,0.2,1)" : undefined,
          }}
        >
          {children}
        </span>
      ) : (
        <div
          style={{
            opacity: jsonGone ? 1 : 0,
            transition: jsonGone ? "opacity 0.28s cubic-bezier(0,0,0.2,1)" : undefined,
          }}
        >
          {children}
        </div>
      )}
      {/* JSON overlay sits on top without affecting layout */}
      {!jsonGone && (
        <div
          className="about-json-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            opacity: jsonFading ? 0 : 1,
            transition: "opacity 0.18s ease-out",
            pointerEvents: "none",
          }}
        >
          {jsonContent}
        </div>
      )}
    </Tag>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface AboutSectionProps {
  profile: Profile | null;
  onRevealed?: () => void;
}

export function AboutSection({ profile, onRevealed }: AboutSectionProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const tid = setTimeout(() => setRevealed(true), 900);
    return () => clearTimeout(tid);
  }, []);

  // Notify parent after the last AboutReveal item finishes its transition.
  // Last item has revealDelay=410, plus 160ms fade = 570ms after revealed fires.
  useEffect(() => {
    if (!revealed || !onRevealed) return;
    const tid = setTimeout(onRevealed, 570);
    return () => clearTimeout(tid);
  }, [revealed, onRevealed]);

  const snippets = useMemo(() => {
    if (!profile) return null;
    return {
      author: jsnip(field("author", profile.author)),
      about: jsnip(
        field("about", {
          yearsExperience: profile.years_experience,
          openToWork: profile.open_to_work,
        }),
      ),
      description: jsnip(field("description", profile.description)),
      roles: jsnip(rolesSnippet(profile.roles)),
      focusAreas: jsnip('"focus_areas": ['),
      focusItem: (item: string, last: boolean) =>
        jsnip(`${JSON.stringify(item)}${last ? "" : ","}`),
    };
  }, [profile]);

  const focusAreas = profile?.focus_areas ?? [];

  return (
    <div>
      {/* ── Name ── */}
      <AboutReveal
        revealed={revealed}
        revealDelay={0}
        appearDelay="0s"
        jsonContent={snippets?.author}
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
            jsonContent={snippets?.about}
          >
            <h3 className="subheading mb-5">About</h3>
          </AboutReveal>

          <AboutReveal
            revealed={revealed}
            revealDelay={190}
            appearDelay="0.25s"
            jsonContent={snippets?.roles}
          >
            <p>
              {profile?.roles.map((r, i) => (
                <span key={r.title}>
                  {r.url ? <a href={r.url}>{r.title}</a> : r.title}
                  {i < (profile?.roles.length ?? 0) - 1 ? " & " : ""}
                </span>
              ))}
              {profile
                ? `, based in ${profile.location.city}, ${profile.location.state}.`
                : ""}
            </p>
          </AboutReveal>

          <AboutReveal
            revealed={revealed}
            revealDelay={300}
            appearDelay="0.33s"
            jsonContent={snippets?.description}
          >
            {profile?.description.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </AboutReveal>

          <AboutReveal
            revealed={revealed}
            revealDelay={410}
            appearDelay="0.42s"
            jsonContent={jsnip(
              '"links": [\n  "github.com/nateshoffner",\n  "techlancaster.org"\n]',
            )}
          >
            <p className="mb-5">
              Always working on something new. Check out my{" "}
              <a href="https://github.com/nateshoffner">GitHub</a> or find me in
              the <a href="https://techlancaster.org/">Tech Lancaster</a>{" "}
              community.
            </p>
          </AboutReveal>
        </div>

        {/* ── Focus Areas column ── */}
        <div className="col-12 col-md-12 col-lg-6 d-lg-flex flex-lg-column">
          <AboutReveal
            revealed={revealed}
            revealDelay={115}
            appearDelay="0.22s"
            jsonContent={snippets?.focusAreas}
          >
            <h3 className="subheading mb-5">Focus Areas</h3>
          </AboutReveal>

          <ul className="highlighted inlined-list focus-areas-list">
            {focusAreas.map((item, i) => (
              <AboutReveal
                key={item}
                asList
                revealed={revealed}
                revealDelay={200 + i * 70}
                appearDelay={`${0.28 + i * 0.05}s`}
                jsonContent={snippets?.focusItem(
                  item,
                  i === focusAreas.length - 1,
                )}
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
