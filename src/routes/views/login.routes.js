import { Router } from "express";
import { autenticationFn } from "../out/autentication.js";
const loginRouter = Router();

loginRouter.get("/login", (req, res) => {
  res.render("login");
});

loginRouter.get("/register", (req, res) => {
  res.render("register");
});

loginRouter.get("/profile", autenticationFn, (req, res) => {
  res.render("profile", req.session.user);
});

export default loginRouter;
