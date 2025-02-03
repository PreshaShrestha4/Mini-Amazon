import express from "express";
import ProductTable from "./product.module.js";
import * as Yup from "yup";
import mongoose from "mongoose";
import isUser from "../middleware/authentication.middleware.js";
import { validateMongoIdFromReqParams } from "../middleware/validate.mongo.id.js";

const router = express.Router();

//add product
router.post(
  "/product/add",
  isUser,
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
  isUser,
  validateMongoIdFromReqParams,
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
  isUser,
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

// list product by ID

router.post(
  "/product/list",
  isUser,
  async (req, res, next) => {
    const paginationSchema = Yup.object({
      page: Yup.number().positive().integer().default(1),
      limit: Yup.number().positive().integer().default(10),
    });

    try {
      req.body = await paginationSchema.validate(req.body);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
    next();
  },
  async (req, res) => {
    // extract page and limit from req.body
    const paginationData = req.body;

    const limit = paginationData.limit;
    const page = paginationData.page;

    const skip = (page - 1) * limit;

    const products = await ProductTable.aggregate([
      {
        $match: {},
      },

      { $skip: skip },
      { $limit: limit },
    ]);

    const totalItem = await ProductTable.find().countDocuments();

    const totalPage = Math.ceil(totalItem / limit);

    return res
      .status(200)
      .send({ message: "success", productList: products, totalPage });
  }
);

router.put(
  "/product/edit/:id",
  isUser,
  validateMongoIdFromReqParams,
  async (req, res, next) => {
    const userValidationSchema = Yup.object({
      name: Yup.string().required().trim().max(155),
      brand: Yup.string().required().trim().max(155),
      price: Yup.number().required().min(0),
      quantity: Yup.number().required().min(1),
      category: Yup.string()
        .required()
        .trim()
        .oneOf([
          "Grocery",
          "Electronics",
          "Electrical",
          "Clothing",
          "Kitchen",
          "Kids",
          "Laundry",
        ]),

      image: Yup.string().notRequired().trim(),
    });
    try {
      req.body = await userValidationSchema.validate(req.body);
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    //extract the product from the req body
    const productId = req.params.id;
    const product = await ProductTable.findOne({ _id: productId });
    if (!product) {
      return res.status(404).send({ message: "Product does not exists" });
    }

    //extract new values from req.body
    const newValues = req.body;
    await ProductTable.updateOne(
      { _id: productId },
      {
        $set: {
          name: newValues.name,
          brand: newValues.brand,
          price: newValues.price,
          quantity: newValues.quantity,
          category: newValues.category,
        },
      }
    );
    return res.status(200).send({ message: "Product is updated successfully" });
  }
);

export { router as productController };
