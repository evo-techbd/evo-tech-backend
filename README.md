# Evo-Tech E-commerce Backend

Node.js/Express backend with MongoDB for Evo-Tech e-commerce platform.

## Features

- JWT Authentication with Refresh Tokens and Secure Cookie Management
- Role-based Access Control (Admin, Employee, Staff, User)
- Comprehensive Product Management:
  - Categories, subcategories, and brands with relationships
  - Color variations with individual stock tracking
  - Product features with headers and subsections
  - Product specifications
  - Product FAQs
  - Multiple product images
  - SEO meta tags
  - Pre-order functionality
- Shopping Cart and Wishlist with Persistence
- Advanced Order Management:
  - Status tracking and updates
  - Payment integration
  - Shipping calculations
  - Invoice generation
- Image Upload with Cloudinary and Local Storage Support
- Advanced Search and Filtering with Multiple Parameters
- Product Reviews and Ratings System:
  - Verified purchase badges
  - Rating distribution analytics
  - Review moderation
- Landing Page Content Management with Featured Sections
- User Profile and Address Management
- Inventory Management with Stock Alerts

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Upload**: Multer + Cloudinary
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 20+ installed
- MongoDB installed locally or MongoDB Atlas account
- Cloudinary account for image uploads

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```bash
cp .env.example .env
```

3. Update `.env` with your configuration

4. Start development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Products

- `GET /api/v1/products` - Get all products (with filters)
- `GET /api/v1/products/:id` - Get product by ID
- `GET /api/v1/products/slug/:slug` - Get product by slug
- `POST /api/v1/products` - Create product (Admin)
- `PUT /api/v1/products/:id` - Update product (Admin)
- `DELETE /api/v1/products/:id` - Delete product (Admin)

### Categories

- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category (Admin)
- `PUT /api/v1/categories/:id` - Update category (Admin)
- `DELETE /api/v1/categories/:id` - Delete category (Admin)

### Cart

- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart` - Add to cart
- `PUT /api/v1/cart/:id` - Update cart item
- `DELETE /api/v1/cart/:id` - Remove from cart

### Orders

- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/:id` - Get order details
- `POST /api/v1/orders` - Place order
- `PUT /api/v1/orders/:id/status` - Update order status (Admin)

## Project Structure

```
src/
├── app/
│   ├── config/          # Configuration files
│   ├── interfaces/      # TypeScript interfaces
│   ├── middlewares/     # Express middlewares
│   ├── modules/         # Feature modules
│   │   ├── auth/
│   │   ├── user/
│   │   ├── product/
│   │   ├── category/
│   │   ├── brand/
│   │   ├── cart/
│   │   ├── wishlist/
│   │   ├── order/
│   │   └── review/
│   ├── routes/          # Route definitions
│   ├── utils/           # Utility functions
│   └── errors/          # Error handlers
├── app.ts              # Express app setup
└── server.ts           # Server entry point
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

ISC
