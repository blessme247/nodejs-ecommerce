import Order from "../model/Order.js";
import OrderItems from "../model/OrderItem.js";
import { paginateResponse } from "../utils/index.js";
import Product from "../model/Product.js";
import User from "../model/User.js";
import OrderStatus from "../model/OrderStatus.js";
import Seller from "../model/Seller.js"
import { handleError } from "../utils/handleError.js";
import { handleSuccess } from "../utils/handleSuccess.js";
import Buyer from "../model/Buyer.js"

export const getAllSellerOrders = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return handleError(req, res, 400, "id parameter is required")
    }
    const seller = await Seller.findOne({userId: id}).exec();
    if (!seller) return handleError(req, res, 404, "seller not found")

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const pipeline = [
      {$match: {
        sellerId:  seller.userId
      }},
      {
        $lookup: {
          from: "orderstatus",
          localField: "statusId", // Field in 'order item'
          foreignField: "_id", // Field in 'order_statuses'
          as: "status",
        },
      },
      { $unwind: "$status" },
      { $unset: ["_id", "__v", "sellerId"] },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      },
    ];

    const result = await OrderItems.aggregate(pipeline);

    const { data, paginator } = paginateResponse(result, page, limit);

    if (!data || data.length === 0) return handleError(req, res, 404, { message: "orders not found" })

    // return res.status(200).json({ data, paginator });
    return handleSuccess(req, res, 200, {data, paginator, message, pageTitle: "Seller Orders", path: "shop/orders"})
  } catch (error) {
    console.error(error);
    return handleError(req, res, 500, { message: error?.message || "Internal server error" })
  }
};

export const getAllBuyerOrders = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return handleError(req, res, 400, "id parameter is required")
    }
    const buyer = await Buyer.findOne({userId: id}).exec();
    if (!buyer) return handleError(req, res, 404, "buyer not found")

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const pipeline = [
      {$match: {
        buyerId:  buyer.userId
      }},
      {
        $lookup: {
          from: "orderstatus",
          localField: "statusId", // Field in 'order item'
          foreignField: "_id", // Field in 'order_statuses'
          as: "status",
        },
      },
      { $unwind: "$status" },
      { $unset: ["_id", "__v", "sellerId"] },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      },
    ];

    const result = await Order.aggregate(pipeline);

    const { data, paginator } = paginateResponse(result, page, limit);

    if (!data || data.length === 0) return handleError(req, res, 404, { message: "orders not found" })

    // return res.status(200).json({ data, paginator });
    return handleSuccess(req, res, 200, {data, paginator, message, pageTitle: "Buyer Orders", path: "shop/orders"})
  } catch (error) {
    console.error(error);
    return handleError(req, res, 500, { message: error?.message || "Internal server error" })
  }
};

export const makeOrder = async (req, res) => {
  try {
    const username = req.user;
    const foundUser = await User.findOne({ username }).exec();

    const { orderItems } = req.body;

    if(!orderItems || orderItems.length == 0) return res.status(400).json({message: "orderItems is required in request body"})
    
      const pendingStatus = await OrderStatus.findOne({code: 1}).exec()

    let totalPrice = 0
    const transformedOrderItems = orderItems.forEach(async (item, index)=> {
        const {productId, quantity} = item
        if(!productId) return res.status(400).json({message: `Product id is missing for order item ${index + 1}`})
        const foundProduct = await Product.findById(productId).exec()
        if(!foundProduct) return res.status(400).json({message: `Invalid product id for ${foundProduct.name}`})
        if(quantity == 0 || typeof quantity !== "number") return res.status(400).json({message: `Invalid quantity for ${foundProduct.name}`})
        if(foundProduct.quantityAvailable === 0) return res.status(400).json({message: `${foundProduct.name} is out of stock`})
        if(foundProduct.quantityAvailable < quantity) return res.status(400).json({message: `Order quantity for ${foundProduct.name} exceeds available quantity ${foundProduct.quantityAvailable}`})

        totalPrice += foundProduct.price 
        return {name: foundProduct.name, price: foundProduct.price, quantity, productId, sellerId: foundProduct.sellerId, statusId: pendingStatus._id}
    })

    const order = new Order({
      buyerId: foundUser._id,
      totalAmount: totalPrice,
      statusId: pendingStatus._id
    })

    await order.save()
    console.log(order, 'order')

    const savedOrderItems = await OrderItems.insertMany(transformedOrderItems.map((item)=> ({ orderId: order._id, ...item })))

    console.log(savedOrderItems, 'saved order itesm')
    return res.status(201).json({ 'success': `New order added!` });
  } catch (error) {
    console.log(error, 'error')
     return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "id parameter is required" });
  }
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ message: "firstName and LastName is required" });
  }
  const employee = await Employee.findById(id);

  if (employee) {
    const result = await Employee.findByIdAndUpdate(
      employee._id,
      { firstName, lastName },
      { returnDocument: "after" }
    );
    console.log(result, "employee update result");
    return res.json({
      message: `Employee ${employee._id} updated!`,
    });
  } else {
    res.status(404).json({
      message: "Employee not found",
    });
  }
};


