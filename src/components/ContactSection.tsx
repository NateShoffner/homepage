import React from "react";

export function ContactSection() {
  return (
    <>
      <h2 className="mb-5">
        Contact <span className="text-highlight">Me</span>
      </h2>

      <p>
        Have a question or just want to say hello? Fill out the form below and I&apos;ll get back to you.
      </p>

      <div
        id="contact-result-success"
        className="alert alert-success"
        role="alert"
        style={{ display: "none" }}
      >
        Your message has been sent! I will try to respond to you as soon as
        possible. Thanks!
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
        <div className="col-lg-9">
          <div className="form-group">
            <input
              type="text"
              className="form-control transparent"
              name="name"
              id="name"
              placeholder="Name"
              defaultValue=""
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control transparent"
              id="email"
              name="email"
              placeholder="Email"
              defaultValue=""
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              id="message"
              className="form-control transparent"
              placeholder="Message"
              rows={5}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <div
              className="g-recaptcha"
              data-sitekey="{{ site.recaptcha_site_key }}"
            ></div>
          </div>
          <input
            type="submit"
            name="submit"
            id="submit"
            defaultValue="Submit"
            className="btn btn-primary pull-right"
          />
        </div>
      </form>
    </>
  );
}

export default ContactSection;
