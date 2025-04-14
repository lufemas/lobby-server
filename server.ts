import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

interface Room {
  hostId: string;
  clients: Set<string>;
}

const rooms = new Map<string, Room>();

io.on('connection', (socket: Socket) => {
  console.log(`Connected: ${socket.id}`);

  // Host creates a room
  socket.on('host-room', ({ roomId }: { roomId: string }) => {
    if (!roomId) return;
    rooms.set(roomId, { hostId: socket.id, clients: new Set() });
    socket.join(roomId);
    console.log(`Host ${socket.id} created room: ${roomId}`);
  });

  // Client joins a room
  socket.on('join-room', ({ roomId, metadata }: { roomId: string, metadata?: any }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error-room-not-found', { roomId });
      return;
    }

    room.clients.add(socket.id);
    socket.join(roomId);

    io.to(room.hostId).emit('client-joined', {
      clientId: socket.id,
      metadata
    });

    console.log(`Client ${socket.id} joined room: ${roomId}`);
  });

  // Relay any message between clients
  socket.on('relay', ({ to, type, payload }: { to: string, type: string, payload?: any }) => {
    io.to(to).emit(type, { from: socket.id, ...payload });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Disconnected: ${socket.id}`);

    for (const [roomId, room] of rooms.entries()) {
      if (room.hostId === socket.id) {
        io.to(roomId).emit('host-disconnected');
        rooms.delete(roomId);
        console.log(`Host disconnected and removed room: ${roomId}`);
      } else if (room.clients.has(socket.id)) {
        room.clients.delete(socket.id);
        io.to(room.hostId).emit('client-disconnected', { clientId: socket.id });
        console.log(`Client ${socket.id} removed from room: ${roomId}`);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Generic lobby server running on http://localhost:${PORT}`);
});
