import User from "../model/User.js"
import Cart from "../model/Cart.js";
import { getRoleName } from "../config/rolesList.js";


export const loadCart = async (req, res, next) => {
    const roleName = getRoleName(req.role);
    if(req.user && roleName && roleName == "Buyer") {
         try {
   //  console.log(req.userId, 'req userId')
    const buyer = await User.findById(req.userId).exec()
    // if (!buyer) return res.render('auth/signin', {
    //     pageTitle: "Log In",
    //     path: "auth/signin",
    //     validationErrors: [],
    //     errorMessage: "",
    //     formValues: {}
    //   })

    if(!buyer) res.redirect("/login")

    const cart = await Cart.findOne({ buyerId: buyer._id }).exec()
    
     res.locals.cart = cart || { cartItems: [], totalAmount: 0 }
     res.locals.user = req.user
  } catch (error) {
   // console.log(error, 'error in load cart')
     res.locals.cart = { cartItems: [], totalAmount: 0 }
  }
    }else {
        // seller or guest
         res.locals.cart =  { cartItems: [], totalAmount: 0 }
    }
 next()
};