import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { createUser } from "../dao/userAdapater";

export const Init = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, email, password, done) => {
        const { body } = req;
        const { password } = body;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        body.password = hash;
        try {
          const user = await createUser(body);
          if (user) {
            done(null, user);
          }
        } catch (error) {
          done(error.message);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  //   passport.deserializeUser( async (id, done) => {
  //     const user =  await
  //   });
};
