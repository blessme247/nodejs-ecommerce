import Product from "../model/Product.js";
import { paginateResponse } from "../utils/index.js";


export const getHomepageData = async (req) => {
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
    
         const categoryLookup = {
          from: "productcategories",
          localField: "categoryId", // Field in 'product'
          foreignField: "_id", // Field in 'productcategories'
          as: "category",
        };
    
        const assetLookup = {
          from: "assets",
          localField: "assetId", // Field in 'product'
          foreignField: "_id", // Field in 'assets'
          as: "asset",
        };
        pipeline.push(
          { $match: match },
          { $lookup: categoryLookup },
          { $unwind: "$category" },
        //   { $unset: ["_id", "__v"] },
           { $lookup: assetLookup },
          { $unwind: "$asset" },
          {
            $unset: [
            //   "_id",
              "__v",
              "category.__v",
              "category.code",
              "asset.type",
              "asset.bytes",
              "asset.eager",
              "asset.format",
            ],
          },
           { $sort: sort },
            { $facet: facet });
    
        const result = await Product.aggregate(pipeline).exec();
    
        // if (!result || result.length === 0) return handleSuccess(req, res, 200, { filePath: "index.ejs", data: [] });
        if(!result || result.length === 0) return {data: [], paginator: null, error: null}
    
        const { data, paginator } = paginateResponse(result, page, limit);

        return {data, paginator, error: null}
        // console.log(data, 'products data in get homepage')
        // return handleSuccess(req, res, 200, {data, paginator, filePath: "index.ejs"})
      } catch (error) {
        console.log(error, "error in catch block");
    //    return handleError(req, res, 500, { filePath: "index.ejs", message: error?.message || "Internal server error" })
    return {data:[], error: error.message || "Couldnt get homepage data"}
      }
}