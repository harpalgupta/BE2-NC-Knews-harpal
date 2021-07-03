/* eslint "no-console" : 0 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const app = require('./app');

const { PORT = 9090 } = process.env;

// app.listen(PORT, () => {
//   console.log(`listening on port ${PORT} ...`);
// });

// const key = fs.readFileSync('./key/key.pem');
// const cert = fs.readFileSync('./key/cert.pem');
// const options = {
//   key,
//   cert,
//   passphrase: 'test',
// };


const server = http.createServer(app);
// const httpserver = http.createServer(app);

// httpserver.listen('9091');
server.listen(PORT, () => {
  console.log(`server starting on port : ${PORT}`);
});
