import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { createUser, findEmail, findUserById } from "../dao/userAdapater.js";
import { createCartAdapter } from "../dao/cartAdapter.js";
import { Strategy as GitHubStrategy } from "passport-github2";

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
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const newemail = await findEmail(email);
        if (!newemail) {
          return done(new Error("No se encontró el email o la constraseña"));
        }
        const check = bcrypt.compareSync(password, newemail.password);
        if (check) {
          return done(null, newemail);
        }
      }
    )
  );
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.clientid,
        clientSecret: process.env.secretclient,
        callbackURL: "http://localhost:7000/api/sessions/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const { userName, provider, displayName } = profile;
        const getEmail = profile._json.email || "test@test";
        const femail = await findEmail(getEmail);
        if (femail) {
          return done(null, femail);
        }
        const user = {
          firstName: profile._json.name,
          lastName: "",
          email: getEmail,
          username: displayName,
          provider,
          password: "",
          age: 31,
        };
        const cart = await createCartAdapter({ products: [] });
        const id = cart._id;
        const wuser = await createUser(user, id);
        return done(null, wuser);
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
