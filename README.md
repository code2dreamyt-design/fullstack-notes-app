
# Full-Stack Notes Application

A production-focused **full-stack notes application** built using **React, Node.js, Express, and MongoDB**.  
The project demonstrates secure authentication, protected APIs, and clean separation between frontend and backend using real-world engineering practices.

---

## 🚀 Features

- Secure user authentication using **JWT stored in HttpOnly cookies**
- Protected routes on both frontend and backend
- Create, read, update, and delete notes (CRUD)
- Centralized Axios API configuration
- Persistent authentication across page refresh
- Clean and modular project structure
- Proper loading and error handling

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- Axios
- React Router DOM
- React Hook Form
- Context API (Authentication state)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cookie-Parser
- CORS
- dotenv

### Tools & Deployment
- Git & GitHub
- Vercel (Frontend)
- Render / Railway (Backend)

---

## 🏗 Architecture Overview

```text
React Client
   |
   |  Axios (withCredentials: true)
   v
Express REST API
   |
   |  Controllers → Models
   v
MongoDB Database
