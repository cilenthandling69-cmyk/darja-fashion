# Darja Fashion — MERN Ecommerce

A full-stack clothing ecommerce starter created with React + Vite, Express, MongoDB/Mongoose, JWT authentication, Framer Motion, and a protected developer dashboard.

## Included

- Animated luxury clothing storefront
- Customer registration and login
- Product listing, filtering, details, cart, and COD checkout
- MongoDB products, users, and orders
- Protected developer login
- Developer product add/edit/delete
- Developer order status management
- Seeded sample products
- Helmet, CORS, API rate limiting, validation, and password hashing

## Start locally

1. Make sure MongoDB is running locally, or replace MONGO_URI in backend/.env with your MongoDB Atlas URI.
2. Seed the developer and sample products:

   npm run seed

3. Start frontend and backend together:

   npm run dev

Frontend: http://localhost:5173
Backend API: http://localhost:5000/api

## Developer login

Email: developer@darjafashion.com
Password: Darja@b4072ae05b7b

Change DEV_EMAIL and DEV_PASSWORD in backend/.env before reseeding for a real deployment.

## Production notes

- Add Razorpay/Stripe server-side payment verification before accepting online payments.
- Replace URL-based product images with Cloudinary or S3 uploads.
- Use secure httpOnly cookie authentication or a hardened token strategy for production.
- Use a strong MongoDB Atlas user/password and restrict network access.
