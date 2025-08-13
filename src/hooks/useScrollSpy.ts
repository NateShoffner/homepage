import { useEffect, useState } from "react";

export function useScrollSpy(ids: string[], offset = 80) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id) || document.querySelector<HTMLElement>(`[name="${id}"]`))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    // Root margin makes the "center band" the active zone.
    const observer = new IntersectionObserver(
      (entries) => {
        // pick the one with the largest intersection ratio
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        root: null,
        // top and bottom offset so the highlighted item corresponds to the viewport center-ish
        rootMargin: `-${offset}px 0px -${window.innerHeight / 2}px 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, offset]);

  return activeId;
}
