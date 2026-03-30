# Project Setup Instructions

## Project Overview

TeeStitch - A Full-Stack E-Commerce Platform for Custom Stitched T-Shirts

**Tech Stack**: React 18 + Node.js/Express + MongoDB + JWT Authentication + Tailwind CSS + Recharts

## Installation Steps

### 1. Prerequisites

Ensure you have installed:
- Node.js v14+ with npm
- Visual Studio Code

**No MongoDB Required!** The app uses hardcoded product data and in-memory storage.

### 2. Backend Setup

#### Install Backend Dependencies

```bash
cd server
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `server` directory:

```
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

No database connection string needed!

#### Start Backend Development Server

```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3. Frontend Setup

#### Install Frontend Dependencies

```bash
cd client
npm install
```

#### Start Frontend Development Server

```bash
npm start
```

Frontend will open at: `http://localhost:3000`

## Running the Full Application

### Terminal 1: Backend Server
```bash
cd server
npm run dev
```

### Terminal 2: Frontend App
```bash
cd client
npm start
```

## Verification

1. **Backend Health Check**: `http://localhost:5000/api/health`
2. **Frontend App**: `http://localhost:3000`
3. **Product Catalog**: 3 hardcoded products with SVG images automatically available

## Default Features Available

- ✅ User Registration & Login (JWT)
- ✅ T-Shirt Customization with live preview
- ✅ Shopping Cart functionality
- ✅ Checkout with shipping address
- ✅ Order management
- ✅ Saved designs library
- ✅ Loyalty points tracking
- ✅ Admin analytics dashboard
- ✅ Demand analytics with charts
- ✅ Customer insights metrics
- ✅ Order tracking and status updates

## Admin Dashboard Access

1. Create a test user account via registration
2. Manually set admin role (edit `server/database.js` to set role to 'admin' in hardcoded data)
3. Login and navigate to `/admin` route to view analytics

## Testing the Application

### Test Flow

1. **Register**: Create a new account at `/register`
2. **Customize**: Design a t-shirt with custom options (3 hardcoded products available)
3. **Live Preview**: See SVG t-shirt with your selected color
4. **Save Design**: Save your design for later use
5. **Add to Cart**: Add customized shirt to cart
6. **Checkout**: Fill shipping details and place order (demo - no payment)
7. **Dashboard**: View order history and saved designs
8. **Admin**: Login as admin to view demand analytics and customer insights

## Troubleshooting

### Port Already in Use
- Backend: `netstat -ano | findstr :5000` then kill process
- Frontend: `netstat -ano | findstr :3000` then kill process

### Dependencies Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### Data Persistence
Note: All data is stored in-memory. Restarting the server will clear all user accounts, orders, and designs. This is by design for the demo version.

## API Endpoints Summary

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | /api/auth/register | No | - |
| POST | /api/auth/login | No | - |
| GET | /api/products | No | - |
| POST | /api/designs | Yes | User |
| GET | /api/designs | Yes | User |
| POST | /api/orders | Yes | User |
| GET | /api/orders | Yes | User |
| GET | /api/orders/admin/all | Yes | Admin |
| GET | /api/analytics/demand | Yes | Admin |
| GET | /api/analytics/customers | Yes | Admin |

## Project Structure

```
ecomproj/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components (Home, Customize, Cart, etc.)
│   │   ├── services/       # API service calls
│   │   ├── context/        # Auth & Cart context
│   │   ├── App.js
│   │   └── index.css
│   └── package.json
├── server/                 # Express Backend
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth middleware
│   ├── server.js
│   └── package.json
└── README.md
```

## Environment Variables

### Server (.env)
| Variable | Value | Notes |
|----------|-------|-------|
| MONGODB_URI | mongodb://localhost:27017/tshirt-shop | Change for production |
| JWT_SECRET | your_secret_key | Change in production |
| PORT | 5000 | Backend server port |
| NODE_ENV | development | development/production |

### Client (proxy in package.json)
- Proxy: `http://localhost:5000`

## Performance Notes

- Frontend uses React Context for state management (Auth, Cart)
- Backend uses MongoDB with Mongoose for schema validation
- JWT tokens expire after 7 days
- Analytics data is aggregated from orders in real-time

## Next Steps

1. Start development by modifying components in `client/src/components`
2. Add new API routes in `server/routes/`
3. Extend database models in `server/models/`
4. Customize Tailwind styles in `client/tailwind.config.js`

## Additional Resources

- React Documentation: https://react.dev
- Express Documentation: https://expressjs.com
- MongoDB Docs: https://docs.mongodb.com
- Tailwind CSS: https://tailwindcss.com
- Recharts: https://recharts.org

---

**Project Setup Complete!** You're ready to build and customize the application.
