
# 📝 Django + React Todo App with PostgreSQL

A full-stack task management application built with Django REST Framework, PostgreSQL, and a modern React + TypeScript frontend.

## 🚀 Features

- ✅ User authentication (Register/Login/Logout)
- 📝 Create, read, update, and delete tasks
- 🔍 Search and filter tasks
- 🏷️ Priority levels (Low/Medium/High)
- 📅 Due date tracking
- ✅ Mark tasks as complete
- 🔒 Secure API endpoints
- 📱 Responsive design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Query
- React Hook Form + Zod
- Shadcn/ui components

### Backend
- Django 4.2
- Django REST Framework
- PostgreSQL
- Simple JWT for authentication
- Django CORS Headers

---

## ⚙️ Prerequisites

- Node.js (v18+)
- Python (3.10+)
- PostgreSQL (14+)
- Yarn or npm

---

## 📦 Installation

### 🔧 Backend Setup

1. **Clone the repository:**

```bash
git clone https://github.com/devil3515/todo-app.git
cd todo-backend
```

2. **Create and activate virtual environment:**

```bash
python -m venv venv
source venv/bin/activate      # Linux/Mac
venv\Scripts\activate         # Windows
```

3. **Install dependencies:**

```bash
pip install -r requirements.txt
```


4. **Run migrations & create superuser:**

```bash
python manage.py migrate
python manage.py createsuperuser
```

5. **Start the backend server:**

```bash
uvicorn todo_backend.asgi:application --host 0.0.0.0 --port 8000
```

---

### 🎨 Frontend Setup

1. **Navigate to frontend:**

```bash
cd todo_frontend
```

2. **Install dependencies:**

```bash
npm install  
```


3. **Start development server:**

```bash
npm run dev 
```

---

## 🗂 Project Structure

```
todo-app/
├── todo_backend/               # Django project
│   ├── accounts/          # Authentication app
│   ├── tasks/             # Task management app
│   ├── manage.py
│   └── requirements.txt
├── todo_frontend/              # React app
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   ├── services/      # API interactions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## 🔗 API Endpoints

| Endpoint                  | Method | Description         |
|--------------------------|--------|---------------------|
| `/api/auth/register/`    | POST   | Register user       |
| `/api/auth/login/`       | POST   | Login user          |
| `/api/auth/logout/`      | POST   | Logout user         |
| `/api/tasks/`            | GET    | List tasks          |
| `/api/tasks/`            | POST   | Create new task     |
| `/api/tasks/{id}/`       | GET    | Task details        |
| `/api/tasks/{id}/`       | PATCH  | Update task         |
| `/api/tasks/{id}/`       | DELETE | Delete task         |

---


## 🧪 Environment Variables

Check `.env.example` in both `backend/` and `frontend/` for required keys and tokens.

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch: `git checkout -b feature/AmazingFeature`  
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`  
4. Push to the branch: `git push origin feature/AmazingFeature`  
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📸 Screenshots

<!-- Replace with actual screenshots -->
- **Login Screen**
![App Screenshot](https://github.com/devil3515/todo-app/blob/main/Screenshots/loginScreen.png)
- **Task List**
![App Screenshot](https://github.com/devil3515/todo-app/blob/main/Screenshots/taskList.png)

