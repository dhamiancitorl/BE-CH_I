import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();
const productManager = new ProductManager("./data/products.json");

// GET all products
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();

    if (limit) {
      return res.json({
        status: "success",
        payload: products.slice(0, parseInt(limit)),
      });
    }

    res.json({
      status: "success",
      payload: products,
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
    await productManager.deleteProduct(parseInt(pid));

    // NUEVO: Emitir evento de WebSocket
    if (req.io) {
      req.io.emit("productDeleted", parseInt(pid));
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
    const product = await productManager.getProductById(parseInt(pid));
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
    const updatedProduct = await productManager.updateProduct(
      parseInt(pid),
      req.body,
    );
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
