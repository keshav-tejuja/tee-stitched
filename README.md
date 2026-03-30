# TeeStitch - Custom Stitched T-Shirt E-Commerce Platform

A full-stack modern web-based e-commerce application for a custom stitched T-shirt company with demand-driven supply chain and strong CRM implementation. **No database required - uses hardcoded data with images!**

## Tech Stack

- **Frontend**: React 18, React Router DOM, Axios, Tailwind CSS, Recharts (Charts)
- **Backend**: Node.js, Express.js (No Database Required!)
- **Authentication**: JWT-based login and registration
- **Data Storage**: In-memory with hardcoded product catalog

## Project Structure

```
ecomproj/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React Context (Auth, Cart)
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css       # Tailwind styles
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                 # Express Backend
│   ├── models/             # Database schemas
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth middleware
│   ├── server.js
│   ├── package.json
│   └── .env                # Environment variables
│
└── README.md
```

## Features

### Frontend Features

- **Home Page**: Brand introduction with CTA for customization
- **User Authentication**: Registration and login with JWT
- **T-Shirt Customization Page**:
  - Select fabric (cotton, polyester, cotton-blend)
  - Choose color from palette
  - Select size (XS, S, M, L, XL, XXL)
  - Choose fit (oversized, slim, regular)
  - Live preview of the customized t-shirt
  - Save designs for later use
- **Shopping Cart**: Add items, view summary
- **Checkout**: Shipping address input, order summary (Payment disabled for demo)
- **User Dashboard**:
  - View order history with status tracking (progress bar)
  - Saved custom designs library
  - Loyalty points display (5% of order value)
- **Admin Dashboard**:
  - Professional order management module:
    - Table with status workflow, search & filters
    - Modal for order details, dropdown status updates
  - Basic inventory management (materials, stock, low-stock alerts)
  - Demand analytics with charts:
    - Popular sizes (bar chart)
    - Fabric preferences (pie chart)
    - Fit preferences (bar chart)
    - Top colors (bar chart)
    - Monthly orders line chart
  - Key metric cards (total orders, in production, inventory items, low stock alerts)
  - Customer insights:
    - Customer acquisition data
    - Retention metrics
    - New customers this month
  - Recent orders table

### Backend Features

- **User Authentication APIs**:
  - Register: `POST /api/auth/register`
  - Login: `POST /api/auth/login`

- **Product APIs**:
  - Initialize product: `GET /api/products/init`
  - Get products: `GET /api/products`
  - Get product by ID: `GET /api/products/:id`

- **Design APIs**:
  - Save design: `POST /api/designs`
  - Get user designs: `GET /api/designs`
  - Get design: `GET /api/designs/:id`
  - Delete design: `DELETE /api/designs/:id`

- **Order APIs**:
  - Create order: `POST /api/orders`
  - Get user orders: `GET /api/orders`
  - Get all orders (admin): `GET /api/orders/admin/all`
  - Update order status (admin): `PATCH /api/orders/:id/status`

- **Analytics APIs**:
  - Get demand analytics (admin): `GET /api/analytics/demand`
  - Get customer insights (admin): `GET /api/analytics/customers`

- **User APIs**:
  - Get profile: `GET /api/users/profile`
  - Update profile: `PATCH /api/users/profile`
  - Get loyalty points: `GET /api/users/loyalty-points`
  - Get all users (admin): `GET /api/users/admin/all`

## Installation & Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn

**No MongoDB required! Uses hardcoded product data with images.**

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with variables:
   ```
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   PORT=5000
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will open at `http://localhost:3000`

## Running the Application

1. **Start Backend** (Terminal 1):
   ```bash
   cd server && npm run dev
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd client && npm start
   ```

3. **Access the Application**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api`

## Default Test Credentials

You can create test accounts using the registration page, or test with these sample credentials after registration:

- Email: test@example.com
- Password: test123

## Admin Access

To access the admin dashboard:
1. Register an account at `/register`
2. Update the user's role to 'admin' in `server/database.js` (modify the users array)
3. Navigate to `/admin` route
4. View analytics and manage orders

## Data Storage

**No database needed!** This application uses in-memory data storage with hardcoded product catalogs.

### Hardcoded Products (In Memory)
- Premium Cotton T-Shirt (₹499)
- Premium Polyester Blend (₹599)
- Classic Cotton Blend (₹549)

### Data Structure

**User**
- _id (timestamp), name, email, password (hashed), loyaltyPoints, role, createdAt, updatedAt

**Product** 
- _id, name, basePrice, image (SVG), description, fabrics, colors, sizes, fits, rating, reviews

**Design**
- _id (timestamp), userId, name, fabric, color, size, fit, designData, isSaved, createdAt, updatedAt

**Order**
- _id (timestamp), orderId, userId, designId, quantity, totalPrice, fabric, color, size, fit, status, shippingAddress, createdAt, updatedAt

**Analytics**
- _id (timestamp), date, totalOrders, totalRevenue, itemsSold, popularSizes, popularColors, popularFabrics, popularFits, averageOrderValue

### Order
- orderId (unique), userId, designId, quantity, totalPrice, fabric, color, size, fit, status, shippingAddress, timestamps

### Analytics
- date, totalOrders, totalRevenue, itemsSold, popularSizes, popularColors, popularFabrics, popularFits, newCustomers, returningCustomers, averageOrderValue

## Key Business Logic

### CRM Features
- **Loyalty Points System**: 5% of each order value is awarded as loyalty points
- **Saved Designs**: Customers can save custom designs for future reorders
- **Order Tracking**: Real-time order status updates
- **Customer Segmentation**: New vs. returning customers tracked in analytics

### Demand-Driven Supply Chain
- **Real-time Analytics**: Track popular sizes, colors, fabrics, and fits
- **Demand Insights**: Identify trending products and customer preferences
- **Customer Retention Metrics**: Monitor retention rate and customer lifetime value

## API Examples

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create an Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "designId": "design_id",
    "quantity": 1,
    "fabric": "cotton",
    "color": "black",
    "size": "M",
    "fit": "regular",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001",
      "country": "India"
    }
  }'
```

## Notes

- **Payment Gateway**: Intentionally disabled for this demo. In production, integrate Stripe, Razorpay, or similar
- **Authentication**: Uses JWT with 7-day expiration
- **Admin Role**: Must be set manually in the database
- **CORS**: Enabled for localhost requests

## Future Enhancements

- Email notifications for order updates
- Payment gateway integration
- Real-time notifications
- Customer reviews and ratings
- Bulk order discounts
- Inventory management
- Printing/design templates

## License

MIT License - Free to use and modify

## Support

For issues or questions, please create an issue in the repository.
