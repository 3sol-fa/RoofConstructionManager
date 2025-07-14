// websocket-server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 }); // 3001 port

wss.on('connection', function connection(ws) {
  console.log('Client connected');
  ws.on('message', function incoming(message) {
    // Broadcast to all clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on ws://localhost:3001');

const ws = new (require('ws'))('ws://localhost:3001');
ws.on('open', () => console.log('Connected!'));
ws.on('error', (err) => console.error('Error:', err)); 