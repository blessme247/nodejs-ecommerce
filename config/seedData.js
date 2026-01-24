import OrderStatus from "../model/OrderStatus.js"
import Role from "../model/Role.js"

const statuses = [
 { name: "Pending", code: 1, description: "Customer has placed order" },
 { name: "Processing", code: 2, description: "Vendor is preparing items" },
 { name: "Shipped", code: 3, description: "Package is with courier" },
 { name: "Delivered", code: 4, description: "Order complete" },
 { name: "Cancelled", code: 5, description: "Order has been cancelled" }
];

export const roles = [
 { name: "Seller" },
 { name: "Buyer" },
 { name: "Admin" }
];

export const seedStatuses = async ()=> {
    const count = OrderStatus.countDocuments()
    if (count === 0) {
        await OrderStatus.insertMany(statuses)
        console.log("order status initialized")
    } 
}

export const seedRoles = async () => {
const count = Role.countDocuments()
    if (count === 0) {
        await Role.insertMany(roles)
        console.log("roles initialized")
    } 
}

