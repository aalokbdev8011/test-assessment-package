from pydantic import BaseModel


class PackageInputSchema(BaseModel):
    return_address: str
    destination_address: str
    package_id: int


class PackageOutputSchema(BaseModel):
    id: int
    package_id: int
    return_address: str
    destination_address: str