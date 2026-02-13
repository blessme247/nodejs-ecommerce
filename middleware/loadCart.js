import User from "../model/User.js"
import Cart from "../model/Cart.js";
import { getRoleName } from "../config/rolesList.js";


export const loadCart = async (req, res, next) => {
    const roleName = getRoleName(req.role);
    if(req.user && roleName && roleName == "Buyer") {
         try {
    
    const buyer = await User.findOne({username: req.username}).exec()
    // if (!buyer) return res.render('auth/signin', {
    //     pageTitle: "Log In",
    //     path: "auth/signin",
    //     validationErrors: [],
    //     errorMessage: "",
    //     formValues: {}
    //   })

    if(!buyer) res.redirect("/login")

    const cart = await Cart.find({ buyerId: buyer._id }).exec()
    
     res.locals.cart = cart || { cartItems: [], totalAmount: 0 }
  } catch (error) {
     res.locals.cart = { cartItems: [], totalAmount: 0 }
  }
    }else {
        // seller or guest
         res.locals.cart =  { cartItems: [], totalAmount: 0 }
    }
 next()
};