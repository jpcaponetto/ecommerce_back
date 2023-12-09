import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { createUser, findUserById } from "../dao/userAdapater.js";
import { createCartAdapter } from "../dao/cartAdapter.js";

export const Init = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, email, password, done) => {
        const {
          body: { firstName, lastName, role, age },
        } = req;
        if (!firstName || !lastName || !role || !email || !password || !age) {
          return done(new Error("Todos los campos son obligatorios "));
        } else {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(password, salt);
          password = hash;
          const cart = createCartAdapter({ products: [] });
          const cid = cart._id;
          const createUserObject = {
            firstName,
            lastName,
            role,
            email,
            password,
            age,
          };
          try {
            const user = await createUser(createUserObject, cid);
            if (user) {
              done(null, user);
            }
          } catch (error) {
            done(error.message);
          }
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await findUserById(id);
    done(null, user);
  });
};
