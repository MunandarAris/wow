require('dotenv').config();

const express = require('express');
const router = require('./src/routes');
const http = require('http');
const { Server } = require('socket.io');

const cors = require('cors');

const app = express();

// Initialisation Socket.io
const server = http.createServer(app);
const io = new Server(server, {

    cors : {
        origin : "http://localhost:3000"
    }

});
require('./src/socket')(io);

app.use(express.json());

app.use(cors());

app.use('/uploads',express.static('uploads'));

const port = 5000;

app.get('/',(req,res) => {
    res.send('Hello Express');
});

app.use('/api/v1/',router);

server.listen(port, () => {
    console.log(`Aplikasi running in http://localhost:${port}`)
});