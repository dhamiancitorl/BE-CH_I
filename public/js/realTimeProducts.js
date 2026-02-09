// Conectar a Socket.IO
const socket = io();

// Referencias a elementos del DOM
const productForm = document.getElementById("productForm");
const deleteForm = document.getElementById("deleteForm");
const productsContainer = document.getElementById("productsContainer");

// Función para crear tarjeta de producto
function createProductCard(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <span class="product-id">ID: ${product.id}</span>
      <h3>${product.title}</h3>
      <p class="description">${product.description}</p>
      <p class="price">$${product.price}</p>
      <div class="product-details">
        <span class="badge">Stock: ${product.stock}</span>
        <span class="badge">Categoría: ${product.category}</span>
      </div>
      <p class="code">Código: ${product.code}</p>
    </div>
  `;
}

// Agregar producto
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    code: document.getElementById("code").value,
    price: parseFloat(document.getElementById("price").value),
    stock: parseInt(document.getElementById("stock").value),
    category: document.getElementById("category").value,
  };

  try {
    // Enviar a la API REST
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    const data = await response.json();

    if (response.ok) {
      // El servidor ya emite "updateProducts" desde el POST
      productForm.reset();
      alert("✅ Producto creado exitosamente");
    } else {
      alert("❌ Error: " + data.message);
    }
  } catch (error) {
    alert("❌ Error al crear producto");
    console.error(error);
  }
});

// Eliminar producto
deleteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const productId = parseInt(document.getElementById("deleteId").value);

  try {
    // Enviar a la API REST
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (response.ok) {
      // El servidor ya emite "productDeleted" desde el DELETE
      deleteForm.reset();
      alert("✅ Producto eliminado exitosamente");
    } else {
      alert("❌ Error: " + data.message);
    }
  } catch (error) {
    alert("❌ Error al eliminar producto");
    console.error(error);
  }
});

// Escuchar actualizaciones de productos
socket.on("updateProducts", (product) => {
  console.log("📦 Nuevo producto recibido:", product);

  // Agregar el nuevo producto al contenedor
  const productCard = createProductCard(product);

  if (productsContainer.querySelector(".no-products")) {
    productsContainer.innerHTML = productCard;
  } else {
    productsContainer.innerHTML += productCard;
  }
});

// Escuchar eliminación de productos
socket.on("productDeleted", (productId) => {
  console.log("🗑️  Producto eliminado:", productId);

  // Eliminar la tarjeta del producto
  const productCard = document.querySelector(`[data-id="${productId}"]`);
  if (productCard) {
    productCard.remove();
  }

  // Mostrar mensaje si no hay productos
  if (productsContainer.children.length === 0) {
    productsContainer.innerHTML =
      '<p class="no-products">No hay productos disponibles</p>';
  }
});

// Mensaje de conexión
socket.on("connect", () => {
  console.log("✅ Conectado al servidor");
});

socket.on("disconnect", () => {
  console.log("❌ Desconectado del servidor");
});
