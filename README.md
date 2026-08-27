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
- 🌐 Production deployment using Railway

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

- MySQL

### Deployment

- Railway

## 🏗️ System Architecture

```text
                    Smart Campus Maintenance System
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
        Frontend Application                 Backend API
             React + Vite                 Node.js + Express
                 │                                 │
                 │            REST API             │
                 └────────────────┬────────────────┘
                                  │
                                  ▼
                           MySQL Database
                                  │
                    smart_campus_maintenance
```

## 🔄 Complaint Workflow

```text
Student
   │
   ▼
Create Complaint
   │
   ▼
Administrator Reviews Complaint
   │
   ▼
Assign Technician
   │
   ▼
Technician Works on Complaint
   │
   ▼
Technician Marks Completed
   │
   ▼
Administrator Verifies
   │
   ├── Approve ──► Complaint Completed
   │
   └── Reject ───► Technician Continues Work
```

## 📂 Project Structure

```text
Smart Campus Maintenance System/
│
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

The system uses a MySQL database named:

```text
smart_campus_maintenance
```

### Main Tables

| Table | Description |
|---|---|
| `academic_departments` | Academic department information |
| `complaints` | Maintenance complaint information |
| `departments` | Department information |
| `notifications` | User notification information |
| `technicians` | Technician information |
| `users` | User account information |

The database manages users, complaints, departments, technicians, and notification information.

## ⚙️ Local Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Dhasarathan33/smart-campus-maintenance-system.git
cd "Smart Campus Maintenance System"
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
DB_USER=root
DB_PASSWORD=YOUR_DATABASE_PASSWORD
DB_NAME=smart_campus_maintenance
JWT_SECRET=YOUR_JWT_SECRET
CORS_ORIGIN=http://localhost:5173
```

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

Create the required environment configuration:

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

The application is deployed using Railway.

### Frontend

https://carefree-illumination-production-e062.up.railway.app

### Backend

https://smart-campus-maintenance-system-production.up.railway.app

### Production Architecture

```text
Railway Frontend
       │
       ▼
Railway Backend
       │
       ▼
Railway MySQL
```

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

The deployed application has been tested for the main user workflows:

| Feature | Status |
|---|---|
| Frontend Deployment | ✅ Working |
| Backend Deployment | ✅ Working |
| MySQL Connection | ✅ Working |
| Admin Login | ✅ Working |
| Student Login | ✅ Working |
| Technician Login | ✅ Working |
| Complaint Creation | ✅ Working |
| Technician Assignment | ✅ Working |
| Complaint Status Updates | ✅ Working |
| Completion Approval | ✅ Working |
| Notifications | ✅ Working |
| Reports | ✅ Working |
| Responsive Design | ⚠️ Optimized for Desktop/Laptop |

### Current Platform Support

The application is primarily optimized and tested for:

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