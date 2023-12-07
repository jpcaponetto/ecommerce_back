import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { __dirname } from "./utils.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import socketProductRouter from "./routes/product.socket.routes.js";
import chatRouter from "./routes/chat.routes.js";
import productsViewRouter from "./routes/views/products.render.routes.js";
import loginRouter from "./routes/views/login.routes.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { MONGO_URI } from "./database/mongodb.js";
import sessionsRouter from "./routes/sessions.routes.js";

const app = express();
const secret = "Este valor es secreto";

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      mongoOptions: {},
      ttl: 200,
    }),
    secret,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.engine("handlebars", engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use("/api", productsRouter, cartsRouter, sessionsRouter); // back
app.get("/", (req, res) => {
  res.redirect("/login");
});
app.use("/", socketProductRouter, chatRouter, productsViewRouter, loginRouter); // front

// app.get("/", async (req, res) => {
//   // const products = await productManager.getProducts();
//   //res.render("home", {products});
// });

export default app;
