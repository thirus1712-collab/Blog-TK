# Blog TK - Modern Full-Stack MERN Blogging Platform

A complete, high-performance, open blogging web application built with **React (Vite)**, **Node.js**, **Express.js**, and **MongoDB (Mongoose)**.

Blog TK enables any registered user to publish, edit, and delete their own technical articles and designs, upload automatically resized banner images, rate posts (1–5 stars), engage in discussions via comments, and explore posts through multi-attribute filters (keyword search, publication date, star rating, and personal articles toggle).

---

## 🚀 Features

- **Public Access & Independent Authorship**: Anyone can read and search articles. Registered authors maintain full ownership of their publications without central editorial gatekeeping.
- **Sharp-Powered Image Pipeline**: Automatically optimizes and compresses uploaded cover images to standard card thumbnails (`600x400`) and responsive detail views (max `1200px` width) in WebP format.
- **Community Ratings (1–5 Stars)**: Authenticated users can rate any article 1–5 stars. Ratings are dynamically aggregated into average scores and rating counts.
- **Interactive Comments Section**: Authenticated visitors can participate in discussions, with newest comments listed first.
- **Combined Search & Filtering**:
  - **Instant Keyword Search**: Case-insensitive title and content search bar in the sticky navbar.
  - **Publication Date Filter**: Pick any calendar date to view articles published on that specific day.
  - **Rating-Based Category Chips**: Filter by rounded ratings (5 Stars, 4 Stars, 3 Stars, 2 Stars, 1 Star).
  - **"Mine" Toggle Chip**: One-click filter for logged-in users to isolate their own posts directly on the feed.
- **Dedicated "My Posts" View**:
  - Direct access from navbar and user dropdown.
  - Total post count banner.
  - Direct **Edit** and **Delete** buttons on each card (with confirmation dialog).
- **User Profile Dashboard**: Displays registration information (name, occupation, email, member since date) and total published articles count.
- **Sticky Navbar & Mobile Navigation**:
  - Brand logo with gradient icon.
  - Global search bar with clear button.
  - Instant **Refresh / Reload button** that re-fetches posts without full page reloads.
  - User profile dropdown with caret icon.
  - Fully responsive mobile drawer.
- **Light Theme & Design Aesthetics**:
  - Curated palette: slate neutrals, soft off-white background (`#f8fafc`), and indigo accent gradients (`brand-600`).
  - Inter typography, soft box shadows, rounded cards, and smooth micro-interactions.
  - Shimmering skeleton loaders during network requests.
  - Real-time toast notifications for user actions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, React Router DOM 6, Axios, Tailwind CSS 3, Lucide React Icons |
| **Backend** | Node.js, Express.js 4, Mongoose 8 |
| **Database** | MongoDB (Local or Atlas) |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing |
| **Media Processing** | Multer (Memory Storage) + Sharp (WebP conversion & resizing) |

---

## 📁 Project Structure

```
Blog/
├── client/                     # Frontend React (Vite) Application
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx      # Sticky navbar with search, reload & user dropdown
│   │   │   ├── Footer.jsx      # Clean footer with site links
│   │   │   ├── PostCard.jsx    # Card with thumbnail, rating & author info
│   │   │   ├── FilterBar.jsx   # Rating chips, date picker & mine toggle
│   │   │   ├── RatingStars.jsx # Interactive 1-5 star rater and badge
│   │   │   ├── SkeletonCard.jsx# Shimmer loading skeleton
│   │   │   ├── ConfirmModal.jsx# Delete confirmation modal
│   │   │   └── Toast.jsx       # Real-time toast notifications
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state, JWT management, search & reload sync
│   │   ├── pages/
│   │   │   ├── HomePage.jsx    # Hero section, filter bar & responsive post feed
│   │   │   ├── PostDetailPage.jsx # Full article, author contacts, rater & comments
│   │   │   ├── CreatePostPage.jsx # Article creation with live image preview
│   │   │   ├── EditPostPage.jsx   # Article editor with pre-filled fields
│   │   │   ├── MyPostsPage.jsx # Author's own posts with direct edit/delete
│   │   │   ├── ProfilePage.jsx # Registration details & post statistics
│   │   │   ├── LoginPage.jsx   # User authentication login page
│   │   │   ├── RegisterPage.jsx# User registration with validation
│   │   │   └── AboutPage.jsx   # Mission, architectural pillars & team
│   │   ├── services/
│   │   │   └── api.js          # Axios client with JWT bearer interceptors
│   │   ├── utils/
│   │   │   └── dateUtils.js    # Formatted timestamps ("01 Oct 2026, 04:30 PM")
│   │   ├── App.jsx             # Route definitions and layout
│   │   ├── main.jsx            # Entrypoint with context providers
│   │   └── index.css           # Tailwind directives & custom styles
│   ├── index.html              # HTML shell with Google Inter font
│   ├── vite.config.js          # Vite config with /api & /uploads proxy
│   ├── tailwind.config.js      # Custom theme, colors & shadows
│   └── package.json
│
├── server/                     # Backend Node.js & Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Mongoose MongoDB connection handler
│   │   ├── controllers/
│   │   │   ├── authController.js    # Register, login, me endpoints
│   │   │   ├── postController.js    # CRUD, search, filters & rating logic
│   │   │   └── commentController.js # Comment listing & creation
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT verify (protect & optionalAuth)
│   │   │   ├── upload.js       # Multer memory storage + Sharp resizing
│   │   │   └── errorHandler.js # Centralized HTTP error formatter
│   │   ├── models/
│   │   │   ├── User.js         # User schema with bcrypt pre-save hook
│   │   │   ├── Post.js         # Post schema with ratings, contact info & indexes
│   │   │   └── Comment.js      # Comment schema with user & post relations
│   │   ├── scripts/
│   │   │   └── clearData.js    # Database cleanup script
│   │   └── server.js           # Express app setup, CORS, static uploads & listen
│   ├── uploads/                # Processed thumbnail & detail WebP images
│   ├── .env                    # Environment variables
│   └── package.json
│
├── package.json                # Root orchestration scripts
└── README.md
```

