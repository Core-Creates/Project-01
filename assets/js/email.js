$(document).ready(function () {
  $("#myForm").on("submit", function (event) {
    event.preventDefault();
    event.target.reset(); 

    var formData = new FormData(this);
    formData.append("service_id", "service_feiqn46");
    formData.append("template_id", "template_2150y6h");
    formData.append("user_id", "user_3iuDlD076rrwO2NNnA6au");

    $.ajax("https://api.emailjs.com/api/v1.0/email/send-form", {
      type: "POST",
      data: formData,
      contentType: false, 
      processData: false, 
    })
      .done(function () {
        alert("Your mail is sent!");
      })
      .fail(function (error) {
        alert("Oops... " + JSON.stringify(error));
      });
  });
});

