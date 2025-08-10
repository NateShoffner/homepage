import React from "react";

export function ContactSection() {
  return (
    <>
      <h2 className="mb-5">
        Contact <span className="text-highlight">Me</span>
      </h2>

      <p>
        If you want to get in touch with me, just drop me a message. I’ll try to
        respond to you as soon as possible.
      </p>

      <p>
        You can also try contacting me via Twitter{" "}
        <a href="https://twitter.com/NateShoffner">@NateShoffner</a>.
      </p>

      <p>
        If there is a problem with the site, feel free to open an issue on the{" "}
        <a href="https://github.com/NateShoffner/nateshoffner.github.io/issues">
          issue tracker
        </a>
        .
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
        Your message could not be sent. You can also try contacting me via
        Twitter <a href="https://twitter.com/NateShoffner">@NateShoffner</a>.
      </div>

      <form id="contact-form" action="" method="post">
        <div className="col-lg-9">
          <div className="form-group">
            <label htmlFor="name">Your Name:</label>
            <input
              type="text"
              className="form-control transparent"
              name="name"
              id="name"
              placeholder="Enter Name"
              value=""
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your Email:</label>
            <input
              type="email"
              className="form-control transparent"
              id="email"
              name="email"
              placeholder="Enter Email"
              value=""
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              className="form-control transparent"
              id="subject"
              name="subject"
              placeholder="Enter Subject"
              value=""
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              name="message"
              id="message"
              className="form-control transparent"
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
            value="Submit"
            className="btn btn-primary pull-right"
          />
        </div>
      </form>
    </>
  );
}

export default ContactSection;
