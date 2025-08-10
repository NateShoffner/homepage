import { useBlogPosts } from "@hooks/useBlogPosts";
import useFancybox from "@hooks/useFancybox";
import { useProjectFromParams } from "@hooks/useProjects";
import { ProjectDownload } from "@types/Project";
import { Navigate } from "react-router-dom";

function Project() {
  const project = useProjectFromParams();
  const blogPosts = useBlogPosts({
    category: "Projects",
    tag: project?.name,
  });

  const [fancyboxRef] = useFancybox();

  const domain = project?.homepage
    ? new URL(project.homepage).hostname.replace("www.", "")
    : "N/A";

  if (!project) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <section className="page-section p-4 p-lg-5 d-flex flex-column">
        <div className="my-auto">
          <div className="project">
            <div className="row">
              <div className="col-12 col-sm-2 col-md-1 my-auto">
                <img
                  src={`/assets/images/projects/${project?.slug}/${project?.logo}`}
                  className="img-fluid mx-auto d-block project-logo"
                  alt={project?.name}
                />
              </div>
              <div className="col-12 col-sm-10 col-md-11 mt-3">
                <h1>{project?.name}</h1>
              </div>
            </div>
            <p>{project?.description}</p>
            {project?.images && project.images.length > 0 && (
              <div className="project-images-container" ref={fancyboxRef}>
                {project.images.map((image, index) => (
                  <a
                    href={`/assets/images/projects/${project.slug}/${image.filename}`}
                    key={index}
                    className="fancybox"
                    data-fancybox="screenshots"
                  >
                    <img
                      key={index}
                      src={`/assets/images/projects/${project.slug}/${image.filename}`}
                      className="img-fluid project-image"
                      alt={image.alt || `Screenshot ${index + 1}`}
                    />
                  </a>
                ))}
              </div>
            )}
            <div className="row">
              <div className="col-12 col-md-6">
                <table className="table table-sm table-striped project-table">
                  <thead>
                    <tr>
                      <th colSpan={2}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <i className="fa fa-history"></i> Version:
                      </td>
                      <td>{project?.version}</td>
                    </tr>
                    <tr>
                      <td>
                        <i className="fa fa-calendar"></i> Updated:
                      </td>
                      <td>
                        {project?.updated
                          ? new Date(project.updated).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <i className="fa fa-desktop"></i> Platform(s):
                      </td>
                      <td>{project?.platforms.join(", ")}</td>
                    </tr>
                    <tr>
                      <td>
                        <i className="fa fa-home"></i> Homepage:
                      </td>
                      <td>
                        <a
                          href={project?.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {domain}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <i className="fa fa-code"></i> Open Source:
                      </td>
                      <td>{project?.open_source}</td>
                    </tr>
                    <tr>
                      <td>
                        <i className="fa fa-file"></i> License:
                      </td>
                      <td>{project?.license}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {project?.downloads && (
                <div className="col-12 col-md-6">
                  <table className="table table-sm table-striped project-table">
                    <thead>
                      <tr>
                        <th colSpan={2}>Downloads</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.downloads.map(
                        (download: ProjectDownload, index) => (
                          <tr key={index}>
                            <td>
                              <i className="fa fa-download"></i> {download.name}
                              <br />
                              <span className="project-description">
                                {download?.description}
                              </span>
                            </td>
                            <td className="download">
                              <a
                                href={download.url}
                                role="button"
                                className="btn btn-primary btn-block btn-download"
                              >
                                Download
                              </a>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-12 col-md-6">
                <table className="table table-sm table-striped project-table">
                  <thead>
                    <tr>
                      <th colSpan={2}>
                        Latest Blog Posts About {project?.name}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts.length > 0 ? (
                      blogPosts.slice(0, 4).map((post, index) => (
                        <tr key={index}>
                          <td>
                            <a href={post.url}>{post.title}</a>
                          </td>
                          <td>
                            <i className="fa fa-calendar"></i>{" "}
                            {post.date
                              ? new Date(post.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : ""}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2}>No blog posts available. :(</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Project;
