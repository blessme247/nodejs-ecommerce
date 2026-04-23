# 🛒 EvoMart

A full-stack e-commerce platform with user authentication, shopping cart, payment processing, and seller management.

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-brightgreen)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)

## Features

- 🛍️ Product browsing with search and filters
- 🛒 Shopping cart (guest & authenticated users)
- 💳 Paystack payment integration
- 👤 Session authentication with role-based access
- 📦 Order management
- 🖼️ Cloudinary image upload
- 🔒 CSRF protection & secure sessions

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose  
**Frontend:** EJS, CSS, Vanilla JavaScript  
**Security:** JWT, bcrypt, csrf-sync, Helmet  
**Payments:** Paystack  
**Storage:** Cloudinary

## Quick Start

```bash
# Clone repository
git clone https://github.com/blessme247/nodejs-ecommerce.git
cd nodejs-ecommerce

# Install dependencies
npm install

# Configure environment variables (see .env.example)
cp .env.example .env


# Start server
npm run dev
```

Visit `http://localhost:3500`



## Project Structure

```
├── controllers/      # Business logic
├── models/          # Mongoose schemas
├── routes/          # API routes
├── middleware/      # Auth, CSRF, etc.
├── views/           # EJS templates
├── public/          # Static files
└── config/          # Configuration files
```

## Key API Endpoints

```
POST   /api/auth/register      # User registration
POST   /api/auth/login         # User login
GET    /api/products           # Get products
POST   /api/cart/add           # Add to cart
POST   /api/payment/verify     # Verify payment
```

## Security Features

- Session authentication with httpOnly cookies
- CSRF protection on all state-changing operations
- Password hashing with bcrypt
- Role-based access control (Buyer/Seller)
- MongoDB session store with TTL
- Helmet.js security headers

## License

MIT

