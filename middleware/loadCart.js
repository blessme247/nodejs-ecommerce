import Cart from "../model/Cart.js";

export const loadCart = async (req, res, next) => {
   try {
      let cart;

      // logged in user
      console.log('trigger load cart')
      if(req.userId){
         console.log('check cart for user')
         cart = await Cart.findOne({buyerId: req.userId}).exec()
      }

      // guest with session
      else if(req.sessionID) {
         console.log('check cart for guest')
         cart = await Cart.findOne({sessionId: req.sessionID}).exec()
         // res.locals.user = {role: "Guest"}
      }

      res.locals.cart = cart || { items: [], totalAmount: 0 };
   } catch (error) {
       console.error('Error loading cart:', error);
    res.locals.cart = { items: [], totalAmount: 0 };
   }

   next()
}