---

## ⚡ Prerequisites

Before running the application locally, make sure you have installed:
1. **Node.js**: v18.0.0 or later (v20+ or v24+ recommended)
2. **MongoDB**: Local MongoDB instance running on default port `27017` (e.g. `mongodb://127.0.0.1:27017/blog_tk`) or a MongoDB Atlas connection string.

---

## 🔧 Environment Configuration (.env)

The server utilizes an environment file at `server/.env`. A ready-to-use configuration has been created:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blog_tk
JWT_SECRET=super_secret_jwt_key_blog_tk_2026_modern
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 📦 Installation & Setup

You can install and run the app in two separate terminal windows (recommended for development):

### Terminal 1: Backend Server

```bash
cd server
npm install
npm run dev        # Starts the API on http://127.0.0.1:5000
```

> **Optional Database Reset**: To wipe all existing data and reset the database to a completely clean state at any time, run:
> ```bash
> npm run clear-data
> ```

### Terminal 2: Frontend Client

```bash
cd client
npm install
npm run dev        # Starts Vite dev server on http://localhost:5173
```

Visit **http://localhost:5173** in your browser.

---

## 🔑 Registration & Getting Started

The platform starts completely clean with zero mock or seed data. Real users create their own independent accounts:

1. Click **Register** in the navbar (or visit `http://localhost:5173/register`).
2. Provide your Name, Profession, Email, and Password.
3. Log in and begin creating articles, rating posts, and joining community discussions!

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user (Name, Profession, Email, Password, Confirm Password).
- `POST /api/auth/login` - Authenticate user & receive JWT token.
- `GET /api/auth/me` - Get current authenticated user profile and total published post count.

### Posts (`/api/posts`)
- `GET /api/posts` - Get all posts (supports `?search=keyword`, `?date=YYYY-MM-DD`, `?rating=1-5`, `?mine=true`).
- `GET /api/posts/mine` - **(Auth Required)** Get only the logged-in user's posts.
- `GET /api/posts/:id` - Get single post by ID with author details & visitor rating status.
- `POST /api/posts` - **(Auth Required + Image Upload)** Create a new post.
- `PUT /api/posts/:id` - **(Auth Required + Author Only)** Update post fields (image replacement is optional).
- `DELETE /api/posts/:id` - **(Auth Required + Author Only)** Delete post and cascade delete its comments.
- `POST /api/posts/:id/rate` - **(Auth Required)** Submit 1–5 star rating (updates user's existing rating or creates new).

### Comments (`/api/posts/:id/comments`)
- `GET /api/posts/:id/comments` - List comments for a post, sorted newest first.
- `POST /api/posts/:id/comments` - **(Auth Required)** Post a comment.

---

## 🛡️ Key Implementation Details

1. **Ownership Enforcement**: Both frontend and backend verify author identity (`post.author === req.user._id`). Only authors can access Edit and Delete endpoints.
2. **Sharp Image Optimization**: Images sent via `multipart/form-data` are processed in memory through Sharp:
   - Thumbnails: `600x400` cover fit WebP format.
   - Detail: Max `1200px` width WebP format preserving aspect ratio.
3. **Route Precedence**: `/api/posts/mine` is explicitly defined *before* `/api/posts/:id` to prevent Express from parsing `"mine"` as an ObjectId.
4. **Cascading Deletion**: Deleting a post automatically wipes all associated comments via `Comment.deleteMany({ post: post._id })`.
