const http = require("http");
const AppServer = require("./server");

//import * as https from 'https'
// const port = (process.env.PORT || 3000);

// Porta para heroku
const port = (process.env.PORT || 8000);

//  Cria o servidor e passa a api pra ele.
const server = http.createServer(AppServer.default);
server.listen(port);
server.timeout = 30000;
server.on('listening', onListening);

function onListening() {
    console.log('Ouvindo na porta: ' + port);
}