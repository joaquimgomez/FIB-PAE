//import ComputerVisionEngine from './CVEngine.js';

//Load HTTP module
const http = require("http");
const hostname = '127.0.0.1';
const port = 3007;

//Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {

  //Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  //res.end('Hello World\n');

  //const requireFromUrl = require('require-from-url/sync');
  const cv = require("opencv4nodejs");

	cv.imreadAsync('./assets/Pru1.jpg', (err, mat) => {
    const CVE = require('./CVEngine.js');
    let cve = new CVE(mat);
    cve.run();
	});
});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
