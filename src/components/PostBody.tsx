import Markdown from "@components/Markdown";

export default function BlogPost({ body }: { body: string }) {
  return (
    <article className="post-content">
      <Markdown>{body}</Markdown>
    </article>
  );
}
