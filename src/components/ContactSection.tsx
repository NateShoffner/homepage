import React from "react";

export function ContactSection() {
  return (
    <>
      <h2 className="mb-2 text-center">
        Contact <span className="text-highlight">Me</span>
      </h2>

      <p className="mb-4 text-center">
        Have a question or just want to say hello? Fill out the form below and I&apos;ll get back to you.
      </p>

      <div className="row justify-content-center">
        <div className="col-xl-6 col-lg-8 col-md-10">
          <div
            id="contact-result-success"
            className="alert alert-success"
            role="alert"
            style={{ display: "none" }}
          >
            Your message has been sent! I will try to respond to you as soon as possible. Thanks!
          </div>

          <div
            id="contact-result-error"
            className="alert alert-danger"
            role="alert"
            style={{ display: "none" }}
          >
            Your message could not be sent. Please try again later.
          </div>

          <form id="contact-form" action="" method="post">
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label small text-muted mb-1">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      id="name"
                      placeholder="Your name"
                      defaultValue=""
                      required
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label small text-muted mb-1">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="your@email.com"
                      defaultValue=""
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-group mt-2">
                <label htmlFor="message" className="form-label small text-muted mb-1">Message</label>
                <textarea
                  name="message"
                  id="message"
                  className="form-control"
                  placeholder="What's on your mind?"
                  rows={5}
                  required
                />
              </div>
              <div className="form-group mt-3">
                <div
                  className="g-recaptcha"
                  data-sitekey="{{ site.recaptcha_site_key }}"
                />
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button
                  type="submit"
                  name="submit"
                  id="submit"
                  className="btn btn-primary px-4"
                >
                  Send Message
                </button>
              </div>
            </form>
        </div>
      </div>
    </>
  );
}

export default ContactSection;
