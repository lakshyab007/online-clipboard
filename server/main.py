import secrets
import string
from contextlib import asynccontextmanager
from typing import Optional

from auth import authenticate_user, create_user, get_user_by_email
from config import settings
from database import ClipboardItem, User, get_db, init_db
from fastapi import Cookie, Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from schemas import (
    ClipboardItemCreate,
    ClipboardItemResponse,
    ClipboardItemShareResponse,
    ClipboardItemUpdate,
    ShareCodeResponse,
    ShareCodeValidate,
    UserCreate,
    UserLogin,
    UserResponse,
)
from sqlalchemy.orm import Session


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    yield
    # Shutdown (if needed)


app = FastAPI(title="Clipboard API", lifespan=lifespan)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Session management - simple cookie-based auth
SESSION_STORE = {}


def generate_session_token():
    """Generate a random session token"""
    return secrets.token_urlsafe(32)


def generate_share_code(length=8):
    """Generate a random share code"""
    chars = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(chars) for _ in range(length))


def get_current_user(
    session_token: Optional[str] = Cookie(None), db: Session = Depends(get_db)
):
    """Get current user from session token"""
    if not session_token or session_token not in SESSION_STORE:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    user_id = SESSION_STORE[session_token]
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


# Auth Routes
@app.post("/api/auth/signup", response_model=UserResponse)
def signup(user_data: UserCreate, response: Response, db: Session = Depends(get_db)):
    """Create a new user account"""
    # Check if user already exists
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new user
    user = create_user(
        db,
        name=user_data.name,
        email=user_data.email,
        password=user_data.password,
        linkedin=user_data.linkedin,
    )

    # Create session
    session_token = generate_session_token()
    SESSION_STORE[session_token] = user.id
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=settings.SESSION_COOKIE_HTTPONLY,
        max_age=settings.SESSION_COOKIE_MAX_AGE,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite=settings.SESSION_COOKIE_SAMESITE,
    )

    return user


@app.post("/api/auth/login", response_model=UserResponse)
def login(credentials: UserLogin, response: Response, db: Session = Depends(get_db)):
    """Login with email and password"""
    user = authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Create session
    session_token = generate_session_token()
    SESSION_STORE[session_token] = user.id
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=settings.SESSION_COOKIE_HTTPONLY,
        max_age=settings.SESSION_COOKIE_MAX_AGE,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite=settings.SESSION_COOKIE_SAMESITE,
    )

    return user


@app.post("/api/auth/logout")
def logout(response: Response, session_token: Optional[str] = Cookie(None)):
    """Logout and clear session"""
    if session_token and session_token in SESSION_STORE:
        del SESSION_STORE[session_token]
    response.delete_cookie(key="session_token")
    return {"message": "Logged out successfully"}


@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user


# Clipboard Item Routes
@app.get("/api/clipboard", response_model=list[ClipboardItemResponse])
def get_clipboard_items(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all clipboard items for current user"""
    items = (
        db.query(ClipboardItem)
        .filter(ClipboardItem.owner_id == current_user.id)
        .order_by(ClipboardItem.updated_at.desc())
        .all()
    )
    return items


@app.post("/api/clipboard", response_model=ClipboardItemResponse)
def create_clipboard_item(
    item_data: ClipboardItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new clipboard item"""
    item = ClipboardItem(
        content=item_data.content,
        owner_id=current_user.id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@app.get("/api/clipboard/{item_id}", response_model=ClipboardItemResponse)
def get_clipboard_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific clipboard item"""
    item = (
        db.query(ClipboardItem)
        .filter(
            ClipboardItem.id == item_id,
            ClipboardItem.owner_id == current_user.id,
        )
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clipboard item not found",
        )
    return item


@app.put("/api/clipboard/{item_id}", response_model=ClipboardItemResponse)
def update_clipboard_item(
    item_id: int,
    item_data: ClipboardItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a clipboard item"""
    item = (
        db.query(ClipboardItem)
        .filter(
            ClipboardItem.id == item_id,
            ClipboardItem.owner_id == current_user.id,
        )
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clipboard item not found",
        )

    item.content = item_data.content
    db.commit()
    db.refresh(item)
    return item


@app.delete("/api/clipboard/{item_id}")
def delete_clipboard_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a clipboard item"""
    item = (
        db.query(ClipboardItem)
        .filter(
            ClipboardItem.id == item_id,
            ClipboardItem.owner_id == current_user.id,
        )
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clipboard item not found",
        )

    db.delete(item)
    db.commit()
    return {"message": "Clipboard item deleted successfully"}


# Share functionality
@app.post("/api/clipboard/{item_id}/share", response_model=ShareCodeResponse)
def share_clipboard_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate a share code for a clipboard item"""
    item = (
        db.query(ClipboardItem)
        .filter(
            ClipboardItem.id == item_id,
            ClipboardItem.owner_id == current_user.id,
        )
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clipboard item not found",
        )

    # Generate a unique share code if not already exists
    if not item.share_code:
        while True:
            share_code = generate_share_code()
            # Check if code already exists
            existing = (
                db.query(ClipboardItem)
                .filter(ClipboardItem.share_code == share_code)
                .first()
            )
            if not existing:
                break

        item.share_code = share_code
        item.is_shared = True
        db.commit()
        db.refresh(item)

    return ShareCodeResponse(share_code=item.share_code)


@app.post("/api/share/validate", response_model=ClipboardItemShareResponse)
def validate_share_code(
    code_data: ShareCodeValidate,
    db: Session = Depends(get_db),
):
    """Validate a share code and get the associated clipboard item"""
    item = (
        db.query(ClipboardItem)
        .filter(ClipboardItem.share_code == code_data.code)
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid share code",
        )

    # Get owner information
    owner = db.query(User).filter(User.id == item.owner_id).first()

    return ClipboardItemShareResponse(
        id=item.id,
        content=item.content,
        owner_name=owner.name if owner else "Unknown",
        created_at=item.created_at,
    )


@app.delete("/api/clipboard/{item_id}/share")
def unshare_clipboard_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove share code from a clipboard item"""
    item = (
        db.query(ClipboardItem)
        .filter(
            ClipboardItem.id == item_id,
            ClipboardItem.owner_id == current_user.id,
        )
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clipboard item not found",
        )

    item.share_code = None
    item.is_shared = False
    db.commit()
    return {"message": "Share code removed successfully"}


# Health check
@app.get("/")
def root():
    return {"message": "Clipboard API is running"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=settings.HOST, port=settings.PORT)