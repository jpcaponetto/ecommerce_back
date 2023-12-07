import userSchema from "../dao/models/user.model.js";

export const createUser = async (body, cid) => {
  const p = {
    ...body,
    cid,
  };
  console.log(p);
  const user = await userSchema.create(p);
  if (user) {
    return user;
  }
};

export const findEmail = async (email) => {
  const user = await userSchema.findOne({ email: email });

  if (user) {
    return user;
  }
};

export const checkPassword = async (password) => {
  const user = await userSchema.findOne({ password: password });
  if (user) {
    return user;
  }
};

export const createPayload = (user) => {
  const payload = {
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    email: user.email,
    age: user.age,
    cid: user.cid,
  };

  return payload;
};
