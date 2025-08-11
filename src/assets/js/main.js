// navbar item activation via scrolling
$("body").scrollspy({
  target: "#navbar",
});

// close responsive navbar when item is clicked
$(".navbar-collapse ul li a").click(function () {
  $(".navbar-collapse").collapse("hide");
});

$(document).ready(function () {
  $(document).click(function (event) {
    var clickover = $(event.target);
    var _opened = $(".navbar-collapse").hasClass("show");
    if (_opened === true && !clickover.hasClass("navbar-toggler")) {
      $(".navbar-toggler").click();
    }
  });
});

// enable relative-agnostic navigation via navbar links
$("#navbar a").click(function (e) {
  var anchor = $(this).attr("href");
  var siteBase = window.location.protocol.concat(
    "//",
    window.location.hostname,
    "/"
  );
  var absolute = siteBase.concat(anchor);
  var currentBase = document.location.href.match(/(^[^#]*)/)[0];

  if (typeof siteBase != "" && siteBase != currentBase) {
    window.location = absolute;
  }
});

// contact form submission
$("#contact-form").submit(function (e) {
  e.preventDefault();
  $.ajax({
    url: "https://contact.nateshoffner.com/send",
    data: $(this).serialize(),
    type: "POST",
    error: function (xhr, ajaxOptions, thrownError) {
      $("#contact-form").hide();
      $("#contact-result-error").show();
    },
    success: function (data) {
      if (data.success) {
        $("#contact-form").hide();
        $("#contact-result-success").show();
      } else {
        $("#contact-form").hide();
        $("#contact-result-error").show();
      }
    },
  });
});
