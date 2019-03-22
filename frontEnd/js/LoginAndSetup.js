const loginButton = document.getElementById("loginButton");
const blur = document.getElementById("blur");
const loginBox = document.getElementById("loginBox");

const loginForm = document.createElement("form");
loginForm.id = "loginForm";



const loginUsername = document.createElement("input");
loginUsername.type = "text";
loginUsername.name = "user";
loginUsername.className = "signinput";
loginUsername.placeholder = "Username";
const loginPassword = document.createElement("input");
loginPassword.type = "password";
loginPassword.name = "pwd";
loginPassword.className = "signinput";
loginPassword.placeholder = "Password";
const loginSubmit = document.createElement("input");
loginSubmit.type = "submit";
loginSubmit.value = "";
loginSubmit.name = "submit";
loginSubmit.onmouseover = function() {
  this.style.cursor = "pointer";
};

loginForm.appendChild(loginUsername);
loginForm.appendChild(loginPassword);
loginForm.appendChild(loginSubmit);
loginBox.appendChild(loginForm);

const registerForm = document.createElement("form");
registerForm.id = "registerForm";
const registerUsername = document.createElement("input");
registerUsername.type = "text";
registerUsername.name = "setuser";
registerUsername.className = "signinput";
registerUsername.placeholder = "Username";

const registerEmail = document.createElement("input");
registerEmail.type = "text";
registerEmail.name = "setemail";
registerEmail.className = "signinput";
registerEmail.placeholder = "Email";

const registerPassword = document.createElement("input");
registerPassword.type = "password";
registerPassword.name = "setpwd";
registerPassword.className = "signinput";
registerPassword.placeholder = "Password";

const registerRePassword = document.createElement("input");
registerRePassword.type = "password";
registerRePassword.name = "setrepwd";
registerRePassword.className = "signinput";
registerRePassword.placeholder = "Re-Password";

const registerSubmit = document.createElement("input");
registerSubmit.type = "submit";
registerSubmit.value = "";
registerSubmit.name = "submit";
registerSubmit.onmouseover = function() {
  this.style.cursor = "pointer";
};

registerForm.appendChild(registerUsername);
registerForm.appendChild(registerEmail);
registerForm.appendChild(registerPassword);
registerForm.appendChild(registerRePassword);

const errorsArea = document.createElement("div");
errorsArea.id = "errors";
registerForm.appendChild(errorsArea);

registerForm.appendChild(registerSubmit);
loginBox.appendChild(registerForm);

const select = document.createElement("ul");
const loginSelect = document.createElement("li");
const registerSelect = document.createElement("li");
const selectmove = document.createElement("li");
selectmove.className = "selectmove";
loginSelect.innerHTML = "Login";
registerSelect.innerHTML = "Register";
select.appendChild(loginSelect);
select.appendChild(registerSelect);
select.appendChild(selectmove);
loginBox.appendChild(select);

loginButton.onclick = () => {
  loginBox.style.display = "block";
  loginForm.style.display = "block";
  registerForm.style.display = "none";
  blur.style.display = "block";
  selectmove.style.left = "50px";
};

loginSelect.onclick = () => {
  loginForm.style.display = "block";
  registerForm.style.display = "none";
  selectmove.style.left = "50px";
};

blur.onclick = () => {
  //loginForm.reset();
  loginBox.style.display = "none";
  blur.style.display = "none";
};

registerSelect.onclick = () => {
  loginForm.style.display = "none";
  registerForm.style.display = "block";
  selectmove.style.left = "250px";
};

registerSubmit.addEventListener("click", function(e) {
  e.preventDefault();
  const username = registerUsername.value;
  const email = registerEmail.value;
  const password = registerPassword.value;
  const password2 = registerRePassword.value;
  const request = new HttpClient();
  const data = { username, password, password2, email };
  console.log(data);
  request.postJSON(
    data,
    "https://protected-tundra-24167.herokuapp.com/register/",
    handleRegisterResponse
  );
});

function handleRegisterResponse(res) {
  console.log(res);
  document.getElementById("errors").innerHTML = "";
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
