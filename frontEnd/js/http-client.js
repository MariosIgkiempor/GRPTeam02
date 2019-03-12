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

    this.post = function(file, url, callback) {
      const request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
          callback(request.responseText);
        }
      };

      request.open("POST", url);
      request.setRequestHeader("Access-Control-Allow-Origin", "*");
      request.send(file);
    };
  }
}
