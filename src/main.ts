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
    console.log('offer', data);
    // Send the offer to the target
  });

  socket.on('answer', (data: VideoAnswerData) => {
    console.log('answer', data);
    // Send the answer to the target
  });

  socket.on('new-ice-candidate', (data: IceCandidateData) => {
    console.log('new-ice-candidate:', data);
    // Send the ice candidate to the target
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
