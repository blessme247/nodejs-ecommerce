import Product from "../model/Product.js";
import Seller from "../model/Seller.js";
import ProductCategory from "../model/ProductCategory.js"
import User from "../model/User.js"

const getProducts = async (req, res) => {
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
      return res.status(404).json({ message: "No product found." });

    return res.status(200).json({ data, paginator });
  } catch (error) {
    console.log(error, "error in catch block");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProductsBySellerId = async (req, res) => {
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

const addProduct = async (req, res) => {
  try {
    const username = req.user;
    const foundUser = await User.findOne({ username }).exec();
    const {name, price, description, quantityAvailable, categoryId} = req.body

    if(quantityAvailable == 0 || typeof quantityAvailable !== "number") return res.status(400).json({message: `Invalid quantity`})
    const foundCategory = await ProductCategory.findById(categoryId).exec()
    if(!foundCategory) return res.status(400).json({message: `Invalid category`})
    
    const product = new Product({
        name,
        price,
        description,
        quantityAvailable,
        categoryId,
        sellerId: foundUser._id
    })

    await product.save()

    return res.status(201).json({ 'success': `New product added!` });
  } catch (error) {
    console.log(error, 'error')
     return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getProducts,
  getProductsBySellerId,
  addProduct
};
