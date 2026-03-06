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

  router.delete("/:cid/products/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const updatedCart = await cartManager.removeProductFromCart(cid, pid);
      res.json({
        status: "success",
        message: "Producto eliminado del carrito",
        payload: updatedCart.products,
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
  router.delete("/:cid", async (req, res) => {
    try {
      const { cid } = req.params;
      await cartManager.deleteCart(cid);
      res.json({
        status: "success",
        message: "Carrito eliminado",
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });
  router.put("/:cid/products/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      await cartManager.updateProductQuantity(cid, pid, quantity);
      res.json({
        status: "success",
        message: "Producto actualizado en el carrito",
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });
  router.put("/:cid", async (req, res) => {
    try {
      const { cid } = req.params;
      const { products } = req.body;
      const updatedCart = await cartManager.updateCart(cid, products);
      res.json({
        status: "success",
        message: "Carrito actualizado",
        payload: updatedCart,
      });
    } catch (error) {
      if (error.message === "Carrito no encontrado") {
        return res
          .status(404)
          .json({ status: "error", message: error.message });
      }
      if (error.message === "Producto no encontrado") {
        return res
          .status(404)
          .json({ status: "error", message: error.message });
      }
      if (error.message === "Cantidad inválida") {
        return res
          .status(400)
          .json({ status: "error", message: error.message });
      }
      if (error.message === "Carrito vacío") {
        return res
          .status(400)
          .json({ status: "error", message: error.message });
      }
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  return router;
};

export default cartsRouter;
