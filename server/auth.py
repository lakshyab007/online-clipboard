from typing import Optional

from database import User
from passlib.context import CryptContext
from sqlalchemy.orm import Session

pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(db: Session, email: str, password: str):
    """Authenticate a user by email and password"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def get_user_by_email(db: Session, email: str):
    """Get a user by email"""
    return db.query(User).filter(User.email == email).first()


def create_user(
    db: Session, name: str, email: str, password: str, linkedin: Optional[str] = None
):
    """Create a new user with hashed password"""
    hashed_password = hash_password(password)
    user = User(
        name=name, email=email, password_hash=hashed_password, linkedin=linkedin
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
