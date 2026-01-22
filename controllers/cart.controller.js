import User from "../model/User.js";
import Cart from "../model/Cart.js";

const getCart = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "id parameter is required" });
    }
    const Buyer = await User.findById(id);
    if (!Buyer) return res.status(404).json({ message: "User not found" });

    const cartItems = await Cart.find({ buyer_id: id });
    if (!cartItems) return res.status(404).json({ message: "No items found in cart." });
    return res.json({ data: cartItems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getCart
}