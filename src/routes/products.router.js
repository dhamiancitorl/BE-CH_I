import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// GET all products
router.get("/", async (req, res) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit || 10));
    const page = Math.max(1, parseInt(req.query.page || 1));
    const query = req.query.query || "";
    const sort = req.query.sort || "";
    const productsData = await productManager.getProductsPaginated({
      limit,
      page,
      query,
      sort,
    });

    const { products, totalDocs } = productsData;

    // paginacion
    const totalPages = Math.ceil(totalDocs / limit) || 1;
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    // links
    const baseUrl = `${req.protocol}://${req.get("host")}/api/products`;
    const prevLink = hasPrevPage
      ? `${baseUrl}?${new URLSearchParams({ ...req.query, page: page - 1 }).toString()}`
      : null;
    const nextLink = hasNextPage
      ? `${baseUrl}?${new URLSearchParams({ ...req.query, page: page + 1 }).toString()}`
      : null;

    res.json({
      status: "success",
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// POST create product
router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);

    // NUEVO: Emitir evento de WebSocket
    if (req.io) {
      req.io.emit("updateProducts", newProduct);
    }

    res.status(201).json({
      status: "success",
      payload: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// DELETE product
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    await productManager.deleteProduct(pid);

    // NUEVO: Emitir evento de WebSocket
    if (req.io) {
      req.io.emit("productDeleted", pid);
    }

    res.json({
      status: "success",
      message: `Producto ${pid} eliminado`,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
});

// GET by ID
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    res.json({
      status: "success",
      payload: product,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
});

// PUT update product
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProduct = await productManager.updateProduct(pid, req.body);
    res.json({
      status: "success",
      payload: updatedProduct,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
