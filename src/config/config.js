// Author: Marios Igkiempor 10335752

// file containing the API keys, database login details
// and other config variables needed throughout the app

module.exports = {
  mongoURI: 'mongodb://admin:password1@ds219832.mlab.com:19832/grpteam02-db',
  port: process.env.PORT ? process.env.PORT : 8000,
  production: true,
  sevrerURI: 'https://protected-tundra-24167.herokuapp.com'
}
