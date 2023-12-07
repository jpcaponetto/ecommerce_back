import cartSchema from "./models/cart.model.js";
import ProductMaganer from "../class/productManager.js";
import { getProductByIdAdapter } from "./productAdapter.js";

const productManager = new ProductMaganer();
const flagMongo = true;

export const createCartAdapter = async (body) => {
  if (flagMongo) {
    try {
      const cart = await cartSchema.create(body);
      return cart;
    } catch (error) {
      console.log(error.message);
      return;
    }
  }
};

export const getCartsAdapter = async () => {
  if (flagMongo) {
    try {
      const carts = await cartSchema.find({});
      return carts;
    } catch (error) {
      console.log(error.message);
      return;
    }
  }
};

export const addProductToCartAdapter = async (cid, pid, quantity) => {
  if (flagMongo) {
    try {
      const cart = await getCartByIdAdapter(cid);
      const product = await getProductByIdAdapter(pid);

      if (product) {
        const productCart = cart.products.find((item) => item.product == pid);
        if (productCart) {
          productCart.quantity = quantity;
          const out = cartSchema.updateOne({ _id: cid }, cart);
          return out;
        }
        const add = {
          product: product._id,
          quantity: quantity,
        };
        cart.products.push(add);
        const out = cartSchema.updateOne({ _id: cid }, cart);
        return out;
      }
    } catch (error) {}
  }
};
export const deleteProductToCartAdapter = async (cid, pid) => {
  const cart = await getCartByIdAdapter(cid);
  const idx = cart.products.findIndex((pr) => pr.product == pid);

  if (idx === -1) {
  } else {
    cart.products.splice(idx, 1);
    const out = await cartSchema.updateOne({ _id: cid }, cart);
    return out;
  }
};

export const addArray = async (id, p) => {
  const cart = await getCartByIdAdapter(id);
  if (cart) {
    cart.products = p;
    const out = await cartSchema.updateOne({ _id: id }, cart);
    return out;
  }
};

export const getCartPopulate = async (id) => {
  const c = await cartSchema.findOne({ _id: id }).populate("products.product");
  return c;
};

export const deleteAllProductToCartAdapter = async (cid) => {
  const cart = await getCartByIdAdapter(cid);
  if (cart) {
    cart.products = [];
    const out = await cartSchema.updateOne({ _id: cid }, cart);
    return out;
  }
};

export const getCartByIdAdapter = async (id) => {
  if (flagMongo) {
    try {
      const cart = await cartSchema.findOne({ _id: id });
      return cart;
    } catch (error) {
      console.log(error.message);
      return;
    }
  }
};
