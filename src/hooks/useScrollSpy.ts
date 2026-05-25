import { useEffect, useState } from "react";

export function useScrollSpy(ids: string[], offset = 80) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id) || document.querySelector<HTMLElement>(`[name="${id}"]`))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        root: null,
        rootMargin: `-${offset}px 0px -${window.innerHeight / 2}px 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));

    // The rootMargin bottom cutoff can miss a short last section (e.g. contact)
    // that sits entirely below the active zone. Force it when at the page bottom.
    const handleScroll = () => {
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      if (atBottom) setActiveId(ids[ids.length - 1]);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ids, offset]);

  return activeId;
}
