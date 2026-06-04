import os

from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Boolean, or_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List, Optional

app = FastAPI(title="IT Asset Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Reads the database path from the server system settings, defaulting to localhost for local testing
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:secretpass@localhost:5432/model_registry")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class EmployeeAssetDB(Base):
    __tablename__ = "employee_assets"
    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String, index=True)
    department = Column(String, index=True)
    assigned_laptop = Column(String)
    is_onboarding_complete = Column(Boolean, default=False)

Base.metadata.create_all(bind=engine)

class AssetCreate(BaseModel):
    employee_name: str
    department: str
    assigned_laptop: str
    is_onboarding_complete: bool

class AssetResponse(BaseModel):
    id: int
    employee_name: str
    department: str
    assigned_laptop: str
    is_onboarding_complete: bool
    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/employees", response_model=AssetResponse, status_code=201)
def create_asset(asset: AssetCreate, db: Session = Depends(get_db)):
    db_asset = EmployeeAssetDB(**asset.model_dump())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

@app.get("/employees", response_model=List[AssetResponse])
def get_assets(search: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(EmployeeAssetDB)
    if search:
        query = query.filter(
            or_(
                EmployeeAssetDB.employee_name.ilike(f"%{search}%"),
                EmployeeAssetDB.department.ilike(f"%{search}%"),
                EmployeeAssetDB.assigned_laptop.ilike(f"%{search}%")
            )
        )
    return query.all()