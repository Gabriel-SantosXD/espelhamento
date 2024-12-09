const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // URL do cliente React
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// Servir o cliente React
app.use("/client", express.static("client-build"));

// Servir o HTML para o emissor
app.get("/server", (req, res) => {
  res.sendFile(path.join(__dirname, "server.html"));
});

// Configurar comunicação WebSocket para sinalização WebRTC
io.on("connection", (socket) => {
  console.log("Novo cliente conectado");

  // Enviar oferta WebRTC para receptores
  socket.on("webrtc-offer", (offer) => {
    socket.broadcast.emit("webrtc-offer", offer);
  });

  // Enviar resposta WebRTC para o emissor
  socket.on("webrtc-answer", (answer) => {
    socket.broadcast.emit("webrtc-answer", answer);
  });

  // Compartilhar candidatos ICE
  socket.on("webrtc-candidate", (candidate) => {
    socket.broadcast.emit("webrtc-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Iniciar o servidor
server.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});
