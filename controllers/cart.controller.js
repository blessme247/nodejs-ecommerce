import User from "../model/User.js";
import Cart from "../model/Cart.js";
import Product from "../model/Product.js";
import { addItemToCart } from "../services/cart/addItemToCart.js";

const getCart = async (req, res) => {
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

const addProductToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity)
      return res
        .status(404)
        .json({ message: "ProductId or quantity is required" });

    const product = await Product.findById(productId).exec();

    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.quantityAvailable === 0)
      return res
        .status(400)
        .json({ message: `${product.name} is out of stock` });
    if (product.quantityAvailable < quantity)
      return res.status(400).json({
        message: `Order quantity for ${product.name} exceeds available quantity ${product.quantityAvailable}`,
      });

      let cart

      if(req.user) { // logged in user

            const username = req.user;
            const foundUser = await User.findOne({ username }).exec();
        
             cart = await addItemToCart( productId, quantity, {buyerId: foundUser._id,});
      }

      else{ // Guest user
        
             cart = await addItemToCart( productId, quantity, {sessionId: req.sessionID});
      }
    return res
      .status(201)
      .json({ message: "Product added to cart", data: cart });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  getCart,
  addProductToCart,
};
