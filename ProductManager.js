import { ProductModel } from "./src/models/Products.js";

class ProductManager {
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
    if (await ProductModel.findOne({ code })) {
      throw new Error("El código ya está en uso");
    }

    // Generar ID
    const id = (await ProductModel.countDocuments()) + 1;

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

    await ProductModel.create(newProduct);
    return newProduct;
  }

  async getProducts() {
    const products = await ProductModel.find().lean();
    return products;
  }

  async getProductsPaginated(options = {}) {
    const { limit = 10, page = 1, query: queryParam, sort } = options;

    // 1 por filtro
    const filter = {};
    if (queryParam) {
      filter.title = { $regex: queryParam, $options: "i" };
    }
    // 2 por sort
    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    // 3 page
    const totalDocs = await ProductModel.countDocuments(filter);

    // 4 pagina pedida
    const skip = (page - 1) * limit;
    const products = await ProductModel.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    return { products, totalDocs };
  }

  async getProductById(pid) {
    const product = await ProductModel.findById(pid).lean();
    return product || null;
  }

  async updateProduct(pid, updateData) {
    const product = await ProductModel.findByIdAndUpdate(pid, updateData, {
      new: true,
    });
    return product || null;
  }

  async deleteProduct(pid) {
    const result = await ProductModel.findByIdAndDelete(pid);
    return result || null;
  }
}

export default ProductManager;
