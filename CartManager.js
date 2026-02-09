import fs from "fs/promises";

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = [];
    this.init();
  }

  async init() {
    try {
      await this.loadCarts();
    } catch (error) {
      // Si el archivo no existe, crear uno vacío
      await this.saveCarts();
    }
  }

  async loadCarts() {
    const data = await fs.readFile(this.path, "utf-8");
    this.carts = JSON.parse(data);
  }

  async saveCarts() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  generateId() {
    if (this.carts.length === 0) return 1;
    const maxId = Math.max(...this.carts.map((cart) => cart.id));
    return maxId + 1;
  }

  async createCart() {
    await this.loadCarts();

    const newCart = {
      id: this.generateId(),
      products: [],
    };

    this.carts.push(newCart);
    await this.saveCarts();
    return newCart;
  }

  async getCartById(id) {
    await this.loadCarts();
    const cart = this.carts.find((cart) => cart.id === parseInt(id));
    return cart || null;
  }

  async addProductToCart(cartId, productId) {
    await this.loadCarts();
    const cartIndex = this.carts.findIndex(
      (cart) => cart.id === parseInt(cartId)
    );

    if (cartIndex === -1) {
      throw new Error("Carrito no encontrado");
    }

    const cart = this.carts[cartIndex];
    const existingProductIndex = cart.products.findIndex(
      (p) => p.product === parseInt(productId)
    );

    if (existingProductIndex !== -1) {
      // Si el producto ya existe, incrementar cantidad
      cart.products[existingProductIndex].quantity += 1;
    } else {
      // Si no existe, agregarlo
      cart.products.push({
        product: parseInt(productId),
        quantity: 1,
      });
    }

    await this.saveCarts();
    return cart;
  }
}

export default CartManager;
