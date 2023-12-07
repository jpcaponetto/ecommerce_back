import { Router } from "express";
import { test } from "../../dao/productAdapter.js";
import { paginateResponseSuccess } from "../../class/response.js";
import { autenticationFn } from "../out/autentication.js";

const productsViewRouter = Router();

productsViewRouter.get("/products", autenticationFn, async (req, res) => {
  const { limit = 10, page = 1, category, stock, sort, cid } = req.query;

  const options = { limit, page };
  const queryCriteria = {};

  if (sort) {
    options.sort = { price: sort };
  }
  if (category) {
    queryCriteria.category = category;
  }

  if (stock) {
    queryCriteria.stock = stock;
  }

  const out = await test(queryCriteria, options);
  const out2 = paginateResponseSuccess(out);
  console.log(out2);
  res.render("products", out2);

  // res.json(out);

  // const products = await getProductsAdapter(limit);
  // res.status(200).json(products);
});

export default productsViewRouter;
