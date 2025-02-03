import jwt from "jsonwebtoken";
import UserTable from "../user.model.js";

const isUser = async (req, res, next) => {
  // extract token from req.headers.authorization
  const authorization = req?.headers?.authorization;
  const splittedToken = authorization?.split(" ");

  const token = splittedToken?.length === 2 ? splittedToken[1] : null;
  console.log(token);
  if (!token) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  let payload = null;
  try {
    const secretKey = " hbdbhbhbbjj";

    payload = jwt.verify(token, secretKey);
  } catch (error) {
    //if decryption fails, throw error
    // reason:
    //secreteKey is different
    // token is not from our system/altered token
    // token is from system, but token has been expired
    return res.status(401).send({ message: "Unauthorized." });
  }

  //  find user
  const user = await UserTable.findOne({ email: payload.email });

  if (!user) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  next();
};

export default isUser;
//bearer vaneko legal word ho
//is user le request linxa
