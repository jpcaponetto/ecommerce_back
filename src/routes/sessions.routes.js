import { Router } from "express";
import {
  checkPassword,
  createPayload,
  createUser,
  findEmail,
} from "../dao/userAdapater.js";
import bcrypt from "bcrypt";
import { createCartAdapter } from "../dao/cartAdapter.js";
import passport from "passport";

const sessionsRouter = Router();
sessionsRouter.post("/sessions/register", async (req, res) => {
  const { body } = req;
  const { password } = body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  body.password = hash;

  try {
    const w = { products: [] };
    const cart = await createCartAdapter(w);
    const cartId = cart._id;
    const user = await createUser(body, cartId);
    res.redirect("/login");
  } catch (error) {
    res.json(error.message);
  }
});

sessionsRouter.post("/sessions/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findEmail(email);
    if (user) {
      const check = bcrypt.compareSync(password, user.password);
      if (check) {
        const payload = createPayload(user);
        req.session.user = payload;
        res.redirect("/profile");
      }
    }
  } catch (error) {}
});

sessionsRouter.post(
  "/sessions/out_login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  async (req, res) => {
    res.redirect("/profile");
  }
);

sessionsRouter.get(
  "/sessions/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

sessionsRouter.get(
  "/sessions/github/callback",
  passport.authenticate("github", { failureRedirect: "login" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

sessionsRouter.post(
  "/sessions/auth/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  async (req, res) => {
    res.redirect("/login");
  }
);

sessionsRouter.get("/sessions/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.redirect("/login");
    }
  });
});

export default sessionsRouter;
