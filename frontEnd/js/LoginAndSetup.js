const loginButton = document.getElementById("loginButton");
const blur = document.getElementById("blur");
const loginBox = document.getElementById("loginBox");

loginButton.onclick = () => {
  // loginBox.style.display = "flex";
  createLoginForm();
}

function createLoginForm(){
  blur.style.display = "block";
  loginBox.style.display = "block"
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
  loginSubmit.onmouseover = function(){
    this.style.cursor = "pointer";
  }
  loginForm.appendChild(loginUsername);
  loginForm.appendChild(loginPassword);
  loginForm.appendChild(loginSubmit);

  loginBox.appendChild(loginForm);

}
blur.onclick = () => {
  //loginForm.reset();
  loginBox.style.display = "none";
  blur.style.display = "none";
}
