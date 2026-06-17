<div align="center">

# ⚡ MindSpark

### Full-Stack Interactive Trivia Platform · MERN Stack

[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Zustand](https://img.shields.io/badge/Zustand-State-db2777?style=flat-square)](https://github.com/pmndrs/zustand)

**MindSpark** is an interactive, full-stack quiz and learning platform built on the MERN stack. Features structured quiz creation tools, category filters, progress tracking, secure authentication, and global score logs.

*State Management via Zustand · Secure JWT Cookies · Live Scoreboards · Rate-Limited Endpoints*

</div>

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 📝 **Interactive Quiz Engine** | Dynamically serves multiple-choice questions with real-time timers and instant scoring. |
| 👤 **User Profiles & Scores** | Logs user history, tracks percentage scores, and displays dashboard stats. |
| 🛡️ **JWT Cookie Authentication** | Secure user registration and token authorization using HTTP-only cookies. |
| 🗄️ **Admin Control Panel** | Allows authenticated administrators to add, update, and manage quiz categories and questions. |
| 📈 **API Protection** | Implements route-level rate limiting and request validation middleware on the server. |

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| ⚛️ **Frontend UI** | React (Vite) & CSS modules |
| ⚙️ **State Store** | Zustand |
| 🟢 **Backend Server** | Express (Node.js) |
| 💾 **Database** | MongoDB Atlas via Mongoose ODM |
| 🔑 **Security** | JWT, BcryptJS, Cookie Parser, Rate-Limiter |

---

## ⚙️ Getting Started

### Prerequisites
* **Node.js** v18+
* **MongoDB** connection URI

### Installation & Run

#### 1. Setup Backend Server
```bash
cd server
npm install
# Configure your .env file (PORT, MONGO_URI, JWT_SECRET)
npm start
```
Backend runs at → **http://localhost:5000**

#### 2. Setup Frontend Client
```bash
cd ../client
npm install
npm run dev
```
Client runs at → **http://localhost:5173**

---

## 🏗️ Architecture

```mermaid
graph TD
  A[React Frontend] -->|Zustand Auth Store| B[Axios Interface]
  B -->|Secure Requests| C[Express Router Gateway]
  C -->|Validate JWT| D{Auth Middleware}
  D -->|Passes| E[Controllers: Quiz, Results, Auth]
  E -->|Mongoose Queries| F[(MongoDB Database)]
```

---

## 🧑‍💻 Author

**Partha Gayen**

[![GitHub](https://img.shields.io/badge/GitHub-ParthaG23-181717?style=flat-square&logo=github)](https://github.com/ParthaG23)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Partha_Gayen-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/partha-gayen)

---

## 📜 License

This project is licensed under the **MIT License**.
