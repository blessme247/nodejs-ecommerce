import User from "../model/User.js";
import { convertCartToOrder } from "../services/order/convertCartToOrder.js";
import { handleError } from "../utils/handleError.js";

export const initiatePayment = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || typeof amount !== "number") {
      // return res.status(400).json({ message: "Amount is required and must be a number" });
      return handleError(req, res, 400, {
        message: "Amount is required and must be a number",
        filePath: "auth/signin",
        formValues: {},
      });
    }
    const userId = req.userId;
    const user = await User.findById(userId).exec();
    if (!user) {
      return handleError(req, res, 401, {
        message: "User not found",
        filePath: "auth/signin",
        formValues: {},
      });
    }

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        body: JSON.stringify({
          email: user.email,
          amount: amount * 100,
          callback_url: "http://localhost:3500/callback"
        }),
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    if (response.ok) {
      const responseData = await response.json();
      // paystack returns authorization_url and transaction reference here
      //           {
      //   "status": true,
      //   "message": "Authorization URL created",
      //   "data": {
      //     "authorization_url": "https://checkout.paystack.com/nkdks46nymizns7",
      //     "access_code": "nkdks46nymizns7",
      //     "reference": "nms6uvr1pl"
      //   }
      // }
      res.redirect(responseData.data.authorization_url);
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyPayment = async (req, res) => {
    try {
        const { reference } = req.query;
        if (!reference) {
          return res.status(400).json({ message: "Reference is required" });
        }
        const response = await fetch(
          `https://api.paystack.co/transaction/verify/${reference}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
          },
        );
        if (response.ok) {
          const responseData = await response.json();
          // console.log(responseData, 'payment verification response')
          if (responseData.data.status === "success") {
            // payment successful, create order and clear cart
            // console.log("Payment successful");
            await convertCartToOrder()
            return res.redirect("/buyer/orders");
          } else {
            // payment failed
            // console.log("Payment failed");
            return res.redirect("/cart");
          }
        } else {
          return res.status(500).json({ message: "Payment verification failed" });
        }
    } catch (error) {
        console.log(error, "error")
    }
}
