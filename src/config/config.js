// file containing the API keys, database login details
// and other config variables needed throughout the app

module.exports = {
  // mongoURI: 'mongodb://admin:password1@ds219832.mlab.com:19832/grpteam02-db',
  mongoURI: 'mongodb://admin:password1@ds237669.mlab.com:37669/grpteam02-db2',
  // mongoURI:
  //   'mongodb+srv://admin:p37LevejJ0grLyZB@grpteam02cluster-16frt.azure.mongodb.net/test?retryWrites=true',
  port: process.env.PORT ? process.env.PORT : 8000,
  production: true,
  sevrerURI: 'https://protected-tundra-24167.herokuapp.com'
  // sevrerURI: 'http://localhost',
}
