# SocialSpark – Mini Social Post Application

A full-stack social feed app built with React.js, Node.js + Express, and MongoDB.

---

## 📁 Project Structure

```
social-app/
├── backend/          # Node.js + Express API
│   ├── models/       # Mongoose schemas (User, Post)
│   ├── routes/       # auth.js, posts.js
│   ├── middleware/   # auth.js (JWT protect)
│   ├── uploads/      # Uploaded images (auto-created)
│   ├── server.js
│   └── .env.example
└── frontend/         # React.js app
    ├── public/
    └── src/
        ├── api/          # Axios instance
        ├── components/   # Navbar, CreatePost, PostCard, PrivateRoute
        ├── context/      # AuthContext
        ├── pages/        # LoginPage, SignupPage, FeedPage
        ├── App.js
        ├── index.js
        └── theme.js
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongod`) **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

---

### 1. Clone / extract the project

```bash
cd social-app
```

---

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/social_app
JWT_SECRET=replace_this_with_a_long_random_string
```

> **Using MongoDB Atlas?** Replace `MONGO_URI` with your Atlas connection string.

Start the backend:

```bash
npm run dev      # with auto-reload (nodemon)
# or
npm start        # production
```

✅ You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

---

### 3. Set up the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
```

(Optional) Create a `.env` file in `frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

The app opens at **http://localhost:3000**

---

## 🔑 Features

| Feature | Description |
|---|---|
| **Sign Up / Login** | Email + password auth with JWT |
| **Create Post** | Text, image (up to 5MB), or both |
| **Public Feed** | All posts, newest first, with pagination |
| **Like / Unlike** | Toggle like; instant count update |
| **Comments** | Add comments; stored with username |
| **Delete Post** | Only the post owner can delete |
| **Responsive** | Works on mobile and desktop |

---

## 🗄️ MongoDB Collections

Only **two collections** are used:

### `users`
```json
{
  "_id": "ObjectId",
  "username": "string (unique)",
  "email": "string (unique)",
  "password": "hashed string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### `posts`
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "username": "string",
  "text": "string",
  "image": "string (file path)",
  "likes": [{ "userId": "ObjectId", "username": "string" }],
  "comments": [{ "userId": "ObjectId", "username": "string", "text": "string", "createdAt": "Date" }],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js 18, React Router v6 |
| UI Library | Material UI (MUI) v5 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer (local disk storage) |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Register user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Posts
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/posts?page=1&limit=10` | Get all posts | ❌ |
| POST | `/api/posts` | Create post (multipart/form-data) | ✅ |
| PUT | `/api/posts/:id/like` | Toggle like | ✅ |
| POST | `/api/posts/:id/comment` | Add comment | ✅ |
| DELETE | `/api/posts/:id` | Delete post (owner only) | ✅ |

---

## 🚀 Deployment Tips

### Backend (Render / Railway / Fly.io)
- Set env vars: `MONGO_URI`, `JWT_SECRET`, `PORT`
- Build command: `npm install`
- Start command: `node server.js`
- Add `CLIENT_URL` env var pointing to your frontend URL

### Frontend (Vercel / Netlify)
- Set `REACT_APP_API_URL=https://your-backend-url/api`
- Build command: `npm run build`
- Output directory: `build`

---

## 🧑‍💻 Author
Built for the 3W Full Stack Internship Assignment — Task 1
