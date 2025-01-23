import express from "express";
import ProductTable from "./product.module.js";
import * as Yup from "yup";
import mongoose from "mongoose";

const router = express.Router();

//add product
router.post(
  "/product/add",
  async (req, res, next) => {
    const userValidationSchema = Yup.object({
      name: Yup.string().required().trim().max(155),
      brand: Yup.string().required().trim().max(155),
      price: Yup.string().required().min(0),
      quantity: Yup.string().required().min(1),
      category: Yup.string()
        .required()
        .trim()
        .oneOf([
          "grocery",
          "electronics",
          "electrical",
          "clothing",
          "kitchen",
          "kids",
          "laundry",
        ]),
      image: Yup.string().notRequired().trim(),
    });
    try {
      console.log(req.body);
      req.body = await userValidationSchema.validate(req.body);
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    const newProduct = req.body;

    //add product
    await ProductTable.create(newProduct);
    return res.status(201).send({ message: "Product  is added successfully" });
  }
);

//get product by id
router.get(
  "/product/details/:id",
  (req, res, next) => {
    //extract product frm id
    const productId = req.params.id;
    const productIdIsValid = mongoose.isValidObjectId(productId);

    if (!productIdIsValid) {
      return res.status(400).send({ message: "Invalid product id" });
    }
    next();
  },
  async (req, res) => {
    //extract product id from req.params
    const productId = req.params.id;

    //find product
    const product = await ProductTable.findOne({ _id: productId });

    //if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist.." });
    }
    return res
      .status(200)
      .send({ message: "Success", productDetails: product });
  }
);

// Delete product by ID
router.delete(
  "/product/delete/:id",
  (req, res, next) => {
    // Extract product ID from request params
    const productId = req.params.id;

    // Validate product ID
    const productIdIsValid = mongoose.isValidObjectId(productId);

    if (!productIdIsValid) {
      return res.status(400).send({ message: "Invalid product id" });
    }
    next();
  },
  async (req, res) => {
    const productId = req.params.id;

    // Attempt to delete the product
    const deleteResult = await ProductTable.findByIdAndDelete(productId);

    // Check if the product existed and was deleted
    if (!deleteResult) {
      return res.status(404).send({ message: "Product not found" });
    }

    return res.status(200).send({ message: "Product deleted successfully" });
  }
);

export { router as productController };
