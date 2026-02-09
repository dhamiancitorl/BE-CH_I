import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();
const productManager = new ProductManager("./data/products.json");

// Vista Home - Lista estática de productos
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", {
      title: "Home - Productos",
      products,
    });
  } catch (error) {
    res.status(500).render("home", {
      title: "Error",
      products: [],
      error: "Error al cargar productos",
    });
  }
});

// Vista Real Time Products - Lista dinámica con WebSockets
router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", {
      title: "Productos en Tiempo Real",
      products,
    });
  } catch (error) {
    res.status(500).render("realTimeProducts", {
      title: "Error",
      products: [],
      error: "Error al cargar productos",
    });
  }
});

export default router;
