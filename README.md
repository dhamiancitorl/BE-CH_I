# Backend Ecommerce - Entrega final

API REST para gestión de productos y carritos con Node.js y Express. **Persistencia en MongoDB (Mongoose).** Incluye vistas con Handlebars y actualización en tiempo real vía WebSockets (Socket.IO). Los formularios envían datos por HTTP y el servidor emite los cambios a todos los clientes conectados.

## 🛠 Tecnologías

- **Node.js** + **Express**
- **Mongoose** (MongoDB)
- **Express Handlebars** (vistas)
- **Socket.IO** (tiempo real)
- **Nodemon** (desarrollo)

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# (Opcional) Configurar MongoDB
# Crear archivo .env con MONGO_URI=mongodb://... si usas conexión por variable de entorno

# (Opcional) Cargar datos iniciales
npm run seed

# Iniciar servidor
npm start

# O en modo desarrollo (con nodemon)
npm run dev
```

**Requisito:** Tener MongoDB en ejecución (local o Atlas). El servidor estará disponible en `http://localhost:8080`.

## 📜 Scripts

| Comando        | Descripción                    |
|----------------|--------------------------------|
| `npm start`    | Inicia el servidor             |
| `npm run dev`  | Desarrollo con nodemon         |
| `npm run seed` | Carga datos iniciales (seed)  |

## 📋 Estructura del proyecto

```
proyecto_BE_CH_I-main/
├── app.js                         # Servidor principal (Express + Socket.IO)
├── ProductManager.js              # Gestor de productos (Mongoose)
├── CartManager.js                 # Gestor de carritos (Mongoose)
├── package.json
├── src/
│   ├── config/
│   │   └── database.js            # Conexión MongoDB
│   └── models/
│       ├── Products.js             # Modelo Mongoose de productos
│       └── Carts.js               # Modelo Mongoose de carritos
├── routes/
│   ├── products.router.js         # Rutas API de productos
│   ├── carts.router.js            # Rutas API de carritos
│   └── views.router.js            # Rutas de vistas (Handlebars)
├── views/
│   ├── layouts/
│   │   └── main.handlebars        # Layout principal
│   ├── home.handlebars            # Vista home
│   └── realTimeProducts.handlebars # Vista productos en tiempo real
├── public/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── realTimeProducts.js   # Lógica Socket.IO en el cliente
└── scripts/
    └── seed.js                   # Script de datos iniciales
```

## 🌐 Vistas

- **`/`** — Home con listado de productos.
- **`/realtimeproducts`** — Productos en tiempo real: formularios para crear y eliminar productos; la lista se actualiza al instante para todos los clientes abiertos. La creación/eliminación se hace por HTTP (POST/DELETE) y el servidor usa Socket.IO (`req.io.emit`) dentro de las rutas para notificar a los clientes.

El `io` se inyecta en las rutas vía middleware (`req.io`) para emitir desde POST y DELETE.

## 🛣️ Endpoints API

### Productos (`/api/products`)

Los IDs de producto (`:pid`) son **ObjectId de MongoDB** (string).

| Método | Ruta                 | Descripción                         |
| ------ | -------------------- | ----------------------------------- |
| GET    | `/api/products`      | Listar todos (opcional: `?limit=n`) |
| GET    | `/api/products/:pid` | Obtener por ID                      |
| POST   | `/api/products`      | Crear producto (body JSON)          |
| PUT    | `/api/products/:pid` | Actualizar producto                 |
| DELETE | `/api/products/:pid` | Eliminar producto                   |

#### Crear producto (POST)

```http
POST /api/products
Content-Type: application/json

{
  "title": "Laptop Dell",
  "description": "Laptop profesional de alto rendimiento",
  "code": "DELL-001",
  "price": 1200,
  "stock": 15,
  "category": "Electrónica",
  "thumbnails": ["img1.jpg"]
}
```

Campos requeridos: `title`, `description`, `code`, `price`, `stock`, `category`. Opcionales: `thumbnails`, `status`. El `code` debe ser único. El `_id` se genera automáticamente (MongoDB).

#### Actualizar producto (PUT)

Solo enviar los campos a modificar. No se puede cambiar el `_id`.

```http
PUT /api/products/:pid
Content-Type: application/json

{ "price": 1100, "stock": 20 }
```

### Carritos (`/api/carts`)

Los IDs de carrito (`:cid`) y de producto (`:pid`) son **ObjectId de MongoDB** (string).

| Método | Ruta                            | Descripción                  |
| ------ | ------------------------------- | ---------------------------- |
| POST   | `/api/carts`                    | Crear carrito                |
| GET    | `/api/carts/:cid`               | Productos del carrito        |
| POST   | `/api/carts/:cid/product/:pid`  | Agregar producto al carrito  |

Ejemplo: `POST /api/carts/<cartId>/product/<productId>` — reemplazar por los ObjectId reales. Si el producto ya está en el carrito, se incrementa `quantity`.

## 🧪 Pruebas con Postman

Base URL: `http://localhost:8080`

- **Crear producto:** `POST /api/products` — Body: raw, JSON (ver ejemplo arriba).
- **Listar productos:** `GET /api/products`.
- **Eliminar producto:** `DELETE /api/products/<productId>` (ObjectId).
- **Crear carrito:** `POST /api/carts`.
- **Agregar al carrito:** `POST /api/carts/<cartId>/product/<productId>` (ObjectIds).

## 📦 Formato de datos

### Producto (MongoDB)

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Producto",
  "description": "Descripción",
  "code": "PROD-001",
  "price": 100,
  "status": true,
  "stock": 50,
  "category": "Categoría",
  "thumbnails": []
}
```

### Carrito (MongoDB)

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "products": [
    { "product": "507f1f77bcf86cd799439011", "quantity": 2 },
    { "product": "507f1f77bcf86cd799439013", "quantity": 1 }
  ]
}
```

El GET de carrito puede devolver `products` con el documento del producto poblado (`populate`).

## ⚠️ Manejo de errores

Las respuestas de error usan el formato:

```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

Códigos HTTP: `200` OK, `201` Creado, `400` Bad Request, `404` Not Found, `500` Error del servidor.

## 📝 Notas

- Persistencia en **MongoDB** (Mongoose). Se requiere MongoDB en ejecución.
- Los IDs (`_id`) son ObjectId generados por MongoDB.
- Vistas con Handlebars y actualización en tiempo real con Socket.IO; el servidor emite desde las rutas HTTP (POST/DELETE) para mantener a los clientes sincronizados.
- Para entornos productivos, usar variables de entorno (ej. `MONGO_URI`) en lugar de credenciales en código.
