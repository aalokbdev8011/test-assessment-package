from database import engine, SessionLocal, get_db
from fastapi import FastAPI, Depends, status, Response, HTTPException
from sqlalchemy.orm import Session
import models
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder


from schema import PackageInputSchema, PackageOutputSchema

models.Base.metadata.create_all(engine)

app = FastAPI()


origins = [
    "http://localhost:3001",
    # Replace with the actual frontend URL  # Add allowed origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],  # You can restrict HTTP methods if needed
    allow_headers=["*"],  # You can restrict headers if needed
)

# In-memory storage for packages
packages = []


@app.post("/create-package/", status_code=status.HTTP_201_CREATED, response_model=PackageOutputSchema)
def create_package(request: PackageInputSchema, db: Session = Depends(get_db)):
    try:
        package_data = jsonable_encoder(request)
        new_package = models.PackageModel(**package_data)
        db.add(new_package)
        db.commit()
        db.refresh(new_package)
        return new_package
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create package: {str(e)}")


# Query packages by destination address, return address, or package ID
@app.get("/query-package", response_model=List[PackageOutputSchema])
def query_package(destination_address: str = None, return_address: str = None, package_id: int = None, db: Session = Depends(get_db)):

    if destination_address:
        filtered_packages = db.query(models.PackageModel).filter(models.PackageModel.destination_address==destination_address)
        return filtered_packages
    elif return_address:
        filtered_packages = db.query(models.PackageModel).filter(models.PackageModel.return_address==return_address)
        return filtered_packages
    elif package_id:
        filtered_packages = db.query(models.PackageModel).filter(models.PackageModel.package_id==package_id)
        return filtered_packages
    
    return   db.query(models.PackageModel).all()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
