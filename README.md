🌿 BotanIQ – Full-Stack Plant Management Application
BotanIQ is a mobile application that helps users manage their personal plant collection, discover new plants, and receive watering reminders.

The app allows users to build a digital garden, track plant care, and explore a plant library with detailed information.

This project was built using React Native (Expo) for the frontend and Node.js + Express + MongoDB for the backend.

📱 App Screens
🌱 My Garden

Users can view all the plants in their personal garden and track watering reminders.

Features:

View all plants in your garden

Track watering reminders

Update last watering date

Remove plants from garden

Floating action button to add plants

📚 Plant Library

Users can browse and search plants from a plant database.

Features:

Search plants

Infinite scrolling

View plant images

Add plants directly to your garden

🔔 Smart Reminders

BotanIQ automatically generates watering reminders based on plant care schedules.

Features:

Upcoming watering reminders

Last watered tracking

Dynamic reminder updates

🏗 System Architecture
Mobile App (React Native / Expo)
        │
        ▼
 REST API (Express.js)
        │
        ▼
   MongoDB Database

The system follows a client–server architecture where the mobile app communicates with a REST API backend.

🧩 Backend Structure
backend
│
├── middleware
│   └── auth.js
│
├── models
│   ├── User.js
│   ├── Post.js
│   └── UserGarden.js
│
├── routes
│   ├── auth.js
│   ├── plants.js
│   ├── posts.js
│   ├── reminders.js
│   └── uploads.js
│
└── server.js
📱 Frontend Structure
frontend
│
├── app
│   ├── (tabs)
│   │   ├── homeScreen.jsx
│   │   ├── library.jsx
│   │   └── feed.jsx
│
├── components
│   ├── homeScreen
│   └── library
│
├── hooks
│   ├── usePlantsSearch.js
│   └── useReminders.js
│
└── services
    └── api.js
⚙️ Tech Stack
Frontend

React Native

Expo

Expo Router

React Hooks

Expo Image

React Native Safe Area Context

Backend

Node.js

Express

MongoDB

Mongoose

JWT Authentication

Multer (image uploads)

🔗 API Endpoints
Authentication
POST /auth/signup
POST /auth/login
GET  /auth/me
Plants
GET  /plants/search
GET  /plants/:id
POST /plants/:id/add-to-garden
POST /plants/:id/remove-from-garden
GET  /plants/my-garden
Reminders
GET  /reminders
POST /reminders/:plantId/watered
Posts
GET  /posts/feed
POST /posts
POST /posts/:id/like
🚀 Installation
Clone the repository
git clone https://github.com/YOUR_USERNAME/BotanIQ.git
cd BotanIQ
Backend
cd backend
npm install
npm start

Create .env file:

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
Frontend
cd frontend
npm install
npx expo start
🧠 Key Features Demonstrated

This project demonstrates:

Full-stack development

REST API design

JWT authentication

MongoDB schema modeling

Custom React hooks

Mobile UI development with React Native

Search and pagination

Image handling
