import Order from "../../model/Order.js";
import OrderStatus from "../../model/OrderStatus.js";
import OrderItem from "../../model/OrderItem.js";
import mongoose from "mongoose";
import Cart from "../../model/Cart.js";

export const convertCartToOrder = async (userId) => {
    const cart = await Cart.findOne({ buyerId: userId }).populate({
            path:"items.productId",
            select:"name price sellerId "
          }).exec()
    const paidStatus = await OrderStatus.findOne({code: 2}).exec()
    const session = await mongoose.startSession();
      session.startTransaction();
    try {
        const orderItems = cart.items.map((productId, ...rest) => ({
            productId: productId._id.toString(),
            quantity: rest.quantity,
            price: productId.price,
            sellerId: productId.sellerId.toString(),
            statusId: paidStatus._id.toString()
        }));

        const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        const orderData = {
            buyerId: cart.buyerId,
            totalAmount,
            // statusId: some default status id for new orders
        };

        const order = new Order(orderData);
        await order.save({session});

        if(!order._id) {
            session.abortTransaction()
            // return handleError(req, res, 409, {
            //         message: "Email already exists",
            //         filePath: "auth/signup",
            //         pageTitle: "Sign Up",
            //         data: roles,
            //         formValues: req.body,
            //       });
        }

        const orderItemsWithOrderId = orderItems.map(item => ({ ...item, orderId: order._id.toString() }));
        await OrderItem.insertMany(orderItemsWithOrderId, {session});

        await session.commitTransaction();
        session.endSession();

        // clear cart after order creation
        cart.items = []
        cart.totalAmount = 0
        await cart.save()

        return order;
    } catch (error) {
        await session.abortTransaction()
        console.error("Error converting cart to order:", error);
        throw error;
    }
    }