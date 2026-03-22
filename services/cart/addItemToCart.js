import { getOrCreateCart } from "./getOrCreateCart.js";
import Product from "../../model/Product.js";
import { syncCartWithSession } from "./syncCartWithSession.js";

export const addItemToCart = async (req, productId, quantity, options) => {
  // console.log('trigger add to cart service')
  const {buyerId, sessionId} = options

  // const product = await Product.findById(productId).exec()

  // let cart
   const cart =   buyerId  ? await getOrCreateCart({buyerId}) : await getOrCreateCart({sessionId})
  //  console.log(cart, 'cart')
  const existingItem = cart?.items?.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity});
  }

  let totalAmount = 0;
  for (const item of cart.items) {
    const product = await Product.findById(item.productId).exec();
    totalAmount += product.price * item.quantity;
  }

  cart.totalAmount = totalAmount;

  if(sessionId){
    // Sync cart expiration with session
    // const sessionExpiry = req.session.cookie.expires;
    // cart.expiresAt = new Date(sessionExpiry)
    syncCartWithSession(req, cart)
  } 
  await cart.save();
  return cart;
};
