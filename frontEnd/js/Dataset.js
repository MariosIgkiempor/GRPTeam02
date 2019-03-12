const client = new HttpClient();

client.get(
  "https://protected-tundra-24167.herokuapp.com/api/names",
  makeListOfNames
);

function makeListOfNames(response) {
  const list = document.createElement("ul");
  list.style.listStyle = "none inside none";
  list.style.padding = "10px";
  list.style.lineHeight = "45px";
  list.style.fontSize = "25px";
  const names = JSON.parse(response).list;

  console.log(names);

  var i = 0;
  for (const name of names) {
    i = i % 4;
    const listItem = document.createElement("li");
    // listItem.innerHTML = name;
    listItem.style.padding = "0px 10px";
    switch (i) {
      case 0:
        listItem.style.backgroundColor = "#0094CB";
        break;
      case 1:
        listItem.style.backgroundColor = "#FFFFFF";
        break;
      case 2:
        listItem.style.backgroundColor = "#00AFD8";
        break;
      case 3:
        listItem.style.backgroundColor = "#FFFFFF";
        break;
    }
    listItem.ondblclick = function() {
      window.location.href = "Analysis.html?" + name;
    };
    listItem.innerHTML = name;
    listItem.classList.add("hover-grey");
    // listItem.appendChild(listButton);
    list.appendChild(listItem);
    i++;
  }

  document.querySelector("#output").innerHTML = "";
  document.querySelector("#output").appendChild(list);
}

const uploadButton = document.getElementById("upload-btn");
const uploader = document.getElementById("uploader");
const blur = document.getElementById("blur");
const submit = document.querySelector("form button");
uploadButton.onclick = () => {
  uploader.style.display = "flex";
  blur.style.display = "block";
};

submit.onclick = blur.onclick = () => {
  uploader.style.display = "none";
  blur.style.display = "none";
};

document.getElementById("upload-form").addEventListener("submit", e => {
  e.preventDefault();
  const fileChooser = document.getElementById("file-chooser");
  const file = fileChooser.files["0"];
  console.log("posting", file);
  const data = new FormData();
  data.append("newFile", fileChooser.files[0]);
  client.post(
    data,
    "https://protected-tundra-24167.herokuapp.com/api/upload/",
    makeListOfNames
  );
});
