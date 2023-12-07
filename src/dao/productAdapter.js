import ProductManager from "../class/productManager.js";
import productSchema from "./models/product.model.js";
const flagMongo = true;
export const createProductAdapter = async (product) => {
  if (flagMongo) {
    try {
      await productSchema.create(product);
      return;
    } catch (error) {
      console.log(error.message);
      return;
    }
  }
  const productManager = new ProductManager();
  productManager.create(product);
  console.log("created");
};

export const test = async (queryCriteria, options) => {
  const out = await productSchema.paginate(queryCriteria, options);
  return out;
};

export const getProductByIdAdapter = async (id) => {
  if (flagMongo) {
    const product = await productSchema.findOne({ _id: id });
    return product;
  }

  const product = await productManager.getProductsById(id);
  return product;
};

export const getProductsAdapter = async (limit) => {
  if (limit) {
    const products = await productSchema.find({}).limit(limit);
    return products;
  }

  return await productSchema.find({});
};

export const updateProductAdapter = async (id, body) => {
  if (flagMongo) {
    try {
      await productSchema.updateOne({ _id: id }, { $set: body });
      return;
    } catch (error) {
      console.log(error.message);
      return;
    }
  }

  productManager.update(id, body);
};

export const deleteProductAdapter = async (id) => {
  if (flagMongo) {
    try {
      await productSchema.deleteOne({ _id: id });
      return;
    } catch (error) {
      console.log(error.message);
      return;
    }
  }

  productManager.delete(id);
};
