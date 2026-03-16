# MeshTalk 💬

MeshTalk is a **real-time microservices-based chat application** that enables users to communicate through text and images with OTP-based authentication.
The system is built using **Node.js, Next.js, MongoDB, Redis, RabbitMQ, and Socket.IO**, following a **scalable microservices architecture**.

---

# Features 🚀

* OTP-based authentication
* Real-time messaging
* Image sharing via Cloudinary
* Unseen message tracking
* Chat creation between users
* Redis-based OTP storage
* RabbitMQ-based email queue system
* Secure JWT authentication
* Microservices architecture
* Modern responsive UI with TailwindCSS

---

# Tech Stack 🛠

### Frontend

* Next.js
* React
* TypeScript
* TailwindCSS
* Axios

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* MongoDB Atlas
* Mongoose

### Messaging & Queues

* RabbitMQ

### Cache

* Redis

### File Storage

* Cloudinary

### DevOps

* Docker

---

# Architecture 🏗

MeshTalk follows a **microservices architecture** with separate services for user management and chat handling.

```
Frontend (Next.js)
        |
        |
 API Gateway
        |
 -----------------------------
 |                           |
User Service            Chat Service
(Node.js)               (Node.js)
 |                           |
MongoDB                 MongoDB
 |
Redis (OTP storage)
 |
RabbitMQ (Email Queue)
 |
Email Worker
```

---

# Microservices

## User Service

Responsible for authentication and user management.

Features:

* OTP login
* JWT authentication
* User profile
* OTP rate limiting using Redis

Endpoints:

```
POST /api/v1/login
POST /api/v1/verify
GET /api/v1/profile
PATCH /api/v1/update-name
GET /api/v1/user/:id
GET /api/v1/users
```

---

## Chat Service

Handles chat management and messaging.

Features:

* Create chat
* Send text or image message
* Retrieve chat list
* Mark messages as seen

Endpoints:

```
POST /api/v1/chat
POST /api/v1/message
GET /api/v1/chats
GET /api/v1/messages/:chatId
```

---

# Installation ⚙️

### 1️⃣ Clone the repository

```bash
git clone https://github.com/KashishAgrahari23/Mesh_Talk
cd meshtalk
```

---

### 2️⃣ Install dependencies

Frontend

```bash
cd frontend
npm install
```

User Service

```bash
cd server/user
npm install
```

Chat Service

```bash
cd server/chat
npm install
```

---

### 3️⃣ Environment Variables

Create `.env` files.

### User Service

```
PORT=8080
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
REDIS_URL=your_redis_url
RABBITMQ_URL=your_rabbitmq_url

CLOUD_NAME=your_cloudinary
API_KEY=your_api_key
API_SECRET=your_secret
```

---

### Chat Service

```
PORT=8000
MONGO_URI=your_mongodb_uri
USER_SERVICE=http://localhost:8080
CLOUD_NAME=your_cloudinary
API_KEY=your_api_key
API_SECRET=your_secret
```

---

### Frontend

```
NEXT_PUBLIC_USER_SERVICE=http://localhost:8080
NEXT_PUBLIC_CHAT_SERVICE=http://localhost:8000
```

---

# Running the Application ▶️

Start Redis and RabbitMQ using Docker.

```
docker run -d -p 6379:6379 redis
```

```
docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

Start backend services.

User service:

```
npm run dev
```

Chat service:

```
npm run dev
```

Start frontend.

```
npm run dev
```

---


# Future Improvements 🌟

* Group chats
* Typing indicators
* Message reactions
* Push notifications
* File sharing
* Message deletion

---

# Author 👨‍💻

**Kashish Agrahari**



