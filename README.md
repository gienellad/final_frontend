# 📂 HR Management System

Isang full-stack application para sa pag-manage ng HR operations gamit ang **Nuxt 3** at **Strapi v5**.

## 🚀 Features

* **Dashboard**: Overview ng total employees, attendance ngayong araw, at pending leaves.
* **Employee CRUD**: Pag-add, edit, at delete ng impormasyon ng empleyado.
* **Attendance Tracking**: Monitoring ng check-in/out logs na may "No Employee Linked" filter.
* **Leave Management**: Approve/Reject workflow para sa mga leave requests.

## 🛠️ Tech Stack

* **Frontend**: Nuxt 3, Vuetify 3
* **Backend**: Strapi v5
* **Database**: SQLite

## 🔧 Installation

1.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    npm run develop
    ```
2.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 📄 Key Routes (Nuxt)
* `/dashboard` - Main overview.
* `/employees` - Employee list at actions.
* `/employees/edit/[id]` - Dynamic editing page.
* `/attendance` - Logs at monitoring.
* `/leavelist` - Leave request management.