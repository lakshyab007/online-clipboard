from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    linkedin: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Clipboard Item Schemas
class ClipboardItemBase(BaseModel):
    content: str


class ClipboardItemCreate(ClipboardItemBase):
    pass


class ClipboardItemUpdate(BaseModel):
    content: str


class ClipboardItemResponse(ClipboardItemBase):
    id: int
    owner_id: int
    share_code: Optional[str] = None
    is_shared: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ClipboardItemShareResponse(BaseModel):
    id: int
    content: str
    owner_name: str
    created_at: datetime

    class Config:
        from_attributes = True


# Share Code Schemas
class ShareCodeRequest(BaseModel):
    clipboard_item_id: int


class ShareCodeResponse(BaseModel):
    share_code: str


class ShareCodeValidate(BaseModel):
    code: str
