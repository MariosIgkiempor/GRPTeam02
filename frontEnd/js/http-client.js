class HttpClient {
  constructor () {
    this.get = function (url, callback) {
      const request = new XMLHttpRequest()
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          callback(request.responseText)
        }
      }

      request.open('GET', url, true)
      request.setRequestHeader('Access-Control-Allow-Origin', '*')
      request.send(null)
    }

    this.postJSON = function (data, url, callback) {
      const request = new XMLHttpRequest()
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          callback(request.responseText)
        }
      }

      request.open('POST', url, true)
      request.setRequestHeader('Access-Control-Allow-Origin', '*')
      request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      request.send(JSON.stringify(data))
    }

    this.postFile = function (file, url, callback) {
      const request = new XMLHttpRequest()
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          callback(request.responseText)
        }
      }

      request.open('POST', url, true)
      request.setRequestHeader('Access-Control-Allow-Origin', '*')
      request.send(file)
    }
  }
}
