import { CartModel } from "./src/models/Carts.js";

class CartManager {
  async createCart() {
    const newCart = await CartModel.create({ products: [] });
    return newCart;
  }

  async getCartById(id) {
    const cart = await CartModel.findById(id).populate("products.product");
    return cart || null;
  }
  async getCarts() {
    const carts = await CartModel.find().populate("products.product").lean();
    return carts;
  }
  async addProductToCart(cartId, productId) {
    const cart = await CartModel.findById(cartId).populate("products.product");
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    const existingProduct = cart.products.find(
      (p) => String(p.product?._id || p.product) === String(productId),
    );
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    await cart.save();
    return cart;
  }
  async removeProductFromCart(cartId, productId) {
    const cart = await CartModel.findById(cartId).populate("products.product");
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    cart.products = cart.products.filter(
      (p) => String(p.product?._id || p.product) !== String(productId),
    );
    await cart.save();
    return cart;
  }
  async deleteCart(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    cart.products = [];
    await cart.save();
    return cart;
  }
  async updateProductQuantity(cartId, productId, quantity) {
    if (quantity === undefined || quantity === null || quantity <= 0) {
      throw new Error("Cantidad inválida");
    }
    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty < 1 || !Number.isInteger(qty)) {
      throw new Error("Cantidad inválida");
    }
    const cart = await CartModel.findById(cartId).populate("products.product");
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    const product = cart.products.find(
      (p) => String(p.product?._id || p.product) === String(productId),
    );
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    product.quantity = qty;
    await cart.save();
    return cart;
  }
  async updateCart(cartId, products) {
    const cart = await CartModel.findById(cartId).populate("products.product");
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    cart.products = products;
    await cart.save();
    return cart;
  }
}

export default CartManager;
