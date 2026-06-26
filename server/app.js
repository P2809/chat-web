const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// ======================
// SOCKET.IO
// ======================
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ======================
// MIDDLEWARE
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// RUTA DE PRUEBA
// ======================
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

// ======================
// CONEXIÓN MYSQL
// ======================
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log("❌ ERROR MYSQL:", err.message);
  } else {
    console.log("✅ CONEXIÓN MYSQL OK:", process.env.DB_NAME);
  }
});

// ======================
// SOCKET.IO LOGIC
// ======================
io.on("connection", (socket) => {
  console.log("🟢 Usuario conectado:", socket.id);

  // recibir mensaje del cliente
  socket.on("mensaje", (data) => {
    console.log("📩 Mensaje recibido:", data);

    // reenviar a todos los clientes conectados
    io.emit("mensaje", data);
  });

  // desconexión
  socket.on("disconnect", () => {
    console.log("🔴 Usuario desconectado:", socket.id);
  });
});

// ======================
// LEVANTAR SERVIDOR
// ======================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});