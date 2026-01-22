import User from "../model/User.js";
import { paginateResponse } from "../utils/index.js";

const getAllUsers = async (req, res) => {

    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const match = {}
      
        // Aggregation pipeline for paginated results
        const pipeline = [
          { $match: match },
          { $sort: { _id: 1 } }, // or other sort key
          {
            $facet: {
              data: [{ $skip: skip }, { $limit: limit }],
              total: [{ $count: "count" }],
            },
          },
        ];
      
        const result = await User.aggregate(pipeline).exec();

        const {data, paginator} = paginateResponse(result, page, limit)
      
        if (!result || result.length === 0) return res.status(404).json({ message: "No users found." });
      
        return res.status(200).json({ data, paginator });
    } catch (error) {
        console.log(error, 'error in catch block')
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getSingleUser = async (req, res) => {

    try {
        
        const { id } = req.params;
        if (!id) {
          return res.status(400).json({ message: "id parameter is required" });
        }
        const user = await User.findById(id).exec();
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
    } catch (error) {
         return res.status(500).json({ message: "Internal server error" });
    }
};

export default {
  getAllUsers,
  getSingleUser,
};
