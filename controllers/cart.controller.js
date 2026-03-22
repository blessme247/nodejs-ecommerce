import User from "../model/User.js";
import Cart from "../model/Cart.js";
import Product from "../model/Product.js";
import { addItemToCart } from "../services/cart/addItemToCart.js";
import { validationResult } from "express-validator";
import { handleError } from "../utils/handleError.js";
import { getHomepageData } from "../services/getHomepageData.js";
import { handleSuccess } from "../utils/handleSuccess.js";

export const getCart = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "id parameter is required" });
    }
    const Buyer = await User.findById(id);
    if (!Buyer) return res.status(404).json({ message: "User not found" });

    const cartItems = await Cart.find({ buyerId: id });
    if (!cartItems)
      return res.status(404).json({ message: "No items found in cart." });
    return res.json({ data: cartItems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCartPage = async (req, res) => {
  try {
    const sessionId = req.sessionID
    const userId = req.userId

    if(userId){ // authenticated user
      const Buyer = await User.findById(userId).exec()
      if(!Buyer) return res.redirect("login")
        const cart = await Cart.findOne({ buyerId: userId }).populate({
        path:"items.productId",
        select:"name price quantityAvailable inStock categoryId assetId",
        populate: [
          { path: "categoryId", select: "name" },
          { path: "assetId", select: "secure_url" },
        ]
      }).exec()
      return handleSuccess(req, res, 400, {
      filePath: "shop/cart",
      data: cart,
      pageTitle: `Cart (${cart?.items?.length || 0})`
    }); 
    }
    else {
      const cart = await Cart.findOne({ sessionId }).populate({
        path:"items.productId",
        select:"name price quantityAvailable inStock categoryId assetId",
        populate: [
          { path: "categoryId", select: "name" },
          { path: "assetId", select: "secure_url" },
        ]
      }).exec()
      
      return handleSuccess(req, res, 400, {
      filePath: "shop/cart",
      data: cart,
      pageTitle: `Cart (${cart?.items?.length || 0})`
    }); 
    }
  } catch (error) {
    console.log(error, 'error in get cart page')
  }
}

export const addProductToCart = async (req, res) => {
  let errors = validationResult(req);
  // console.log(errors, "errors");
  // const categories = await ProductCategory.find().exec();

  const { data, paginator, error } = await getHomepageData(req);
  if (!errors.isEmpty()) {
    return handleError(req, res, 400, {
      message: error,
      filePath: "index.ejs",
      data,
      paginator,
    });
  }
  try {
    // console.log('getting to try block')
    const { productId } = req.body;

    if (!productId)
      return handleError(req, res, 400, {
        message: "ProductId is required",
        filePath: "index.ejs",
        data,
        paginator,
      });

    const product = await Product.findById(productId).exec();

    if (!product)
      return handleError(req, res, 404, {
        message: "Product not found",
        filePath: "index.ejs",
        data,
        paginator,
      });
    if (product.quantityAvailable === 0)
      return handleError(req, res, 400, {
        message: `${product.name} is out od stock`,
        filePath: "index.ejs",
        data,
        paginator,
      });

    // let cart
    const quantity = 1;

    if (req.user) {
      // logged in user

      const username = req.user;
      const foundUser = await User.findOne({ username }).exec();

      await addItemToCart(req, productId, quantity, { buyerId: foundUser._id });
    } else {
      // Guest user

      await addItemToCart(req, productId, quantity, { sessionId: req.sessionID });
    }
    // return res
    //   .status(201)
    //   .json({ message: "Product added to cart", data: cart });
    res.redirect("/cart")
  } catch (error) {
    console.log('Unable to add product to cart', error)
    // return res.status(500).json({ message: "Internal Server Error" });
    return handleError(req, res, 400, {
      message: `Server error`,
      filePath: "index.ejs",
      data,
      paginator,
    });
  }
};

// export default {
//   getCart,
//   addProductToCart,
// };
