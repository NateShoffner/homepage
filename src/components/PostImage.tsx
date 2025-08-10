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

  return (
    <a href={imageUrl} className="fancybox">
      <img
        src={imageUrl}
        className={`img-fluid post-image${className ? ` ${className}` : ""}`}
        alt={alt}
        title={title}
      />
    </a>
  );
}
