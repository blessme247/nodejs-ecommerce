import { getOrCreateCart } from "./getOrCreateCart.js";
import Product from "../model/Product.js";

export const addItemToCart = async ( productId, quantity, options) => {
  const {buyerId, sessionId} = options

  // let cart
   const cart =  await buyerId ? getOrCreateCart({buyerId}) : getOrCreateCart({sessionId})
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
  if(sessionId){
    // Sync cart expiration with session
    const sessionExpiry = req.session.cookie.expires;
    cart.expiresAt = new Date(sessionExpiry)
  } 
  await cart.save();
  return cart;
};
