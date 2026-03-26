import { Router } from "express";
import ProductManager from "../ProductManager.js";
import CartManager from "../CartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

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

router.get("/products", async (req, res) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit || 10));
    const page = Math.max(1, parseInt(req.query.page || 1));
    const query = req.query.query || "";
    const sort = req.query.sort || "";

    const { products, totalDocs } = await productManager.getProductsPaginated({
      limit,
      page,
      query,
      sort,
    });

    const totalPages = Math.ceil(totalDocs / limit) || 1;
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    const baseUrl = `${req.protocol}://${req.get("host")}/products`;
    const prevLink = hasPrevPage
      ? `${baseUrl}?${new URLSearchParams({ ...req.query, page: page - 1 }).toString()}`
      : null;
    const nextLink = hasNextPage
      ? `${baseUrl}?${new URLSearchParams({ ...req.query, page: page + 1 }).toString()}`
      : null;
    res.render("products/index", {
      title: "Productos",
      products,
      totalDocs,
      totalPages,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      prevLink,
      nextLink,
      cartId: req.query.cartId || null,
    });
  } catch (error) {
    res.status(500).render("products/index", {
      title: "Error",
      products: [],
      error: "Error al cargar productos",
    });
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).render("products/detail", {
        title: "Error",
        product: null,
        error: "Producto no encontrado",
      });
    }
    res.render("products/detail", {
      title: "Detalle de Producto",
      product,
      cartId: req.query.cartId || null,
    });
  } catch (error) {
    res.status(500).render("products/detail", {
      title: "Error",
      product: null,
      error: "Error al cargar producto",
    });
  }
});
router.post("/carts", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.redirect(`/carts/${newCart._id}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.get("/carts", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.render("carts/empty", {
      title: "Carrito vacío",
      carts,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    res.render("carts/detail", {
      title: "Detalle de Carrito",
      cart,
    });
  } catch (error) {
    res.status(500).render("carts/detail", {
      title: "Error",
      cart: null,
      error: "Error al cargar carrito",
    });
  }
});
router.post("/carts/:cid/add/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    await cartManager.addProductToCart(cid, pid);
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.post("/carts/:cid/clear", async (req, res) => {
  try {
    const { cid } = req.params;
    await cartManager.deleteCart(cid);
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
export default router;
