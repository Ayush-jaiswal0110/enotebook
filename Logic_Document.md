# 🧠 Logic Document

This document explains the logic implemented for two core features in the Enotebook MERN assignment project:

## 🔀 1. Smart Assign Logic

### 📌 Objective:
To ensure that when a task is created without manually selecting a user, the system automatically assigns it to the **least busy user** (i.e., the one with the fewest assigned tasks).

### 🧩 Logic Flow:
1. When a new note is created, if the `assignedTo` field is **not provided**, the backend triggers the **smart assignment**.
2. The system:
   - Fetches all users from the database.
   - For each user, counts how many notes are currently assigned to them.
   - Selects the user with the **lowest count**.
3. The new note is automatically assigned to this least-loaded user.

### ✅ Example:
- Assume 3 users: A, B, and C.
- A has 2 tasks, B has 3, and C has 1.
- A new task is created **without assigning anyone**.
- The backend checks task counts and assigns the task to **User C** automatically.

### 🔐 Admin Privilege:
Admins can override this by manually selecting the user during note creation.

---

## ⚔️ 2. Conflict Handling Logic

### 📌 Objective:
Ensure only authorized users (admins or note creators) can **update or delete** notes to prevent unauthorized changes.

### ⚙️ Logic:
1. When a user attempts to **edit** or **delete** a note:
   - The backend checks if the requesting user is either:
     - The **original creator** of the note, OR
     - An **admin** (`isAdmin: true`).
2. If neither, the action is **rejected** with a `401 Not Allowed` response.

### 🔄 Real-Time Conflict Prevention:
- When a note is updated:
  - A Socket.IO event `note_updated` is emitted to all connected clients.
  - Other users' Kanban boards refresh in real-time to reflect the latest status.
  - This **prevents two users from editing stale data simultaneously**.

### ✅ Example:
- User A and User B are viewing the same task.
- User A marks it as "Done".
- Before User B can act, their board receives a **real-time update**.
- Now, User B sees the updated state, avoiding conflicting edits.

---

## 🧾 Summary

| Feature           | Benefit                                         |
|------------------|--------------------------------------------------|
| Smart Assignment | Distributes workload fairly                      |
| Conflict Handling| Prevents unauthorized actions and stale updates |

Both features together improve usability, fairness, and security across the application.

