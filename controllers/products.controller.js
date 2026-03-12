import Product from "../model/Product.js";
import Seller from "../model/Seller.js";
import ProductCategory from "../model/ProductCategory.js";
import User from "../model/User.js";
import { handleError } from "../utils/handleError.js";
import { handleSuccess } from "../utils/handleSuccess.js";
import { paginateResponse } from "../utils/index.js";
import {uploadToCloud} from "../services/uploadToCloud.js";
import { validationResult } from "express-validator";

export const getProducts = async (req, res) => {
  try {
    const { inStock, categoryId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const match = {};

    // Aggregation pipeline for paginated results

    const pipeline = [];
    if (inStock) {
      match["inStock"] = inStock;
    }
    if (categoryId) {
      match["categoryId"] = categoryId;
    }

    const sort = { _id: 1 };
    const facet = {
      data: [{ $skip: skip }, { $limit: limit }],
      total: [{ $count: "count" }],
    };
    pipeline.push({ $match: match }, { $sort: sort }, { $facet: facet });

    const result = await Product.aggregate(pipeline).exec();

    const { data, paginator } = paginateResponse(result, page, limit);

    if (!result || result.length === 0)
      return handleError(req, res, 404, { message: "products not found" });

    return handleSuccess(req, res, 200, {
      data,
      paginator,
      pageTitle: "Products",
      path: "shop/products",
    });
  } catch (error) {
    console.log(error, "error in catch block");
    return handleError(req, res, 500, {
      message: error?.message || "Internal server error",
    });
  }
};

export const getProductsBySellerId = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { inStock, categoryId } = req.query;

    if (!sellerId) {
      return res
        .status(400)
        .json({ message: "sellerId parameter is required" });
    }

    const seller = await Seller.findOne({ userId: sellerId }).exec();
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const match = {};
    const pipeline = [];

    match["sellerId"] = seller.userId;
    if (inStock) {
      match["inStock"] = inStock;
    }
    if (categoryId) {
      match["categoryId"] = categoryId;
    }
    const sort = { _id: 1 };
    const facet = {
      data: [{ $skip: skip }, { $limit: limit }],
      total: [{ $count: "count" }],
    };

    // Aggregation pipeline for paginated results
    // const pipelinee = [
    //   { $match: {
    //     sellerId:  seller.userId
    //   } },
    //   { $sort: { _id: 1 } }, // or other sort key
    //   {
    //     $facet: {
    //       data: [{ $skip: skip }, { $limit: limit }],
    //       total: [{ $count: "count" }],
    //     },
    //   },
    // ];

    pipeline.push({ $match: match }, { $sort: sort }, { $facet: facet });

    const result = await Product.aggregate(pipeline).exec();

    const { data, paginator } = paginateResponse(result, page, limit);

    if (!result || result.length === 0)
      return res.status(404).json({ message: "No product found." });

    return res.status(200).json({ data, paginator });
  } catch (error) {
    console.log(error, "error in catch block");
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addProduct = async (req, res) => {
   let errors = validationResult(req);
    console.log(errors, "errors")
    const categories = await ProductCategory.find().exec();
    if (!errors.isEmpty()) {
      return handleError(req, res, 400, {
        message: errors.array()[0].msg,
        filePath: "shop/manage-product",
        pageTitle: "Add Product",
        errors: errors.array(),
        formValues: req.body,
        data: null,
        categories
      });

    }


  try {
    const userId = req.userId;
    const foundUser = await User.findById(userId).exec();
    console.log(foundUser, "found user")
    if(!foundUser) return res.redirect("/login")

      const { error, asset } = await uploadToCloud(req);
      if (asset) {
        const { name, price, description, quantityAvailable, categoryId } =
          req.body;

      //   if (quantityAvailable == 0 || typeof quantityAvailable !== "number")
      //    return handleError(req, res, 400, {
      //   message: "Invalid quantity",
      //   filePath: "shop/manage-product",
      //   pageTitle: "Add Product",
      //   errors: [{path: "quantityAvailable", msg: "Quantity must be a number"}],
      //   formValues: req.body,
      //   data: null,
      //   categories
      // });

        const foundCategory = await ProductCategory.findById(categoryId).exec();
        if (!foundCategory)
         return handleError(req, res, 400, {
        message: "Invalid category",
        filePath: "shop/manage-product",
        pageTitle: "Add Product",
        errors: [{path: "categoryId", msg: "Category does not exist"}],
        formValues: req.body,
        data: null,
        categories
      });

      // console.log(asset, 'asset')

        await asset.save()

        const product = new Product({
          name,
          price,
          description,
          quantityAvailable,
          categoryId,
          sellerId: foundUser._id,
          assetId: asset._id
        });

        await product.save();

    //     res.render("shop/manage-product", {
    //     pathName: "shop/manage-product",
    //     validationErrors: [],
    //     errorMessage: null,
    //     pageTitle: "Add Product",
    //     data: null
    // })
    //     return res.status(201).json({ message: `New product added!` });
        res.redirect("/products/seller")
      } else {

     return handleError(req, res, 400, {
        message: error,
        filePath: "shop/manage-product",
        pageTitle: "Add Product",
        errors: errors.array(),
        formValues: req.body,
        data: null,
        categories
      });
      }
 
  } catch (error) {
    // console.log(error, "error");
    //  res.render("shop/manage-product", {
    //     pathName: "shop/manage-product",
    //     validationErrors: [],
    //     errorMessage: null,
    //     pageTitle: "Add Product",
    //     data: null
    // })
    // return res.status(500).json({ message: "Internal server error" });

     return handleError(req, res, 400, {
        message: "",
        filePath: "shop/manage-product",
        pageTitle: "Add Product",
        errors: [],
        formValues: req.body,
        data: null,
        categories
      });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "id parameter is required" });
    }

    const { name, price, description, quantityAvailable, categoryId } =
      req.body;

    if (!name && !price && !description && !quantityAvailable && !categoryId) {
      return res.status(400).json({
        message: "At least one field is required to update",
      });
    }

    const foundCategory = await ProductCategory.findById(categoryId).exec();
    if (!foundCategory)
      return res.status(400).json({ message: `Invalid category` });

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (price !== undefined) updateFields.price = price;
    if (description !== undefined) updateFields.description = description;
    if (quantityAvailable !== undefined)
      updateFields.quantityAvailable = quantityAvailable;
    if (categoryId !== undefined) updateFields.categoryId = categoryId;

    const product = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    console.log(product, "product update result");
    return res.json({
      message: `Product ${product._id} updated!`,
      product,
    });
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSellerProductsPage = async (req, res) => {
  try {
    const userId = req.userId;
    // console.log(userId, 'user id')

    const seller = await Seller.findOne({ userId }).exec();
    if (!seller) return res.redirect("/login");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const inStock = req.query.inStock;
    const categoryId = req.query.categoryId;
    const skip = (page - 1) * limit;
    const match = {};
    const pipeline = [];

    console.log(seller, "seller")

    match["sellerId"] = seller.userId;
    if (inStock) {
      match["inStock"] = inStock;
    }
    if (categoryId) {
      match["categoryId"] = categoryId;
    }
    const categoryLookup = {
      from: "productcategories",
      localField: "categoryId", // Field in 'product'
      foreignField: "_id", // Field in 'category'
      as: "category",
    };
    const assetLookup = {
      from: "asset",
      localField: "assetId", // Field in 'product'
      foreignField: "_id", // Field in 'asset'
      as: "asset",
    };
    const sort = { _id: 1 };
    const facet = {
      data: [{ $skip: skip }, { $limit: limit }],
      total: [{ $count: "count" }],
    };

    pipeline.push(
      { $match: match },
      { $lookup: categoryLookup },
      { $unwind: "$category" },
      { $unset: ["_id", "__v"] },
      { $lookup: assetLookup },
      { $unwind: "$asset" },
      {
        $unset: [
          "_id",
          "__v",
          "productId",
          "resource_type",
          "type",
          "bytes",
          "folder",
        ],
      },
      { $sort: sort },
      { $facet: facet },
    );

    const result = await Product.aggregate(pipeline).exec();

    const { data, paginator } = paginateResponse(result, page, limit);

    if (!result || result.length === 0)
      return handleSuccess(req, res, 200, {
        filePath: "shop/seller-products",
        data: [],
        pageTitle: "Seller Products",
        paginator: {},
      });

    return handleSuccess(req, res, 200, {
      filePath: "shop/seller-products",
      data,
      paginator,
      pageTitle: "Seller Products",
    });
  } catch (error) {
    console.log(error, "error in catch block");
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductManagementPage = async (req, res) => {
  try {
    const categories = await ProductCategory.find().exec();
    // console.log(categories, "categories")
    const { productId } = req.params;
    if (!productId)
      return handleSuccess(req, res, 200, {
        filePath: "shop/manage-product",
        data: null,
        pageTitle: "Add Product",
        categories,
        validationErrors: [],
        formValues: null
      });

    const pipeline = [];
    const categoryLookup = {
      from: "productcategory",
      localField: "categoryId", // Field in 'product'
      foreignField: "_id", // Field in 'category'
      as: "category",
    };
    const assetLookup = {
      from: "asset",
      localField: "assetId", // Field in 'product'
      foreignField: "_id", // Field in 'asset'
      as: "asset",
    };
    const sort = { _id: 1 };
    pipeline.push(
      { $match: { _id: productId } },
      { $lookup: categoryLookup },
      { $unwind: "$category" },
      { $unset: ["_id", "__v"] },
      { $lookup: assetLookup },
      { $unwind: "$asset" },
      {
        $unset: [
          "_id",
          "__v",
          "productId",
          "resource_type",
          "type",
          "bytes",
          "folder",
        ],
      },
      { $sort: sort },
    );

    const product = await Product.aggregate(pipeline).exec();
    return handleSuccess(req, res, 200, {
      filePath: "shop/manage-product",
      data: product[0],
      pageTitle: "Add Product",
      categories,
      validationErrors: [],
      formValues: null
    });
  } catch (error) {
    return handleError(req, res, 500, {
      filePath: "shop/manage-product",
      message: error?.message || "Internal server error",
      data: null,
      pageTitle: "Add Product",
      categories: null,
      validationErrors: [],
      formValues: null
    });
  }
};
