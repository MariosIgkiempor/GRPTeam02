const client = new HttpClient();
document.querySelector("#output").innerHTML =
  "Requesting http now, please wait";

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
        listItem.style.color = "#FFFFFF";
        break;
      case 1:
        listItem.style.backgroundColor = "#FFFFFF";
        listItem.style.color = "#00AFD8";
        break;
      case 2:
        listItem.style.backgroundColor = "#00AFD8";
        listItem.style.color = "#FFFFFF";
        break;
      case 3:
        listItem.style.backgroundColor = "#FFFFFF";
        listItem.style.color = "#00AFD8";
        break;
    }

    var downloadButton = CreateDownloadButton(name);
    listItem.innerHTML = name;
    listItem.appendChild(downloadButton);

    listItem.onmouseover = function() {
      this.style.cursor = "pointer";
      this.children[0].style.display = "inline";
    };
    listItem.onmouseout = function() {
      this.children[0].style.display = "none";
    };
    listItem.ondblclick = function() {
      window.location.href = "Analysis.html?" + name;
    };

    //listItem.classList.add("hover-grey");

    // listItem.appendChild(listButton);

    list.appendChild(listItem);
    i++;
  }

  document.querySelector("#output").innerHTML = "";
  document.querySelector("#output").appendChild(list);
}
function CreateDownloadButton(name) {
  var downloadButton = document.createElement("button");
  downloadButton.style.marginRight = "10%";
  downloadButton.style.marginTop = "2%";
  downloadButton.style.cssFloat = "right";
  downloadButton.innerHTML = "Download";
  downloadButton.style.display = "none";
  downloadButton.id = name;
  downloadButton.className = "download-button";
  downloadButton.addEventListener("click", () => handleDownload(name));
  return downloadButton;
}

// Inspired by https://stackoverflow.com/a/21016088
function handleDownload(filename) {
  const client = new HttpClient();
  client.get(
    "https://protected-tundra-24167.herokuapp.com/api/:" + filename,
    res => {
      let dataset = JSON.parse(res)[0];
      console.log(dataset);
      let { headings, vals, labels } = dataset;
      let fileStr = headings.join() + "\n";
      for (let i = 0; i < vals.length; ++i) {
        fileStr += `${vals[i].join()},${labels[i]}\n`;
      }

      let fileData = new Blob([fileStr], { type: "text/plain" });
      let downloadLink = document.createElement("a");
      downloadLink.setAttribute("download", filename);
      downloadLink.href = window.URL.createObjectURL(fileData);
      document.body.appendChild(downloadLink);

      // Wait for the downloadLink to be appended to the body and then immediately click it
      window.requestAnimationFrame(() => {
        downloadLink.dispatchEvent(new MouseEvent("click"));
        document.body.removeChild(downloadLink);
      });
    }
  );
}

const uploadButton = document.getElementById("upload-btn");
const uploader = document.getElementById("uploader");
// const blur = document.getElementById("blur");
const submit = document.querySelector("form button");

// When you click the upload button, show the form and make the background darker
uploadButton.onclick = () => {
  uploader.style.display = "flex";
  blur.style.display = "block";
};

// when you click the submit button or the gray background, hide the form
submit.onclick = blur.onclick = () => {
  uploader.style.display = "none";
  blur.style.display = "none";
  loginBox.style.display = "none";
};

const fileChooser = document.getElementById("file-chooser");
document.getElementById("upload-form").addEventListener(
  "submit",
  e => {
    e.preventDefault();
    const file = fileChooser.files[0];
    var textType = /text.*/;
    var text;

    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function(e) {
        text = e.target.result;
        const description = document.getElementById("dataset-description")
          .value;
        let toAdd = (description || "N/A") + "\r\n";
        const isTimeSeries = document.querySelector(
          'input[name="isTimeSeries"]:checked'
        ).value;
        const isImageData = document.querySelector(
          'input[name="isImage"]:checked'
        ).value;
        if (isImageData === "true" && isTimeSeries === "true")
          toAdd += "both\r\n";
        else if (isImageData === "true") toAdd += "image\r\n";
        else if (isTimeSeries === "true") toAdd += "time\r\n";
        else toAdd += "neither\r\n";

        text = toAdd + "" + text;
        console.log(text);
        const file = new File([text], "testing.csv", { type: "text/plain" });
        const data = new FormData();
        data.append("newFile", file);
        client.postFile(
          data,
          "https://protected-tundra-24167.herokuapp.com/api/upload/",
          makeListOfNames
        );
      };

      reader.readAsText(file);
    } else alert("File type not supported!");
    // console.log("posting", file);
  },
  false
);
