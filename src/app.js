import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { mongoConnect } from "./config/database.js";
// Routers
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import CartManager from "./CartManager.js";

// Configuración de __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;
const cartManager = new CartManager();
// Crear servidor HTTP
const httpServer = createServer(app);

// Configurar Socket.IO
const io = new Server(httpServer);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configurar Handlebars
app.engine(
  "handlebars",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  }),
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Hacer io accesible en las rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter(cartManager));
app.use("/", viewsRouter);

// WebSocket
io.on("connection", (socket) => {
  console.log("🔌 Nuevo cliente conectado");

  // Escuchar cuando se crea un producto
  socket.on("createProduct", (product) => {
    console.log("📦 Producto creado vía socket:", product);
    // Emitir a todos los clientes
    io.emit("updateProducts", product);
  });

  // Escuchar cuando se elimina un producto
  socket.on("deleteProduct", (productId) => {
    console.log("🗑️  Producto eliminado vía socket:", productId);
    // Emitir a todos los clientes
    io.emit("productDeleted", productId);
  });

  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado");
  });
});

await mongoConnect();
httpServer.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
