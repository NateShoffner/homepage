import { BlogPost } from "@data/blogIndex";

function getBlogPostImage(post: BlogPost): string {
  if (post.image) {
    return `/assets/images/posts/${post.image}`;
  }
  return `/assets/images/posts/default.png`;
}

function getBlogPostExcerpt(post: BlogPost): string {
  const source = post.markdown;
  const paragraphs = source.split(/\n\s*\n/); // Split by blank lines
  return paragraphs[0].trim();
}

function getBlogPostUrl(post: BlogPost): string {
  const url = `/blog/${new Date(post.date).getFullYear()}/${String(
    new Date(post.date).getMonth() + 1
  ).padStart(2, "0")}/${post.slug}`;
    return url;
}

export { getBlogPostImage, getBlogPostExcerpt, getBlogPostUrl };