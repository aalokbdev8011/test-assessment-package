from database import Base
from sqlalchemy import Boolean, Column, Integer, String


class PackageModel(Base):
    __tablename__ = "packages"

    id = Column(Integer, primary_key=True, index=True)
    package_id = Column(Integer, nullable=False)
    return_address = Column(String, nullable=False)
    destination_address = Column(String, nullable=False)
