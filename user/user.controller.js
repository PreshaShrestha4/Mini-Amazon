import express from "express";
import UserTable from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Yup from "yup";

const router = express.Router();

router.post(
  "/user/register",
  async (req, res) => {
    //create Schema async (req, res, next) => {
    const LoginUserValidationSchema = Yup.object({
      fullName: Yup.string().required().trim().max(255),
      email: Yup.string().required().trim().max(100).email(),
      password: Yup.string().required().trim(),
      gender: Yup.string()
        .required()
        .trim()
        .oneOf(["male", "Female", "Prefer not to say"]),
      phoneNumber: Yup.string().required().min(10).max(20),
      address: Yup.string().notRequired().trim().max(255),
    });

    try {
      console.log(req.body);
      req.body = await LoginUserValidationSchema.validate(req.body);
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    //   extract new user from req.body
    const newUser = req.body;

    //find user with provided email
    const user = await UserTable.findOne({ email: newUser.email });

    //if user, throw error
    if (user) {
      return res.status(400).send({ message: "Email already existed" });
    }

    // hash password
    // requirement => plain password, saltRounds
    const plainPassword = newUser.password;
    const saltRounds = 10; //randomness
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    //   replace plain password by hashed password
    newUser.password = hashedPassword;

    await UserTable.create(newUser);

    return res
      .status(201)
      .send({ message: "User is registered successfully." });
  }
);

//login route
router.post("/user/login", async (req, res) => {
  //extract login credentials from req.body
  const loginCredentials = req.body;

  //find user with provided email
  const user = await UserTable.findOne({ email: loginCredentials.email });

  //if not user, throw error
  if (!user) {
    return res.status(404).send({ message: "Invalid credentials" });
  }

  //password check
  //need to compare plain password with hashed password
  //plain password is provided by user
  // hashed password is saved in db

  const plainPassword = loginCredentials.password;
  const hashedPassword = user.password;

  const isPasswordMatch = await bcrypt.compare(plainPassword, hashedPassword);

  if (!isPasswordMatch) {
    return res.status(404).send({ message: "Invalid Credentials" });
  }

  //remove password
  user.password = undefined;

  //generate access token
  //secret key
  const secretKey = " hbdbhbhbbjj";

  //payload => object inside token
  const payLoad = { email: user.email };

  // encrypt cipher text
  const token = jwt.sign(payLoad, secretKey, {
    expiresIn: "7d",
  });

  //return res.status(201).send({ message: "Success" , userDetails:user});
  return res
    .status(201)
    .send({ message: "Success", userDetails: user, accessToken: token });
});

export { router as userController };
