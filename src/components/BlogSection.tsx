import { useBlogPosts } from "@hooks/useBlogPosts";
import { BlogPostCard } from "./BlogPostCard";

interface BlogSectionProps {
  limit?: number;
}

export function BlogSection({ limit }: BlogSectionProps) {
  const posts = useBlogPosts().slice(0, limit);

  return (
    <>
      <p className="pb-5">
        Incoherent ramblings, project updates, reviews, and other writings
        fallen into the ether.
      </p>
      <div className="row">
        {posts.map((post) => (
          <div className="col-sm-12 col-md-6 col-lg-4 mb-5">
            <BlogPostCard post={post} />
          </div>
        ))}
      </div>

      <script
        id="dsq-count-scr"
        src="//nateshoffner.disqus.com/count.js"
        async
      ></script>
    </>
  );
}

export default BlogSection;
