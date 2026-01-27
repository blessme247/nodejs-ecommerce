import Cart from "../model/Cart.js";

export const getOrCreateCart = async (buyerId) => {
  const cart = await Cart.findOneAndUpdate(
    { buyerId }, // Query: find cart by buyerId
    { 
      $setOnInsert: { // Only set these fields if creating new document
        buyerId,
        cartItems: [],
        totalAmount: 0
      } 
    },
    { 
      upsert: true,              // Create if doesn't exist
      new: true,                 
      setDefaultsOnInsert: true, // Apply schema defaults on insert
      runValidators: false       
    }
  ).exec();
  
  return cart;
};