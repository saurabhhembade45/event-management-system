# 🎟️ Eventopia - Event Management System

Eventopia is a full-stack Event Management System built using the MERN stack.

The main goal of Eventoflix is to provide a single platform where students can discover events, check event details, register for events, make online payments, and participate in college activities.

The system provides functionality for Students, Clubs, and Admins, along with AI-based event recommendations.

---

## 🚀 Features

- 👤 Student and Admin roles
- 🔐 User authentication using JWT
- 🏫 College club management
- 🎪 Event creation and management
- 📅 Upcoming event discovery
- 📝 Event registration
- 💳 Online payment using Razorpay
- 👥 Participant management
- 🤖 AI-based event recommendations using Gemini
- 🖼️ Event and club image storage using Cloudinary
- 📱 Responsive design

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Axios
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- REST APIs
- JWT
- bcrypt
- Express File Upload

### Database

- MongoDB
- Mongoose

### External Services

- Gemini
- Razorpay
- Cloudinary

---

## 🏗️ Project Architecture

```text
                    Eventoflix
                         |
        ┌────────────────┼────────────────┐
        |                |                |
     Student            Club            Admin
        |                |                |
        └────────────────┼────────────────┘
                         ↓
                    React + Vite
                         ↓
                    Axios / REST API
                         ↓
                  Node.js + Express
                         ↓
                  MongoDB + Mongoose
                         |
             ┌───────────┼───────────┐
             ↓           ↓           ↓
         Cloudinary   Razorpay    Gemini
        Image Storage  Payment   AI Recommendation
