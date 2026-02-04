from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import date, datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="HRMS Lite API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.hrms_lite

# Pydantic Models
class Employee(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

class EmployeeResponse(BaseModel):
    id: str
    employee_id: str
    full_name: str
    email: str
    department: str

class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    status: str

class AttendanceResponse(BaseModel):
    id: str
    employee_id: str
    date: str
    status: str
    employee_name: Optional[str] = None

# Helper functions
def employee_helper(employee) -> dict:
    return {
        "id": str(employee["_id"]),
        "employee_id": employee["employee_id"],
        "full_name": employee["full_name"],
        "email": employee["email"],
        "department": employee["department"]
    }

def attendance_helper(attendance) -> dict:
    return {
        "id": str(attendance["_id"]),
        "employee_id": attendance["employee_id"],
        "date": attendance["date"].isoformat() if isinstance(attendance["date"], datetime) else attendance["date"],
        "status": attendance["status"],
        "employee_name": attendance.get("employee_name")
    }

# Root endpoint
@app.get("/")
async def root():
    return {"message": "HRMS Lite API", "version": "1.0.0", "status": "running"}

# Health check
@app.get("/health")
async def health_check():
    try:
        await client.admin.command('ping')
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

# Employee Endpoints
@app.post("/api/employees", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: Employee):
    """Create a new employee"""
    # Check if employee_id already exists
    existing = await db.employees.find_one({"employee_id": employee.employee_id})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee with ID {employee.employee_id} already exists"
        )
    
    # Check if email already exists
    existing_email = await db.employees.find_one({"email": employee.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee with email {employee.email} already exists"
        )
    
    employee_dict = employee.dict()
    result = await db.employees.insert_one(employee_dict)
    created_employee = await db.employees.find_one({"_id": result.inserted_id})
    
    return employee_helper(created_employee)

@app.get("/api/employees", response_model=List[EmployeeResponse])
async def get_all_employees():
    """Get all employees"""
    employees = []
    async for employee in db.employees.find():
        employees.append(employee_helper(employee))
    return employees

@app.get("/api/employees/{employee_id}", response_model=EmployeeResponse)
async def get_employee(employee_id: str):
    """Get a specific employee by employee_id"""
    employee = await db.employees.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    return employee_helper(employee)

@app.delete("/api/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(employee_id: str):
    """Delete an employee"""
    employee = await db.employees.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    
    # Delete employee
    await db.employees.delete_one({"employee_id": employee_id})
    
    # Also delete associated attendance records
    await db.attendance.delete_many({"employee_id": employee_id})
    
    return None

# Attendance Endpoints
@app.post("/api/attendance", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
async def mark_attendance(attendance: AttendanceCreate):
    """Mark attendance for an employee"""
    # Check if employee exists
    employee = await db.employees.find_one({"employee_id": attendance.employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {attendance.employee_id} not found"
        )
    
    # Check if attendance already marked for this date
    existing = await db.attendance.find_one({
        "employee_id": attendance.employee_id,
        "date": attendance.date.isoformat()
    })
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Attendance already marked for employee {attendance.employee_id} on {attendance.date}"
        )
    
    attendance_dict = attendance.dict()
    attendance_dict["date"] = attendance.date.isoformat()
    attendance_dict["employee_name"] = employee["full_name"]
    
    result = await db.attendance.insert_one(attendance_dict)
    created_attendance = await db.attendance.find_one({"_id": result.inserted_id})
    
    return attendance_helper(created_attendance)

@app.get("/api/attendance", response_model=List[AttendanceResponse])
async def get_all_attendance(employee_id: Optional[str] = None, date_filter: Optional[str] = None):
    """Get all attendance records with optional filters"""
    query = {}
    
    if employee_id:
        query["employee_id"] = employee_id
    
    if date_filter:
        query["date"] = date_filter
    
    attendance_records = []
    async for record in db.attendance.find(query).sort("date", -1):
        attendance_records.append(attendance_helper(record))
    
    return attendance_records

@app.get("/api/attendance/{employee_id}", response_model=List[AttendanceResponse])
async def get_employee_attendance(employee_id: str):
    """Get attendance records for a specific employee"""
    # Check if employee exists
    employee = await db.employees.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    
    attendance_records = []
    async for record in db.attendance.find({"employee_id": employee_id}).sort("date", -1):
        attendance_records.append(attendance_helper(record))
    
    return attendance_records

@app.get("/api/attendance/stats/{employee_id}")
async def get_employee_attendance_stats(employee_id: str):
    """Get attendance statistics for an employee"""
    # Check if employee exists
    employee = await db.employees.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    
    total_records = await db.attendance.count_documents({"employee_id": employee_id})
    present_days = await db.attendance.count_documents({"employee_id": employee_id, "status": "Present"})
    absent_days = await db.attendance.count_documents({"employee_id": employee_id, "status": "Absent"})
    
    return {
        "employee_id": employee_id,
        "employee_name": employee["full_name"],
        "total_records": total_records,
        "present_days": present_days,
        "absent_days": absent_days
    }

# Dashboard stats
@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    total_employees = await db.employees.count_documents({})
    total_attendance_records = await db.attendance.count_documents({})
    
    # Get today's attendance
    today = date.today().isoformat()
    today_present = await db.attendance.count_documents({"date": today, "status": "Present"})
    today_absent = await db.attendance.count_documents({"date": today, "status": "Absent"})
    
    # Get department breakdown
    pipeline = [
        {"$group": {"_id": "$department", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    dept_cursor = db.employees.aggregate(pipeline)
    departments = {}
    async for dept in dept_cursor:
        departments[dept["_id"]] = dept["count"]
    
    return {
        "total_employees": total_employees,
        "total_attendance_records": total_attendance_records,
        "today_present": today_present,
        "today_absent": today_absent,
        "today_date": today,
        "departments": departments
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
