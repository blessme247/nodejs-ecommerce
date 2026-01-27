import { getOrCreateCart } from "./getOrCreateCart.js";
import Product from "../model/Product.js";

export const addItemToCart = async (buyerId, productId, quantity) => {
  const cart = await getOrCreateCart(buyerId);
  const existingItem = cart.cartItems.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.cartItems.push({ productId, quantity });
  }

  const totalAmount = await cart.cartItems.reduce(async (total, item) => {
    const product = await Product.findById(item.productId).exec();
    return total + (product.price * item.quantity);
  }, 0);

  cart.totalAmount = totalAmount;
  await cart.save();
  return cart;
};
