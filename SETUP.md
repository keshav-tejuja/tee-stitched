# Quick Start Guide - TeeStitch

## ⚡ What Changed?

✅ **No MongoDB needed!**  
✅ **3 hardcoded product catalogs with SVG images**  
✅ **In-memory data storage (auto-resets on server restart)**  
✅ **All features work exactly the same**  

## 🚀 Get Started in 30 Seconds

### Terminal 1: Start Backend
```bash
cd server
npm install
npm run dev
```

### Terminal 2: Start Frontend
```bash
cd client
npm install
npm start
```

That's it! App opens at http://localhost:3000

## 📦 What's Included

### 3 Hardcoded Products
- Premium Cotton T-Shirt (₹499)
- Premium Polyester Blend (₹599)
- Classic Cotton Blend (₹549)

### Customization Options
- **Fabrics**: Cotton, Polyester, Cotton-Blend
- **Colors**: Black, White, Red, Blue, Green, Yellow, Gray, Navy, Maroon  
- **Sizes**: XS, S, M, L, XL, XXL
- **Fits**: Oversized, Slim, Regular

### Features
✅ User Registration & Login (JWT Auth)  
✅ T-Shirt Live Preview (SVG-based)  
✅ Save Designs  
✅ Shopping Cart  
✅ Order Checkout (Demo - No Payment)  
✅ Order History  
✅ Loyalty Points (5% of order value)  
✅ Admin Dashboard with Analytics  
✅ Order Management module (filter/search/status updates)  
✅ Basic Inventory Management (add/update stock/alerts)  
✅ Demand Analytics Charts  
✅ Customer Insights  

## 👤 Admin Access

### Step 1: Register an Account
Go to http://localhost:3000/register and create an account

### Step 2: Make Yourself Admin
Edit `server/database.js` and add this after line with `let users = [];`:

```javascript
// Promote a user to admin (add this after registration)
const adminUser = db.users.findByEmail('your-email@example.com');
if (adminUser) {
  adminUser.role = 'admin';
}
```

Or directly modify in the future to auto-set first user as admin:

In the register controller:
```javascript
// Make first user admin
if (db.users.findAll().length === 0) {
  user.role = 'admin';
}
```

### Step 3: Access Admin Dashboard
Login and visit http://localhost:3000/admin

## 💾 Data Storage Details

All data is stored **in-memory** in the `server/database.js` file:

- **Users**: Registration data, loyalty points
- **Orders**: Order history, status tracking  
- **Designs**: Saved t-shirt designs
- **Analytics**: Demand data, customer metrics

**Important**: Data resets when server restarts (perfect for demo/testing)

## 🎨 Product Images

All product images are **SVG-based** (vector format):
- Lightweight and scalable
- No external image files needed
- Color preview updates in real-time

## 🔧 Environment Setup

Create `.env` in server folder:
```
JWT_SECRET=super_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

## 🐛 Troubleshooting

### Port 3000 already in use?
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Port 5000 already in use?
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### npm install fails?
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

## 📊 Analytics & Management Features

Admin dashboard includes:
- Key metric cards (total orders, in production, inventory items, low stock alerts)
- Order Management table with search, filter, status updates, and details modal
- Inventory dashboard with material list, add material form, and stock controls
- Total orders and revenue
- Popular sizes (bar chart)
- Fabric preferences (pie chart)
- Fit preferences (bar chart)
- Color preference (pie chart)
- Monthly orders line chart
- Customer retention metrics
- Customer acquisition data

## 🎯 Test Scenario

1. **Register** → Create account at `/register`
2. **Customize** → Design t-shirt at `/customize`
3. **Preview** → See live SVG preview with color
4. **Save** → Save design for later
5. **Cart** → Add to cart
6. **Checkout** → Fill shipping address (no actual payment)
7. **Dashboard** → View orders and designs at `/dashboard`
8. **Analytics** → View charts at `/admin` (if admin)

## ✨ Features Preview

- **No database required** ✓
- **3 product catalogs** ✓
- **SVG-based images** ✓
- **Real-time color preview** ✓
- **Loyalty points system** ✓
- **Order tracking** ✓
- **Analytics dashboard** ✓
- **Mobile responsive** ✓

## 📝 Notes

- All data is session-based (in-memory)
- Perfect for demos and testing
- Easy to replace with a real database later
- JWT tokens expire in 7 days
- Password hashing with bcryptjs
- CORS enabled for localhost

---

**Ready to start?** Run the two commands above and enjoy! 🎉
