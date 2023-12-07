import { Router } from "express";

import CartManager from "../class/cartManager.js";
import {
  addArray,
  addProductToCartAdapter,
  createCartAdapter,
  deleteAllProductToCartAdapter,
  deleteProductToCartAdapter,
  getCartByIdAdapter,
  getCartPopulate,
  getCartsAdapter,
} from "../dao/cartAdapter.js";
import cartSchema from "../dao/models/cart.model.js";

const cartManager = new CartManager();
const cartsRouter = Router();

cartsRouter.post("/carts", async (req, res) => {
  const body = { products: [] };
  await createCartAdapter(body);
  res.json({ ok: true });
});

cartsRouter.post("/carts/:cid/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await addProductToCartAdapter(cid, pid, parseInt(quantity));
  } catch (error) {}

  res.json({ ok: true });
});

cartsRouter.delete("/carts/:cid/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const c = await deleteProductToCartAdapter(cid, pid);
    res.json(c);
  } catch (error) {
    res.json(error.message);
  }
});

cartsRouter.put("/carts/:cid", async (req, res) => {
  const { products } = req.body;
  const { cid } = req.params;

  try {
    const w = await addArray(cid, products);
    res.json(w);
  } catch (error) {}
});

cartsRouter.delete("/carts/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const c = await deleteAllProductToCartAdapter(cid);
    res.json(c);
  } catch (error) {
    res.json(error.message);
  }
});

cartsRouter.get("/carts", async (req, res) => {
  const carts = await getCartsAdapter();
  res.status(200).json(carts);
});

cartsRouter.get("/carts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await getCartPopulate(id);
    res.json(cart);
  } catch (error) {}
});

export default cartsRouter;
