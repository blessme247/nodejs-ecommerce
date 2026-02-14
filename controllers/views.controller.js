import Product from "../model/Product.js";
import Seller from "../model/Seller.js";
import ProductCategory from "../model/ProductCategory.js";
import User from "../model/User.js";
import { handleError } from "../utils/handleError.js";
import { handleSuccess } from "../utils/handleSuccess.js";
import { paginateResponse } from "../utils/index.js";

export const getHomepage = async (req, res) => {
  try {
    const { inStock, categoryId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
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

        if (!result || result.length === 0) return handleSuccess(req, res, 200, { filePath: "index.ejs", data: [] });

    const { data, paginator } = paginateResponse(result, page, limit);
    console.log(paginator, 'paginator in get homepage')
    return handleSuccess(req, res, 200, {data, paginator, filePath: "index.ejs"})
  } catch (error) {
    console.log(error, "error in catch block");
   return handleError(req, res, 500, { filePath: "index.ejs", message: error?.message || "Internal server error" })
  }
};