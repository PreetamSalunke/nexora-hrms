# Nexora HRMS — Employee Management System

A modern, responsive **Full Stack Human Resource Management System** built using React, Django REST Framework, and MySQL.

Developed as part of the **WeIntern Full Stack Development Internship — Week 2, Task 2**.

## Project Overview

Nexora HRMS helps organizations manage employee information through a centralized dashboard. The application supports employee CRUD operations, workforce analytics, department-wise reports, and CSV exports.

## Features

### Employee Management
- Add new employees
- View employee records
- Edit employee information
- Delete employees with confirmation
- Search, sort, and paginate employee records
- Validate employee information

### Dashboard
- Total employee count
- Active employees
- Department statistics
- Employees on leave
- Recent employee records

### Reports & Analytics
- Department-wise employee distribution
- Employment status donut chart
- Department-wise salary analysis
- Monthly hiring trend
- Scroll-triggered chart animations
- Employee reports table
- CSV export

### User Interface
- Responsive layouts
- Modern sidebar navigation
- Dashboard summary cards
- Interactive charts
- Loading and error states

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Charts | Recharts |
| HTTP Client | Axios |
| Icons | Lucide React |
| Backend | Python, Django, Django REST Framework |
| Database | MySQL |
| Version Control | Git, GitHub |

## Project Structure

```text
nexora-hrms/
├── backend/
│   ├── config/
│   ├── employees/
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── .gitignore
└── README.md
```

## Installation & Setup

### Prerequisites

- Python
- Node.js and npm
- MySQL Server
- Git

### 1. Clone Repository

```bash
git clone https://github.com/PreetamSalunke/nexora-hrms.git
cd nexora-hrms
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a MySQL database named `nexora_hrms`.

Create a `backend/.env` file with the environment variables required by `config/settings.py`, including the Django secret key and database credentials.

Example:

```env
DJANGO_SECRET_KEY=replace_with_your_own_secure_key
```

Never commit real credentials or secret keys.

Run migrations:

```bash
python manage.py migrate
```

Start Django:

```bash
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000/`.

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/
```

Start React:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173/`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees/` | List employees |
| POST | `/api/employees/` | Create employee |
| GET | `/api/employees/{id}/` | Retrieve employee |
| PATCH | `/api/employees/{id}/` | Update employee |
| DELETE | `/api/employees/{id}/` | Delete employee |

## Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Employee Management
![Employee Management](screenshots/employees.png)

### Reports & Analytics
![Reports & Analytics](screenshots/reports.png)

## Future Enhancements

- User authentication and authorization
- Role-based access control
- Protected application routes
- Additional HR management modules

## Developer

**Preetam Gorakhnath Salunke**

GitHub: [PreetamSalunke](https://github.com/PreetamSalunke)

## Project Status

Week 2 Task 2 — Employee Management CRUD, Dashboard, and Reports implemented.

Authentication and authorization are planned for the next development phase.