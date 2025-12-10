# MongoDB Authentication Setup Guide for FlowgateX

## 🚀 Quick Start

### Step 1: Install MongoDB

#### Option A: Local MongoDB Installation (Windows)

1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer with default settings
3. MongoDB will run as a Windows Service automatically
4. Test connection: Open Command Prompt and type `mongosh`

#### Option B: MongoDB Atlas (Cloud - Recommended for Production)

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (Free M0 tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)
6. Replace `<password>` with your actual password
7. Replace `<dbname>` with `flowgatex`

---

## 📦 Step 2: Install Backend Dependencies

```bash
# Navigate to backend folder
cd backend

# Install all dependencies
npm install
```

This will install:

- express (Web framework)
- mongoose (MongoDB ODM)
- bcryptjs (Password hashing)
- jsonwebtoken (JWT authentication)
- dotenv (Environment variables)
- cors (Cross-origin requests)
- express-validator (Input validation)
- helmet (Security headers)
- express-rate-limit (Rate limiting)
- morgan (HTTP logging)

---

## ⚙️ Step 3: Configure Environment Variables

### Backend (.env file)

Edit `backend/.env` file:

```env
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/flowgatex

# For MongoDB Atlas (Cloud):
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/flowgatex?retryWrites=true&w=majority

# JWT Secret (IMPORTANT: Change this to a random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (.env file)

Your frontend `.env` is already configured:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_AUTH_TOKEN_KEY=flowgatex_auth_token
```

---

## 🏃 Step 4: Start the Servers

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:

```
🚀 Server running on http://localhost:5000
MongoDB Connected: localhost
Database: flowgatex
```

### Terminal 2: Start Frontend (Vite)

```bash
# In the root folder
npm run dev
```

You should see:

```
VITE v7.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## 🧪 Step 5: Test the Authentication

### Method 1: Using the React App

1. Open http://localhost:5173
2. Navigate to Register page
3. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: Test@1234
   - Phone: +1234567890
4. Click "Create Account"
5. If successful, you'll be logged in automatically

### Method 2: Using Postman/Thunder Client

#### Register a User

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Test@1234",
  "phone": "+1234567890",
  "role": "user"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "..."
  }
}
```

#### Login

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Test@1234"
}
```

#### Get Current User (Protected Route)

```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📊 Step 6: Verify Database

### Using MongoDB Compass (GUI Tool)

1. Download: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. You should see `flowgatex` database
4. Inside, you'll find `users` collection with your registered users

### Using MongoDB Shell (CLI)

```bash
# Open MongoDB Shell
mongosh

# Switch to flowgatex database
use flowgatex

# View all users
db.users.find().pretty()

# Count users
db.users.countDocuments()
```

---

## 🔐 Password Requirements

The system enforces strong passwords:

- ✅ Minimum 8 characters
- ✅ At least 1 uppercase letter (A-Z)
- ✅ At least 1 lowercase letter (a-z)
- ✅ At least 1 number (0-9)

Examples:

- ✅ Valid: `Test@1234`, `MyPass123`, `SecureP@ss1`
- ❌ Invalid: `password` (no uppercase, no number)
- ❌ Invalid: `Password` (no number)
- ❌ Invalid: `Pass123` (less than 8 characters)

---

## 📡 API Endpoints Reference

### Public Routes (No Auth Required)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Protected Routes (Requires JWT Token)

- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/change-password` - Change password
- `PUT /api/auth/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID

### Admin Only Routes

- `GET /api/users` - Get all users (Admin only)

---

## 🛠️ Troubleshooting

### Problem: "MongoDB connection failed"

**Solution:**

- Verify MongoDB is running: `mongosh` (should connect)
- Check MONGODB_URI in backend/.env
- For Atlas: Verify IP whitelist (add 0.0.0.0/0 for development)

### Problem: "CORS Error"

**Solution:**

- Verify CLIENT_URL in backend/.env matches your frontend URL
- Default: `http://localhost:5173`

### Problem: "Token expired" or "Invalid token"

**Solution:**

- Clear localStorage in browser: `localStorage.clear()`
- Login again to get a new token

### Problem: "User already exists"

**Solution:**

- Email must be unique
- Use a different email or delete the existing user from MongoDB

### Problem: Port 5000 already in use

**Solution:**

- Change PORT in backend/.env to 5001 or another port
- Update VITE_API_BASE_URL in frontend .env accordingly

---

## 🔒 Security Best Practices

1. **Change JWT_SECRET**: Use a random 32+ character string in production
2. **Use HTTPS**: In production, use SSL/TLS certificates
3. **Environment Variables**: Never commit .env files to Git
4. **Rate Limiting**: Already configured (5 attempts per 15 minutes for auth)
5. **Password Hashing**: Already using bcrypt with salt rounds of 10
6. **Input Validation**: express-validator is configured for all inputs

---

## 📚 Project Structure

```
flowgatex/
├── backend/
│   ├── controllers/
│   │   └── authController.js      # Auth logic
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   └── validator.js           # Input validation rules
│   ├── models/
│   │   └── User.js                # User schema
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   └── userRoutes.js          # User endpoints
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── server.js                  # Express server
│
├── src/
│   ├── features/auth/
│   │   └── components/Auth.jsx    # Login/Register UI
│   ├── services/api/
│   │   ├── apiClient.js           # Axios instance
│   │   └── authService.js         # Auth API calls
│   └── context/
│       └── AuthContext.jsx        # Auth state management
│
└── .env                           # Frontend env variables
```

---

## 🎯 Next Steps

1. ✅ MongoDB setup complete
2. ✅ Backend API running
3. ✅ Frontend connected to backend
4. 🔜 Test registration and login
5. 🔜 Add email verification (optional)
6. 🔜 Add OAuth (Google, Facebook) (optional)
7. 🔜 Deploy to production (Vercel + MongoDB Atlas)

---

## 💡 Quick Commands Cheat Sheet

```bash
# Start backend in development mode
cd backend && npm run dev

# Start frontend
npm run dev

# Check MongoDB status
mongosh

# View all users in database
mongosh flowgatex --eval "db.users.find().pretty()"

# Clear all users (careful!)
mongosh flowgatex --eval "db.users.deleteMany({})"

# Install new backend package
cd backend && npm install package-name

# Build frontend for production
npm run build
```

---

## 📞 Support

If you encounter issues:

1. Check the console logs in both terminals
2. Verify .env files are configured correctly
3. Ensure MongoDB is running
4. Check if ports 5000 and 5173 are available

**Happy Coding! 🚀**
