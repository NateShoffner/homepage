import { BlogPost } from "@data/blogIndex";
import {
  getBlogPostImage,
  getBlogPostExcerpt,
  getBlogPostUrl,
} from "@utils/blogUtils";
import { Link } from "react-router-dom";

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <div className="card blog-card h-100 pt-2">
      <Link to={getBlogPostUrl(post)}>
        <img
          src={getBlogPostImage(post)}
          className="card-img-top img-fluid"
          alt={post.title}
        />
      </Link>
      <div className="card-body">
        <h5 className="card-title">
          <Link to={getBlogPostUrl(post)}>{post.title}</Link>
        </h5>
        <p
          className="card-text"
          dangerouslySetInnerHTML={{ __html: getBlogPostExcerpt(post) }}
        ></p>
        <p className="card-text">
          <Link to={getBlogPostUrl(post)} className="btn btn-primary">
            Read More &raquo;
          </Link>
        </p>
      </div>
      <div className="card-footer text-center text-muted">
        <ul className="post-meta">
          <li className="post-meta-item">
            <i className="fa fa-calendar"></i>{" "}
            {new Date(post.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "2-digit",
            })}
          </li>
          <li className="post-meta-item">
            <i className="fa fa-comments"></i>{" "}
            <a href="{{ post.url }}#comments">
              <span
                className="disqus-comment-count"
                data-disqus-url="{{ site.url }}{{ post.url }}"
              >
                0 Comments
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export { BlogPostCard };
