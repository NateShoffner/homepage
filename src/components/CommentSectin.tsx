import { useEffect } from "react";

function CommentSection() {
  useEffect(() => {
    const disqus_shortname = "nateshoffner";
    const dsq = document.createElement("script");
    dsq.type = "text/javascript";
    dsq.async = true;
    dsq.src = `https://${disqus_shortname}.disqus.com/embed.js`;
    (
      document.getElementsByTagName("head")[0] ||
      document.getElementsByTagName("body")[0]
    ).appendChild(dsq);
    return () => {
      // Optional: Clean up the script if needed
      if (dsq.parentNode) {
        dsq.parentNode.removeChild(dsq);
      }
    };
  }, []);

  return (
    <div className="post-comments">
      <div id="disqus_thread"></div>
    </div>
  );
}

export default CommentSection;
