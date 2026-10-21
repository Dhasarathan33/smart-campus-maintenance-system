# 🏫 Smart Campus Maintenance System

A web-based campus maintenance management system designed to simplify the process of reporting, assigning, tracking, and resolving maintenance complaints within a college campus.

The system connects Students, Technicians, and Administrators through a centralized platform, making complaint management faster, more organized, and transparent.

## 📌 Project Overview

The Smart Campus Maintenance System allows students to report maintenance issues such as electrical problems, plumbing issues, infrastructure damage, and other campus-related problems.

Administrators can manage complaints, assign technicians, monitor progress, and verify completed work.

Technicians can view their assigned complaints, update complaint status, and mark maintenance work as completed.

## 👥 User Roles

### 👨‍🎓 Student

Students can:

- Register and log in
- Submit maintenance complaints
- Upload complaint images
- View submitted complaints
- Track complaint status
- View notifications
- Manage profile information

### 🧑‍🔧 Technician

Technicians can:

- Log in securely
- View assigned complaints
- View complaint details
- Update complaint status
- Mark complaints as completed
- Add completion information
- View relevant notifications
- Manage profile information

### 👨‍💼 Administrator

Administrators can:

- Log in securely
- View all complaints
- View complaint details
- Assign technicians
- Reassign technicians
- Approve completed complaints
- Reject completed complaints
- Manage departments
- Manage academic departments
- Manage users and technicians
- View reports and dashboard information
- Manage notifications

## ✨ Key Features

- 🔐 Secure authentication
- 👥 Role-based access
- 📝 Complaint management
- 📷 Complaint image uploads
- 🧑‍🔧 Technician assignment
- 🔄 Technician reassignment
- 📊 Complaint status tracking
- ✅ Completion approval
- ❌ Completion rejection
- 🔔 Notifications
- 📈 Reports and dashboard
- 🏢 Department management
- 👤 Profile management
- 🔑 Password management
- 🛡️ API rate limiting
- 🌐 Production deployment using Vercel, Render, and TiDB Cloud

## 🛠️ Technologies Used

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router
- Chart.js
- React Icons
- Lucide React

### Backend

- Node.js
- Express.js
- MySQL2
- JWT
- bcryptjs
- Multer
- CORS
- Express Rate Limit
- dotenv

### Database

- TiDB Cloud (MySQL-compatible database)

### Deployment

- Vercel (Frontend)
- Render (Backend API)
- TiDB Cloud (Database)

## 🏗️ System Architecture

```text
                    Smart Campus Maintenance System
                                  |
                 ┌────────────────┴────────────────┐
                 |                                 |
        Frontend Application                Backend API
            React + Vite                 Node.js + Express
                 |                                 |
                 |            REST API             |
                 └────────────────┬────────────────┘
                                  |
                                  ▼
                          TiDB Cloud Database
                          (MySQL Compatible)
                                  |
                       smart_campus_maintenance
```

## 🔄 Complaint Workflow

```text
Student
   |
   ▼
Create Complaint
   |
   ▼
Administrator Reviews Complaint
   |
   ▼
Assign Technician
   |
   ▼
Technician Works on Complaint
   |
   ▼
Technician Marks Completed
   |
   ▼
Administrator Verifies
   |
   ├── Approve ──► Complaint Completed
   |
   └── Reject ───► Technician Continues Work
```

## 📂 Project Structure

```text
Smart Campus Maintenance System/
|
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

## 🗄️ Database

The system uses a TiDB Cloud database compatible with MySQL, named:

```text
smart_campus_maintenance
```

### Main Tables

| Table | Description |
|---|---|
| `academic_departments` | Academic department information |
| `complaints` | Maintenance complaint information |
| `departments` | Maintenance department information |
| `notifications` | User notification information |
| `technicians` | Technician information |
| `users` | User account information |

The database manages users, complaints, departments, technicians, and notification information.

## ⚙️ Local Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Dhasarathan33/smart-campus-maintenance-system.git
cd smart-campus-maintenance-system
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_NAME=smart_campus_maintenance
CORS_ORIGIN=http://localhost:5173
```

For local development, configure these values for your local MySQL database. If you use TiDB Cloud locally, use the connection details and TLS settings provided by TiDB Cloud instead.

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## 🌐 Production Deployment

The application is deployed using Vercel, Render, and TiDB Cloud.

### Frontend

**Platform:** Vercel

**Live URL:** https://smart-campus-maintenance-system-swart.vercel.app

### Backend

**Platform:** Render

**Backend URL:** https://smart-campus-maintenance-system.onrender.com

### Database

**Platform:** TiDB Cloud

**Database Name:** `smart_campus_maintenance`

### Production Architecture

```text
Vercel Frontend
       |
       | HTTPS / REST API
       ▼
Render Backend
       |
       | Secure Database Connection
       ▼
TiDB Cloud Database
```

### Production Environment Variables

Configure the following environment variables in the respective hosting dashboards.

**Render Backend:**

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `CORS_ORIGIN`

**Vercel Frontend:**

- `VITE_API_BASE_URL`

The frontend API base URL should point to the deployed Render backend API.

Sensitive values must be stored in environment variables and must not be committed to GitHub.

## 🔐 Security

The project includes:

- JWT-based authentication
- Password hashing using bcryptjs
- Environment variables for sensitive configuration
- CORS configuration
- API rate limiting
- Role-based access control

Sensitive values such as database passwords and JWT secrets should be stored in environment variables and should not be committed to GitHub.

## 🧪 Testing

The following table provides a checklist for verifying the application after deployment.

| Feature | Status |
|---|---|
| Frontend Deployment | Deployed — verify live functionality |
| Backend Deployment | Deployed — verify API functionality |
| TiDB Cloud Connection | Configured — verify database operations |
| Admin Login | Pending verification |
| Student Login | Pending verification |
| Technician Login | Pending verification |
| Complaint Creation | Pending verification |
| Technician Assignment | Pending verification |
| Complaint Status Updates | Pending verification |
| Completion Approval | Pending verification |
| Notifications | Pending verification |
| Reports | Pending verification |
| Responsive Design | Primarily optimized for desktop/laptop |

Update these statuses after testing the deployed application.

### Current Platform Support

The application is primarily optimized for:

- 💻 Desktop
- 💻 Laptop

Mobile responsiveness can be improved further as a future enhancement.

## 🚀 Future Enhancements

Possible future improvements include:

- Improved mobile responsiveness
- Real-time notifications
- Advanced analytics
- Email notifications
- Push notifications
- Maintenance scheduling
- More detailed reporting
- Improved mobile navigation
- Additional administrative controls

## 👨‍💻 Development

This project was developed as a Smart Campus Maintenance System to improve the efficiency and transparency of campus maintenance operations.

## 📄 License

This project is developed for academic/project purposes.
