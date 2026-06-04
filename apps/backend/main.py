from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Boolean, or_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List, Optional

# 1. DATABASE CONFIGURATION
DATABASE_URL = "postgresql://admin:secretpass@host.docker.internal:5432/model_registry"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class DBEmployeeTracker(Base):
    __tablename__ = "employee_assets"
    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String, index=True)
    department = Column(String)
    assigned_laptop = Column(String) 
    is_onboarding_complete = Column(Boolean, default=False)

Base.metadata.create_all(bind=engine)

# 2. FASTAPI INTERN SYSTEMS
app = FastAPI(title="Corporate IT Asset Registry API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class EmployeeBase(BaseModel):
    employee_name: str
    department: str
    assigned_laptop: str
    is_onboarding_complete: bool

class EmployeeResponse(EmployeeBase):
    id: int
    class Config:
        from_attributes = True

# 3. IT CRUD ENDPOINTS WITH ADVANCED SEARCH

# UPDATED READ: Accepts a generic search term and filters across multiple columns
@app.get("/employees", response_model=List[EmployeeResponse])
def get_employees(search: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(DBEmployeeTracker)
    
    if search:
        # The 'or_' function checks if the term matches Name OR Dept OR Laptop
        # ilike() makes the search case-insensitive (e.g., 'jane' matches 'Jane')
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                DBEmployeeTracker.employee_name.ilike(search_filter),
                DBEmployeeTracker.department.ilike(search_filter),
                DBEmployeeTracker.assigned_laptop.ilike(search_filter)
            )
        )
    
    return query.all()

# CREATE
@app.post("/employees", response_model=EmployeeResponse, status_code=201)
def onboard_employee(employee: EmployeeBase, db: Session = Depends(get_db)):
    db_employee = DBEmployeeTracker(
        employee_name=employee.employee_name,
        department=employee.department,
        assigned_laptop=employee.assigned_laptop,
        is_onboarding_complete=employee.is_onboarding_complete
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

# DELETE
@app.delete("/employees/{employee_id}")
def offboard_employee(employee_id: int, db: Session = Depends(get_db)):
    db_employee = db.query(DBEmployeeTracker).filter(DBEmployeeTracker.id == employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee record not found")
    db.delete(db_employee)
    db.commit()
    return {"message": f"Successfully offboarded employee ID {employee_id}"}