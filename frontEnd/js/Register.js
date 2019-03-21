document
  .getElementById("registerSubmit")
  .addEventListener("click", function(e) {
    e.preventDefault();
    const username = document.getElementById("userField").value;
    const email = document.getElementById("emailField").value;
    const password = document.getElementById("pwdField").value;
    const password2 = document.getElementById("pwd2Field").value;
    const request = new HttpClient();
    const data = { username, password, password2, email };
    console.log(data);
    request.postJSON(
      data,
      "https://protected-tundra-24167.herokuapp.com/register/",
      handleResponse
    );
  });

function handleResponse(res) {
  console.log(res);
  if (res !== "success") {
    let errors = [];
    let responseErrors = JSON.parse(res);
    for (let error of responseErrors) {
      let paragraph = document.createElement("p");
      paragraph.innerHTML = error;
      errors.push(paragraph);
    }

    for (let e of errors) {
      document.getElementById("errors").appendChild(e);
    }
  } else {
    document.getElementById("errors").innerHTML = "Successfully registered";
  }
}
