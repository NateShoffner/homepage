type Image = {
  filename: string;
  alt?: string;
  title?: string;
};

type Props = {
  images: Image[];
  group?: string;
};

export default function PostImages({ images, group }: Props) {
  return (
    <div className="project-images-container">
      {images.map((image, idx) => (
        <a
          key={idx}
          href={`/assets/images/posts/${image.filename}`}
          className="fancybox"
          rel={group ? `${group}` : undefined}
        >
          <img
            src={`/assets/images/posts/${image.filename}`}
            className={`img-fluid post-image`}
            alt={image.alt || ""}
            title={image.title || ""}
          />
        </a>
      ))}
    </div>
  );
}
