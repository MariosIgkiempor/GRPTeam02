
class HttpClient {

  constructor() {

    this.get = function(url, callback) {
      const request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
          callback(request.responseText);
        }
      };
      request.open("GET", url, true);
      request.setRequestHeader("Access-Control-Allow-Origin", "*");
      request.send(null);
    };
  }
}
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
    i = i%4;
    const listItem = document.createElement("li");
    // listItem.innerHTML = name;
    listItem.style.padding = "0px 10px"
    switch (i) {
      case 0:
        listItem.style.backgroundColor = "#0094CB"
        break;
      case 1:
        listItem.style.backgroundColor = "#FFFFFF"
        break;
      case 2:
        listItem.style.backgroundColor = "#00AFD8"
        break;
      case 3:
        listItem.style.backgroundColor = "#FFFFFF"
        break;
    }
    listItem.ondblclick = function(){
      window.location.href = "Analysis.html?" + name;
    }
    listItem.innerHTML = name;
    // listItem.appendChild(listButton);
    list.appendChild(listItem);
    i++;
  }
  document.querySelector("#output").appendChild(list);
}
