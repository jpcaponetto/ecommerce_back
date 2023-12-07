import { Server } from "socket.io";
import productSchema from "../dao/models/product.model.js";
import messageSchema from "../dao/models/message.model.js";
import {
  createProductAdapter,
  deleteProductAdapter,
  updateProductAdapter,
} from "../dao/productAdapter.js";

let io;

const init = (httpSever) => {
  io = new Server(httpSever);

  io.on("connection", async (socketClient) => {
    const messages = await messageSchema.find({});
    io.emit("get-messages", messages);
    console.log(`New client connected ${socketClient.id}`);
    const products = await productSchema.find({}).sort({ createdAt: -1 });
    io.emit("get-products", products);

    socketClient.on("new-product", async (product) => {
      createProductAdapter(product);
      const products = await productSchema.find({}).sort({ createdAt: -1 });
      io.emit("get-products", products);
    });

    socketClient.on("update-product", async (body) => {
      let oid = body.id;
      delete body.id;
      updateProductAdapter(oid, body);
      const products = await productSchema.find({}).sort({ createdAt: -1 });
      io.emit("get-products", products);
    });
    socketClient.on("delete-product", async (id) => {
      deleteProductAdapter(id);
      const products = await productSchema.find({}).sort({ createdAt: -1 });
      io.emit("get-products", products);
    });
    socketClient.on("send-message", async (body) => {
      await messageSchema.create(body);
      const messages = await messageSchema.find({}).sort({ createdAt: -1 });
      io.emit("get-messages", messages);
    });
  });
};

export default init;
