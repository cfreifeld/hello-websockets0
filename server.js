const express = require('express');
const path = require('path')
const ws = require('ws');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Set up a headless websocket server that prints any
// events that come in.
let counter = 0;
let socketList = [];
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
  socketList.push(socket)
  socket.on('message', message => {
    console.log(message)
    //socket.send(message)
    socketList.forEach((s, i) => {
      s.send(message)
    });
  });
  //let interval = setInterval(() => { socket.send(JSON.stringify({counter: counter})); counter++ }, 1000)
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(3000);
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});
