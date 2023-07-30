import { Server } from 'socket.io';

const io = new Server({});

// Fired when a new connection is made
io.on('connection', (socket) => {
  console.log('New connection:', socket);

  // Fired when the connection is closed
  socket.on('disconnect', (reason) => {
    console.log('Disconnected reason:', reason);
  });

  socket.on('video-offer', (data: VideoOfferData) => {
    console.log('video-offer', data);
    // Send the offer to the target
  });

  socket.on('video-answer', (data: VideoAnswerData) => {
    console.log('video-answer', data);
    // Send the answer to the target
  });

  socket.on('new-ice-candidate', (data: IceCandidateData) => {
    console.log('new-ice-candidate', data);
    // Send the ice candidate to the target
  });
});

io.listen(3000);

type VideoOfferData = {
  type: 'video-offer';
  name: string; // Sender's name
  target: string; // // Person receiving the description
  sdp: string; // Description to send
};

type VideoAnswerData = {
  type: 'video-answer';
  name: string; // Sender's name
  target: string; // // Person receiving the description
  sdp: string; // Description to send
};

type IceCandidateData = {
  type: 'new-ice-candidate';
  target: string; // Person receiving the description
  candidate: string; // The SDP candidate string
};
