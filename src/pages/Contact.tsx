import ContactSection from "@components/ContactSection";
import PageHelmet from "@components/PageHelmet";

const Contact = () => {
  return (
    <>
      <PageHelmet title="Contact" />
      <section className="page-section p-4 p-lg-5 d-flex flex-column">
        <div className="my-auto">
          <ContactSection />
        </div>
      </section>
    </>
  );
};

export default Contact;
