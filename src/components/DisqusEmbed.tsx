"use client";

import { useEffect, useState } from "react";

interface Props {
  shortname: string;
  url: string;
}

export default function DisqusEmbed({ shortname, url }: Props) {
  const [colorScheme, setColorScheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const read = () =>
      setColorScheme(
        document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"
      );
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const cfg = function (this: { page: Record<string, unknown> }) {
      this.page.url = url;
      this.page.colorScheme = colorScheme;
    };

    if (w.DISQUS) {
      w.DISQUS.reset({ reload: true, config: cfg });
    } else {
      w.disqus_config = cfg;
      w.disqus_shortname = shortname;
      if (!document.getElementById("dsq-embed-scr")) {
        const script = document.createElement("script");
        script.src = `https://${shortname}.disqus.com/embed.js`;
        script.async = true;
        script.id = "dsq-embed-scr";
        document.body.appendChild(script);
      }
    }
  }, [shortname, url, colorScheme]);

  return <div id="disqus_thread" />;
}
