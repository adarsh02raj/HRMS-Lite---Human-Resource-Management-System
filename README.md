# HRMS Lite - Human Resource Management System

A lightweight, full-stack Human Resource Management System built with React, FastAPI, and MongoDB. This application provides essential HR operations including employee management and attendance tracking.

## � Project Overview

HRMS Lite is a web-based application that allows administrators to:
- Manage employee records (Add, View, Delete)
- Track daily attendance (Mark, View, Filter)
- View dashboard statistics and department breakdown
- Access a clean, modern, and responsive UI with dark sidebar navigation

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.2
- **Build Tool:** Vite 5
- **Routing:** React Router v6
- **HTTP Client:** Axios 1.6
- **Icons:** Lucide React
- **Styling:** Custom CSS with modern design system

### Backend
- **Framework:** FastAPI 0.104.1
- **Database:** MongoDB (with Motor 3.3.2 async driver)
- **Validation:** Pydantic 2.5.0
- **Server:** Uvicorn 0.24.0
- **CORS:** Enabled for local development

### Database
- **MongoDB:** NoSQL database for flexible data storage
- **Collections:** employees, attendance

## 🚀 Steps to Run the Project Locally

### Prerequisites
- Python 3.11 or higher
- Node.js 16 or higher
- MongoDB installed and running locally (or MongoDB Atlas account)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd HRMs
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (optional - uses defaults if not present)
# MONGODB_URL=mongodb://localhost:27017
# DATABASE_NAME=hrms_db

# Start the backend server
python main.py
```

The backend will start on `http://localhost:8000`

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to `http://localhost:3000`

## 📝 Assumptions and Limitations

### Assumptions
1. **Single Admin User:** The system assumes a single administrator managing all operations (no authentication/authorization implemented)
2. **Local MongoDB:** Default configuration assumes MongoDB is running locally on port 27017
3. **Unique Employee IDs:** Employee IDs must be unique across the system
4. **Daily Attendance:** One attendance record per employee per day (prevents duplicates)
5. **Date Format:** All dates use ISO format (YYYY-MM-DD)

### Limitations
1. **No Authentication:** No login system or user authentication (single admin context)
2. **No Authorization:** No role-based access control
3. **No Pagination:** All records are loaded at once (may impact performance with large datasets)
4. **Basic Validation:** Simple validation only (no advanced business rules)
5. **No File Upload:** Employee photos or documents not supported
6. **No Audit Trail:** No history of changes or modifications
7. **No Email Notifications:** No automated emails for attendance or other events
8. **Basic Reporting:** Limited to dashboard statistics only
9. **No Data Export:** Cannot export data to Excel/CSV
10. **No Bulk Operations:** Cannot import or update multiple records at once

### Future Enhancements (Not Implemented)
- User authentication and authorization
- Employee profile pictures
- Advanced reporting and analytics
- Leave management
- Payroll integration
- Email notifications
- Data export functionality
- Bulk import/export
- Search and advanced filtering
- Audit logging
- Multi-language support

## 📁 Project Structure

```
HRMs/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment variables template
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── pages/           # Dashboard, Employees, Attendance
│   │   ├── api.js           # API client
│   │   ├── App.jsx          # Main app with routing
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
└── README.md

## 🔧 Configuration

### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=hrms_db
```

### Frontend (vite.config.js)
The proxy is configured to forward `/api` requests to `http://localhost:8000`

## 🐛 Troubleshooting

### Backend Issues
- **MongoDB Connection Error:** Ensure MongoDB is running on port 27017
- **Import Errors:** Make sure all dependencies are installed: `pip install -r requirements.txt`
- **Port Already in Use:** Change the port in main.py: `uvicorn.run(app, host="0.0.0.0", port=8001)`

### Frontend Issues
- **API Connection Error:** Verify backend is running on port 8000
- **Module Not Found:** Run `npm install` to install dependencies
- **Port 3000 in Use:** Vite will automatically use the next available port

## 📄 License

This project is created for educational purposes.

---

**Built with ❤️ using React, FastAPI, and MongoDB**
- Required field validation
- Email format validation
- Duplicate employee ID/email prevention
- Duplicate attendance prevention
- Employee existence validation for attendance
- Proper HTTP status codes (400, 404, 201, 204)

### Frontend Validation
- Client-side form validation
- Real-time error display
- User-friendly error messages
- Loading states during API calls
- Error boundary handling

## 🧪 Testing the Application

### Manual Testing Checklist

#### Employee Management
1. ✅ Add employee with valid data
2. ✅ Try adding duplicate employee ID (should fail)
3. ✅ Try adding duplicate email (should fail)
4. ✅ Try adding employee with invalid email (should fail)
5. ✅ View all employees
6. ✅ Delete employee (with confirmation)
7. ✅ Verify empty state when no employees

#### Attendance Management
1. ✅ Mark attendance for valid employee
2. ✅ Try marking duplicate attendance (should fail)
3. ✅ Try marking attendance for non-existent employee (should fail)
4. ✅ Filter by employee
5. ✅ Filter by date
6. ✅ Clear filters
7. ✅ Verify empty state when no records

#### Dashboard
1. ✅ Check statistics accuracy
2. ✅ Verify real-time updates
3. ✅ Test quick action buttons

## 📝 Assumptions & Limitations

### Assumptions
- Single admin user (no authentication required as per requirements)
- Employee ID is manually entered (not auto-generated)
- Attendance can be marked for any date (past or future)
- Attendance status is binary (Present/Absent only)

### Limitations
- No authentication/authorization system
- No role-based access control
- No leave management
- No payroll features
- No employee profile editing
- No attendance history editing/deletion
- No bulk operations
- No data export functionality

### Future Enhancements (Out of Scope)
- User authentication and authorization
- Employee profile editing
- Leave management system
- Payroll processing
- Advanced reporting and analytics
- Data export (CSV, PDF)
- Email notifications
- Attendance modification/deletion
- Bulk attendance marking
- Department management
- Employee search functionality

## 🤝 Contributing

This is an assignment project, but suggestions and feedback are welcome!

## 📄 License

This project is created as part of a coding assignment.

## 👨‍💻 Developer

Developed as part of the HRMS Lite Full-Stack Coding Assignment

---

## 🎯 Assignment Compliance Checklist

✅ **Functional Requirements**
- ✅ Employee Management (Add, View, Delete)
- ✅ Attendance Management (Mark, View)
- ✅ All required fields implemented

✅ **Technical Requirements**
- ✅ RESTful API design
- ✅ Database persistence (MongoDB)
- ✅ Server-side validation
- ✅ Error handling
- ✅ Professional UI/UX

✅ **Code Quality**
- ✅ Readable and modular code
- ✅ Reusable components
- ✅ Proper file structure
- ✅ Clean styling

✅ **Deployment**
- ✅ Frontend deployment ready (Vercel)
- ✅ Backend deployment ready (Render/Railway)
- ✅ Deployment configurations included

✅ **Documentation**
- ✅ Comprehensive README
- ✅ Setup instructions
- ✅ API documentation
- ✅ Tech stack details

✅ **Bonus Features**
- ✅ Filter by date
- ✅ Dashboard statistics
- ✅ Total present days tracking

---

