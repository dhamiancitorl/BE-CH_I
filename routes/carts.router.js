import { Router } from "express";

const router = Router();

const cartsRouter = (cartManager) => {
  // POST / - Crear nuevo carrito
  router.post("/", async (req, res) => {
    try {
      const newCart = await cartManager.createCart();
      res.status(201).json({ status: "success", payload: newCart });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  // GET /:cid - Obtener productos del carrito
  router.get("/:cid", async (req, res) => {
    try {
      const cart = await cartManager.getCartById(req.params.cid);

      if (!cart) {
        return res.status(404).json({
          status: "error",
          message: "Carrito no encontrado",
        });
      }

      res.json({ status: "success", payload: cart.products });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  // POST /:cid/product/:pid - Agregar producto al carrito
  router.post("/:cid/product/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const updatedCart = await cartManager.addProductToCart(cid, pid);

      res.json({
        status: "success",
        message: "Producto agregado al carrito",
        payload: updatedCart,
      });
    } catch (error) {
      if (error.message === "Carrito no encontrado") {
        return res
          .status(404)
          .json({ status: "error", message: error.message });
      }
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  return router;
};

export default cartsRouter;
