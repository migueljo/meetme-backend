import { Server } from 'socket.io';

const io = new Server({});

// Fired when a new connection is made
io.on('connection', (socket) => {
  console.log('New connection:', socket);

  // Fired when the connection is closed
  socket.on('disconnect', (reason) => {
    console.log('Disconnected reason:', reason);
  });
});

io.listen(3000);
