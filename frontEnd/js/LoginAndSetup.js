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
loginSubmit.onmouseover = function(){
  this.style.cursor = "pointer";
}

loginForm.appendChild(loginUsername);
loginForm.appendChild(loginPassword);
loginForm.appendChild(loginSubmit);
loginBox.appendChild(loginForm);

const setupForm = document.createElement("form");
setupForm.id = "setupForm";
const setupUsername = document.createElement("input");
setupUsername.type = "text";
setupUsername.name = "setuser";
setupUsername.className = "signinput";
setupUsername.placeholder = "Username";

const setupEmail = document.createElement("input");
setupEmail.type = "text";
setupEmail.name = "setemail";
setupEmail.className = "signinput";
setupEmail.placeholder = "Username";

const setupPassword = document.createElement("input");
setupPassword.type = "password";
setupPassword.name = "setpwd";
setupPassword.className = "signinput";
setupPassword.placeholder = "Password";

const setupRePassword = document.createElement("input");
setupRePassword.type = "password";
setupRePassword.name = "setrepwd";
setupRePassword.className = "signinput";
setupRePassword.placeholder = "Re-Password";

const setupSubmit = document.createElement("input");
setupSubmit.type = "submit";
setupSubmit.value = "";
setupSubmit.name = "submit";
setupSubmit.onmouseover = function(){
  this.style.cursor = "pointer";
}

setupForm.appendChild(setupUsername);
setupForm.appendChild(setupEmail);
setupForm.appendChild(setupPassword);
setupForm.appendChild(setupRePassword);
setupForm.appendChild(setupSubmit);
loginBox.appendChild(setupForm);

const select = document.createElement("ul");
const loginSelect = document.createElement("li");
const setupSelect = document.createElement("li");
const selectmove = document.createElement("li");
selectmove.className = "selectmove";
loginSelect.innerHTML = "Login";
setupSelect.innerHTML = "Setup";
select.appendChild(loginSelect);
select.appendChild(setupSelect);
select.appendChild(selectmove);
loginBox.appendChild(select);

loginButton.onclick = () => {
  loginBox.style.display = "block";
  loginForm.style.display = "block";
  setupForm.style.display = "none";
  blur.style.display = "block";
  selectmove.style.left = "50px";
}

loginSelect.onclick = () => {
  loginForm.style.display = "block";
  setupForm.style.display = "none";
  selectmove.style.left = "50px";
}

blur.onclick = () => {
  //loginForm.reset();
  loginBox.style.display = "none";
  blur.style.display = "none";
}

setupSelect.onclick = () =>{
  loginForm.style.display = "none";
  setupForm.style.display = "block";
  selectmove.style.left = "250px";
}
