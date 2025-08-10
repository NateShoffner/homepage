import ContactSection from "@components/ContactSection";
import { Helmet } from "react-helmet";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact &bull; Nate Shoffner</title>
      </Helmet>
      <section className="page-section p-4 p-lg-5 d-flex flex-column">
        <div className="my-auto">
          <ContactSection />
        </div>
      </section>
    </>
  );
};

export default Contact;
