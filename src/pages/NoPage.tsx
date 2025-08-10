import { Helmet } from "react-helmet";

const NoPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found &bull; Nate Shoffner</title>
      </Helmet>
      <section className="page-section error-404 p-4 p-lg-5 d-flex d-column">
        <div className="my-auto">
          <h1>
            404 <span className="text-highlight">Page Not Found</span>
          </h1>
          <h3 className="mb-5">
            Oops, the page you're looking for does not exist.
          </h3>

          <p>
            Click <a href="/">here</a> to return to the homepage. If you think
            something is broken, <a href="/#contact">report a problem</a>.
          </p>
        </div>
      </section>
    </>
  );
};

export default NoPage;
