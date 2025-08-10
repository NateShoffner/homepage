import useFancybox from "@hooks/useFancybox";

type Props = {
  filename: string;
  alt?: string;
  title?: string;
  className?: string;
};

export default function PostImage({
  filename,
  alt = "",
  title = "",
  className,
}: Props) {
  const imageUrl = `/assets/images/posts/${filename}`;

  const fancyboxRef = useFancybox();

  return (
    <a href={imageUrl} className="fancybox" ref={fancyboxRef}>
      <img
        src={imageUrl}
        className={`img-fluid post-image${className ? ` ${className}` : ""}`}
        alt={alt}
        title={title}
        data-fancybox="post-image"
      />
    </a>
  );
}
