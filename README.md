# Backend Ecommerce - Segunda entrega

API REST para gestión de productos y carritos con Node.js y Express. Incluye vistas con Handlebars y actualización en tiempo real vía WebSockets (Socket.IO). Los formularios envían datos por HTTP y el servidor emite los cambios a todos los clientes conectados.

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Crear carpeta de datos (si no existe)
mkdir data

# Iniciar servidor
npm start

# O en modo desarrollo (con nodemon)
npm run dev
```

El servidor estará disponible en `http://localhost:8080`

## 📋 Estructura del proyecto

```
proyecto_BE_CH_I-main/
├── app.js                      # Servidor principal (Express + Socket.IO)
├── ProductManager.js           # Gestor de productos
├── CartManager.js              # Gestor de carritos
├── package.json
├── routes/
│   ├── products.router.js      # Rutas API de productos
│   ├── carts.router.js         # Rutas API de carritos
│   └── views.router.js         # Rutas de vistas (Handlebars)
├── views/
│   ├── layouts/
│   │   └── main.handlebars     # Layout principal
│   ├── home.handlebars         # Vista home
│   └── realTimeProducts.handlebars  # Vista productos en tiempo real
├── public/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── realTimeProducts.js # Lógica Socket.IO en el cliente
└── data/
    ├── products.json
    └── carts.json
```

## 🌐 Vistas (Segunda entrega)

- **`/`** — Home con listado de productos.
- **`/realtimeproducts`** — Productos en tiempo real: formularios para crear y eliminar productos; la lista se actualiza al instante para todos los clientes abiertos. La creación/eliminación se hace por HTTP (POST/DELETE) y el servidor usa Socket.IO (`req.io.emit`) dentro de las rutas para notificar a los clientes.

**Tecnologías:** Express Handlebars, Socket.IO (servidor y cliente). El `io` se inyecta en las rutas vía middleware (`req.io`) para emitir desde POST y DELETE.

## 🛣️ Endpoints API

### Productos (`/api/products`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Listar todos (opcional: `?limit=n`) |
| GET | `/api/products/:pid` | Obtener por ID |
| POST | `/api/products` | Crear producto (body JSON) |
| PUT | `/api/products/:pid` | Actualizar producto |
| DELETE | `/api/products/:pid` | Eliminar producto |

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

Campos requeridos: `title`, `description`, `code`, `price`, `stock`, `category`. Opcionales: `thumbnails`, `status`. El `code` debe ser único. El `id` se genera automáticamente.

#### Actualizar producto (PUT)

Solo enviar los campos a modificar. No se puede cambiar el `id`.

```http
PUT /api/products/:pid
Content-Type: application/json

{ "price": 1100, "stock": 20 }
```

### Carritos (`/api/carts`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/carts` | Crear carrito |
| GET | `/api/carts/:cid` | Productos del carrito |
| POST | `/api/carts/:cid/product/:pid` | Agregar producto al carrito |

Ejemplo: `POST /api/carts/1/product/3` — agrega producto 3 al carrito 1 (si ya existe, se incrementa `quantity`).

## 🧪 Pruebas con Postman

Base URL: `http://localhost:8080`

- **Crear producto:** `POST /api/products` — Body: raw, JSON (ver ejemplo arriba).
- **Listar productos:** `GET /api/products`.
- **Eliminar producto:** `DELETE /api/products/1`.
- **Crear carrito:** `POST /api/carts`.
- **Agregar al carrito:** `POST /api/carts/1/product/1`.

## 📦 Formato de datos

### Producto

```json
{
  "id": 1,
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

### Carrito

```json
{
  "id": 1,
  "products": [
    { "product": 1, "quantity": 2 },
    { "product": 3, "quantity": 1 }
  ]
}
```

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

- Los IDs de productos y carritos se autogeneran.
- Persistencia en archivos JSON (`data/`).
- Segunda entrega: vistas con Handlebars y actualización en tiempo real con Socket.IO; el servidor emite desde las rutas HTTP (POST/DELETE) para mantener a los clientes sincronizados.
