import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import type * as SocketIOTypes from 'socket.io';

const PORT = 8080;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const socketPool = new Map<string, SocketIOTypes.Socket>();

// Fired when a new connection is made
io.on('connection', (socket) => {
  const { token } = socket.handshake.auth;

  socketPool.set(token, socket);
  console.log('Connection token:', token);

  // Fired when the connection is closed
  socket.on('disconnect', (reason) => {
    console.log('Disconnected reason:', reason);
    socketPool.delete(token);
  });

  socket.on('offer', (data: VideoOfferData) => {
    const targetSocket = socketPool.get(data.target);
    if (targetSocket) {
      console.log('Socket: Sending offer to', data.target);
      targetSocket.emit('offer', data);
    } else {
      console.log('Socket: No target found for', data.target);
    }
  });

  socket.on('answer', (data: VideoAnswerData) => {
    const targetSocket = socketPool.get(data.target);
    if (targetSocket) {
      console.log('Socket: Sending answer to', data.target);
      targetSocket.emit('answer', data);
    } else {
      console.log('Socket: No target found for', data.target);
    }
  });

  socket.on('new-ice-candidate', (data: IceCandidateData) => {
    const targetSocket = socketPool.get(data.target);
    if (targetSocket) {
      console.log('Socket: Sending new-ice-candidate to', data.target);
      targetSocket.emit('new-ice-candidate', data);
    } else {
      console.log('Socket: No target found for', data.target);
    }
  });
});

process.on('uncaughtException', (err, origin) => {
  console.log(origin, err);
});

type VideoOfferData = {
  type: 'offer';
  name: string; // Sender's name
  target: string; // // Person receiving the description
  sdp: string; // Description to send
};

type VideoAnswerData = {
  type: 'answer';
  name: string; // Sender's name
  target: string; // // Person receiving the description
  sdp: string; // Description to send
};

type IceCandidateData = {
  type: 'new-ice-candidate';
  target: string; // Person receiving the description
  candidate: string; // The SDP candidate string
};
