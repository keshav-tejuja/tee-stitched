# TeeStitch - Quick Reference Card

## 🚀 Start the App (2 Commands)

```bash
# Terminal 1: Backend
cd server && npm install && npm run dev

# Terminal 2: Frontend  
cd client && npm install && npm start
```

Then open: http://localhost:3000

---

## 📦 What's Included

| Feature | Status |
|---------|--------|
| User Registration & Login | ✅ Working |
| T-Shirt Customization | ✅ Working |
| Live Color Preview (SVG) | ✅ Working |
| Save Designs | ✅ Working |
| Shopping Cart | ✅ Working |
| Checkout (Demo) | ✅ Working |
| Order History | ✅ Working |
| Loyalty Points | ✅ Working |
| Admin Dashboard | ✅ Working |
| Order Management (filter/search/status) | ✅ Working |
| Inventory Management | ✅ Working |
| Analytics Charts | ✅ Working |
| **Database Needed?** | ❌ **NO** |

---

## 🎨 Customization Options

### 3 Products
- Premium Cotton (₹499)
- Polyester Blend (₹599)
- Cotton Blend (₹549)

### 9 Colors
Black, White, Red, Blue, Green, Yellow, Gray, Navy, Maroon

### 6 Sizes
XS, S, M, L, XL, XXL

### 3 Fits
Oversized, Slim, Regular

### 3 Fabrics
Cotton, Polyester, Cotton-Blend

---

## 🔐 Authentication

### Register
```
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass"
}
```

### Login
```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securepass"
}
```

Response includes JWT token (expires in 7 days)

---

## 📋 API Endpoints

### Products
```
GET  /api/products         - Get all products
GET  /api/products/:id     - Get single product
GET  /api/products/init    - Initialize products
```

### Authentication
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login user
```

### Designs
```
POST   /api/designs        - Save a design
GET    /api/designs        - Get user designs
GET    /api/designs/:id    - Get single design
DELETE /api/designs/:id    - Delete design
```

### Orders
```
POST   /api/orders               - Create order
GET    /api/orders               - Get user orders
GET    /api/orders/admin/all     - Get all orders (admin)
PATCH  /api/orders/:id/status    - Update order status
```

### Analytics (Admin)
```
GET /api/analytics/demand     - Demand data
GET /api/analytics/customers  - Customer insights
```

### Users
```
GET   /api/users/profile           - Get profile
PATCH /api/users/profile           - Update profile
GET   /api/users/loyalty-points    - Get loyalty points
GET   /api/users/admin/all         - Get all users (admin)
```

---

## 👤 Admin Setup

### Make Someone Admin
Edit `server/database.js` after a user registers:

```javascript
const user = db.users.findByEmail('email@example.com');
if (user) user.role = 'admin';
```

Then login and visit: http://localhost:3000/admin

---

## 💾 Data Storage

**All data is in-memory** (stored in `server/database.js`):
- Users: Registration data
- Designs: Saved t-shirts
- Orders: Purchase history
- Analytics: Demand data

**⚠️ Resets when server restarts**

---

## 🎯 Test Scenario

1. Register account
2. Customize t-shirt
3. Select color (watch SVG preview update)
4. Save design
5. Add to cart
6. Checkout (fill shipping address)
7. View dashboard
8. (If admin) View analytics

---

## 📁 Project Structure

```
ecomproj/
├── server/                    
│   ├── database.js           # In-memory data store
│   ├── controllers/          # Business logic
│   ├── routes/              # API routes
│   ├── middleware/          # Auth middleware
│   └── package.json
│
├── client/                   
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Components
│   │   ├── services/        # API calls
│   │   └── context/         # State management
│   └── package.json
│
├── SETUP.md                 # Quick start
├── MIGRATION.md             # What changed
└── README.md                # Full docs
```

---

## 🐛 Common Issues

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### npm install Fails
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

### App Won't Start
- Check node version: `node -v` (needs v14+)
- Check both servers are running
- Check ports 3000 and 5000 are free

---

## 📊 Dashboard URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Register | http://localhost:3000/register |
| Login | http://localhost:3000/login |
| Customize | http://localhost:3000/customize |
| Cart | http://localhost:3000/cart |
| Checkout | http://localhost:3000/checkout |
| Dashboard | http://localhost:3000/dashboard |
| Admin | http://localhost:3000/admin |

---

## 🎨 Color Preview System

Live preview uses **SVG rendering**:
- Real-time color changes
- No images downloaded
- Lightweight & responsive
- Works offline

---

## 💳 Payment Integration

**NOT implemented** (demo only)

To add payment:
1. Install Stripe/Razorpay SDK
2. Create payment controller
3. Update checkout page with payment form
4. No changes needed to product/design logic

---

## 🔄 Loyalty Points

**5% of order value earned as points**

Example:
- Order: ₹499 → Earn 24 points
- Order: ₹999 → Earn 49 points

Points displayed in dashboard and profile

---

## 📈 Analytics Charts

Admin dashboard includes:
- Total orders & revenue
- Demand by size (bar chart)
- Fabric preferences (pie chart)
- Fit preferences (bar chart)
- Color popularity (bar chart)
- Customer retention rate
- New customers this month

---

## 🔑 Environment Variables

```bash
# server/.env
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

That's it! No database URL needed.

---

## ⚡ Performance

- **API Response Time**: < 1ms (in-memory)
- **Page Load**: ~2-3 seconds
- **Customization Preview**: Instant

---

## 🎓 Learning Resources

- React: https://react.dev
- Express: https://expressjs.com
- JWT: https://jwt.io
- Recharts: https://recharts.org
- Tailwind: https://tailwindcss.com

---

## 📝 Notes

- All user data is JSON objects in memory
- Passwords are hashed with bcryptjs
- JWT tokens stored in localStorage
- CORS enabled for localhost
- Ready for production database swap

---

## 🆘 Need Help?

Check the documentation:
- **SETUP.md** - Quick start guide
- **README.md** - Full documentation
- **MIGRATION.md** - Technical details

---

**Happy coding! 🚀**
