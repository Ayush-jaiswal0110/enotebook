# 📘 Enotebook - MERN Stack Assignment Project

Enotebook is a task management and note-taking web app built using the **MERN stack (MongoDB, Express.js, React, Node.js)**. It supports role-based access (Admin & Users), real-time updates via **Socket.IO**, smart task assignment, and a visually interactive **Kanban Board**.

---

## 🚀 Live Demo

- **Frontend:** [https://enotebook-1bgq.onrender.com](https://enotebook-1bgq.onrender.com)
- **Backend API:** [https://enotebook-backend-przl.onrender.com](https://enotebook-backend-przl.onrender.com)

---

## 🧠 Features

| Feature                     | Description                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| 📝 Notes CRUD              | Create, edit, delete notes                                                  |
| 🧑‍🤝‍🧑 Role-based access     | Admin can view all notes, users see assigned ones                          |
| 📤 Assign tasks             | Admin can assign notes to users                                            |
| 🎯 Status tracking         | Notes can be moved between Todo, In Progress, Done                         |
| 🪄 Smart assignment         | Assign note to least busy user (based on task count)                       |
| ✅ Real-time sync           | Live updates via Socket.IO (no page refresh needed)                        |
| 📊 Kanban board            | Visual representation of note statuses with emojis                         |
| 📜 Activity Logs           | Admins can view who performed what action and when                         |
| 🔐 JWT Auth                | Login/signup with token-based authentication                               |

---

## 🛠️ Tech Stack

- **Frontend:** React, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Token)
- **Real-time:** Socket.IO
- **Deployment:** Render (Backend), Vercel (Frontend)

---

## 📁 Folder Structure

```
/enotebook
├── backend
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── .env
│   ├── index.js
│   └── db.js
├── frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.js
│   ├── .env
│   ├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

### 📦 Backend `.env`
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 💻 Frontend `.env`
```
REACT_APP_API_URL=https://enotebook-backend-przl.onrender.com
```

---

## 🔧 Installation (Local Setup)

```bash
# Clone the repo
git clone https://github.com/Ayush-jaiswal0110/enotebook

# Navigate to backend
cd backend
npm install
node index.js

# Open another terminal for frontend
cd ..
npm install
npm start
```


---

## 👨‍🏫 Assignment Requirements (Status)

| Requirement               | Status     |
|--------------------------|------------|
| User Auth (JWT)          | ✅ Completed |
| CRUD Operations          | ✅ Completed |
| Real-time Updates        | ✅ Completed |
| Smart Assignment         | ✅ Completed |
| Activity Log             | ✅ Completed |
| Admin-only Privileges    | ✅ Completed |
| Deployed Version         | ✅ Live      |

---

## 👨‍💻 Developed By

**Ayush Jaiswal**  
Integrated MCA – IIPS DAVV  
GitHub: [@Ayush-jaiswal0110](https://github.com/Ayush-jaiswal0110)