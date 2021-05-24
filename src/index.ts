const chokidar = require('chokidar')
const fsPromises = require( 'fs' ).promises
const p = './test3.cast'
const cast = {meta:{}, events:[]}

console.log(`Watching for file ${p}...`)
chokidar.watch(p, { awaitWriteFinish: false, useFsEvents: false }).on('all', async(event, path) => {
	const file = await fsPromises.readFile(path)

	const lines = file.toString().split("\n")
  if (cast.meta == {}) {
  	console.log("Detected file...")
  	cast.meta = JSON.parse(lines[0])
  	console.log(cast.meta)
  } 
  if (cast.events.length == 0) {
  	cast.events = lines.slice(1)
  	console.log("Got # of initial events:", cast.events.length)
  } else {
  	const newEvts = lines.slice(cast.events.length, -1)
  	cast.events = [...cast.events, ...newEvts]
  	console.log("New events:", newEvts)
  	io.emit('term events', newEvts)
  }
  
})

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/all', (req, res) => {
  res.send(JSON.stringify(cast));
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

io.on('disconnection', (socket) => {
  console.log('a user disconnected');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
