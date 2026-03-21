

import Cart from "../../model/Cart.js";

export const getOrCreateCart = async (options) => {

  try {
    
    const {buyerId, sessionId} = options
  
    let cart
    if(buyerId){
  
      cart = await Cart.findOneAndUpdate(
       { buyerId }, // Query: find cart by buyerId
       { 
         $setOnInsert: { // Only set these fields if creating new document
           buyerId,
           items: [],
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
    }
  
    if(sessionId){
  
      cart = await Cart.findOneAndUpdate(
       { sessionId }, // Query: find cart by buyerId
       { 
         $setOnInsert: { // Only set these fields if creating new document
          //  buyerId,
           items: [],
           totalAmount: 0,
           sessionId
         } 
       },
       { 
         upsert: true,              // Create if doesn't exist
         new: true,                 
         setDefaultsOnInsert: true, // Apply schema defaults on insert
         runValidators: false       
       }
     ).exec();

    //  console.log(cart, 'found cart')
    }
    
    return cart;
  } catch (error) {
    console.log(error, 'error in get cart service')
  }

};