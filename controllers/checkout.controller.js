import Cart from '../model/Cart.js';
import Product from '../model/Product.js';
import { handleError } from "../utils/handleError.js";

export const getCheckoutPage = async (req, res) => {
  try {
    // Require authentication for checkout
    if (!req.userId) {
      return res.redirect('/login?redirect=checkout');
    }

    // Get cart (already loaded by loadCart middleware)
    const cart = await Cart.findOne({ buyerId: userId }).populate({
                path:"items.productId",
                select:"name price sellerId "
              }).exec()

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.redirect('/cart');
    }

    // Check if all items are in stock
    for (const item of cart.items) {
    //     const foundProduct = await Product.findById(item.productId._id).exec()
    //   if (!foundProduct) {
    //     return handleError(req, res, 400, {
    //       message: 'Some items in your cart are no longer available',
    //       filePath: 'shop/cart',
    //       pageTitle: 'Shopping Cart'
    //     });
    //   }

      if (!item.productId.inStock) {
        return handleError(req, res, 400, {
          message: `${item.productId.name} is out of stock`,
          filePath: 'cart',
          pageTitle: 'Shopping Cart'
        });
      }

      if (item.productId.quantityAvailable < item.quantity) {
        return handleError(req, res, 400, {
          message: `Only ${item.productId.quantityAvailable} units of ${item.productId.name} available`,
          filePath: 'cart',
          pageTitle: 'Shopping Cart'
        });
      }
    }

    // Render checkout page
    // return res.render('checkout', {
    //   title: 'Checkout',
    //   cart,
    //   user: req.user,
    //   page: 'checkout'
    // });
     return handleSuccess(req, res, 400, {
          filePath: "payment/checkout",
          data: cart,
          pageTitle: `Checkout `
        }); 
  } catch (error) {
    console.error('Error loading checkout page:', error);
    return handleError(req, res, 500, {
      message: 'Failed to load checkout page',
      filePath: 'payment/checkout',
      pageTitle: 'Checkout'
    });
  }
};