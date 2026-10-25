import { useEffect, useState } from "react";

/**
 * Tracks which of the given sections the reader is currently in.
 *
 * Selection is by section top against an activation line `offset` px below the
 * viewport top: the active section is the last one whose top has crossed it.
 * Deliberately not by how much of a section is on screen — the sections differ
 * in height by an order of magnitude (projects runs several screens, work is
 * under one), so any measure of visible area or intersection ratio is biased
 * toward the short ones and the tall sections never win.
 */
export function useScrollSpy(ids: string[], offset = 80) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Callers build this array inline, so a new identity arrives on every render.
  // Key the effect on the contents instead of rebinding listeners each time.
  const key = ids.join(",");

  useEffect(() => {
    const list = key ? key.split(",") : [];
    if (!list.length) return;

    let frame: number | null = null;

    const update = () => {
      frame = null;

      const found = list
        .map((id) => ({
          id,
          el:
            document.getElementById(id) ??
            document.querySelector<HTMLElement>(`[name="${id}"]`),
        }))
        .filter((s): s is { id: string; el: HTMLElement } => s.el !== null);

      if (!found.length) return;

      // A short last section can sit entirely below the activation line and so
      // never claim it. Once there is no more page to scroll, it wins outright.
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) {
        setActiveId(found[found.length - 1].id);
        return;
      }

      // Closest top at or above the line. Comparing tops rather than trusting
      // array order keeps this right if the nav is ever reordered.
      let current = found[0];
      let best = -Infinity;
      for (const section of found) {
        const top = section.el.getBoundingClientRect().top - offset;
        if (top <= 0 && top > best) {
          best = top;
          current = section;
        }
      }
      setActiveId(current.id);
    };

    const onScroll = () => {
      if (frame == null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame != null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key, offset]);

  return activeId;
}
