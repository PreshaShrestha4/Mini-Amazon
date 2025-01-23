import express from "express"
import dbConnect from "./db.connection.js";
import {userController} from "./user/user.controller.js";
import { productController } from "./user/product/product.controller.js";

//backend app
const app = express();

//to make app understand json
app.use(express.json());

//database connection
dbConnect();

//register routes/controller
app.use(userController);
app.use(productController);

//network port
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});