# SmartBin Backend

Node.js + Express + MongoDB Atlas backend for the SmartBin application.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file from example:
```bash
cp .env.example .env
```

3. Update the `.env` file with your MongoDB connection string and JWT secret.

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user (requires auth)

### Profile
- `GET /api/profile` - Get user profile (requires auth)
- `PUT /api/profile` - Update user profile (requires auth)
- `PUT /api/profile/stats` - Update user stats (requires auth)
- `POST /api/profile/image` - Update profile image URL (requires auth)

### Orders
- `GET /api/orders` - Get all user orders (requires auth)
- `GET /api/orders/:id` - Get single order (requires auth)
- `POST /api/orders` - Create new order (requires auth)
- `PUT /api/orders/:id` - Update order status (requires auth)
- `DELETE /api/orders/:id` - Cancel order (requires auth)

### Waste Uploads
- `GET /api/waste-uploads` - Get all waste uploads (requires auth)
- `POST /api/waste-uploads` - Create waste upload (optional auth)
- `GET /api/waste-uploads/stats` - Get waste statistics (requires auth)

### Products
- `GET /api/products` - Get all products (optional auth)
- `GET /api/products/:id` - Get single product (optional auth)
- `POST /api/products/seed` - Seed products database

## Environment Variables

- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS

## Deployment

This backend can be deployed to:
- Render
- Railway
- Heroku
- DigitalOcean
- AWS EC2
- Any Node.js hosting platform

Make sure to set environment variables in your deployment platform.
