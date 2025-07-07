const connectToMongo = require('./db');
connectToMongo();

const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const port = process.env.PORT;
app.use(cors());
app.use(express.json());

// 👇 Create HTTP server manually
const server = http.createServer(app);

// 👇 Attach Socket.IO to server
const io = new Server(server, {
  cors: {
    origin: "*", // for development; restrict in production
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// 👇 Real-time socket connection logic
io.on("connection", (socket) => {
  console.log("⚡ A user connected");

  socket.on("note_updated", (data) => {
    socket.broadcast.emit("note_updated", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected");
  });
});

// 👇 Attach Socket.IO to app
app.set("socketio", io);

// 👇 API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/activity', require('./routes/activity'));

// 👇 Start the server (use `server`, not `app`)
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
