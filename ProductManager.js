import fs from "fs/promises";

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.init();
  }

  async init() {
    try {
      await this.loadProducts();
    } catch (error) {
      // Si el archivo no existe, creamos uno vacío
      await this.saveProducts();
    }
  }

  async loadProducts() {
    const data = await fs.readFile(this.path, "utf-8");
    this.products = JSON.parse(data);
  }

  async saveProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
  }

  async addProduct(productData) {
    const {
      title,
      description,
      price,
      code,
      stock,
      category,
      thumbnails,
      status,
    } = productData;

    // Validar campos requeridos
    if (
      !title ||
      !description ||
      !price ||
      !code ||
      stock === undefined ||
      !category
    ) {
      throw new Error("Todos los campos son requeridos excepto thumbnails");
    }

    // Verificar si el código ya existe
    if (this.products.find((pr) => pr.code === code)) {
      throw new Error("El código ya está en uso");
    }

    // Generar ID
    let id;
    if (this.products.length === 0) {
      id = 1;
    } else {
      id = this.products[this.products.length - 1].id + 1;
    }

    // Crear el producto
    const newProduct = {
      id,
      title,
      description,
      code,
      price,
      status: status !== undefined ? status : true,
      stock,
      category,
      thumbnails: thumbnails || [],
    };

    this.products.push(newProduct);
    await this.saveProducts();

    return newProduct;
  }

  async getProducts() {
    await this.loadProducts();
    return this.products;
  }

  async getProductById(pid) {
    await this.loadProducts();
    const product = this.products.find((pr) => pr.id === parseInt(pid));
    return product || null;
  }

  async updateProduct(pid, updateData) {
    await this.loadProducts();
    const index = this.products.findIndex((pr) => pr.id === parseInt(pid));

    if (index === -1) {
      return null;
    }

    // No permitir actualizar el id
    const { id, ...fieldsToUpdate } = updateData;

    // Actualizar solo los campos proporcionados
    this.products[index] = {
      ...this.products[index],
      ...fieldsToUpdate,
    };

    await this.saveProducts();
    return this.products[index];
  }

  async deleteProduct(pid) {
    await this.loadProducts();
    const index = this.products.findIndex((pr) => pr.id === parseInt(pid));

    if (index === -1) {
      return false;
    }

    this.products.splice(index, 1);
    await this.saveProducts();
    return true;
  }
}

export default ProductManager;
