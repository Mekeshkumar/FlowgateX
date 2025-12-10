# Quick Start Commands

## Install Backend Dependencies

```bash
cd backend
npm install
```

## Start Backend Server

```bash
cd backend
npm run dev
```

## Start Frontend

```bash
# In root folder
npm run dev
```

## Test API (Simple HTML)

Open `backend/test-api.html` in your browser

## MongoDB Commands

```bash
# Connect to MongoDB Shell
mongosh

# Switch to flowgatex database
use flowgatex

# View all users
db.users.find().pretty()

# Count users
db.users.countDocuments()

# Delete all users (careful!)
db.users.deleteMany({})

# Find user by email
db.users.findOne({ email: "john@example.com" })
```

## Test with curl

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@example.com\",\"password\":\"Test@1234\",\"phone\":\"+1234567890\",\"role\":\"user\"}"
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"Test@1234\"}"
```

### Get Current User (replace TOKEN with actual JWT)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
