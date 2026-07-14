import json
import time

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from firebase_auth import verify_firebase_id_token
from models import Chat, Message, User
from schemas import (
    ChatCreate,
    ChatOut,
    GoogleAuthRequest,
    LoginRequest,
    MessageCreate,
    MessageOut,
    SignupRequest,
    TokenResponse,
    UserOut,
)
from security import create_access_token, decode_access_token, hash_password, verify_password

Base.metadata.create_all(bind=engine)

app = FastAPI(title="DERYK API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5183",
        "http://192.168.29.249:5183",
        "https://manicotti-muck-unsent.ngrok-free.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        user_id = decode_access_token(token)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@app.post("/auth/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    user = User(
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        display_name=payload.display_name,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    db.refresh(user)
    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token, user=user)


@app.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token, user=user)


@app.post("/auth/google", response_model=TokenResponse)
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    try:
        claims = verify_firebase_id_token(payload.id_token)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google sign-in token")

    firebase_uid = claims["sub"]
    email = claims.get("email", "").lower()
    display_name = claims.get("name") or email.split("@")[0]

    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    if not user:
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.firebase_uid = firebase_uid
        else:
            user = User(email=email, firebase_uid=firebase_uid, display_name=display_name)
            db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token, user=user)


@app.get("/auth/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@app.get("/chats", response_model=list[ChatOut])
def list_chats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Chat)
        .filter(Chat.user_id == current_user.id)
        .order_by(Chat.created_at.desc())
        .all()
    )


@app.post("/chats", response_model=ChatOut, status_code=status.HTTP_201_CREATED)
def create_chat(
    payload: ChatCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    chat = Chat(user_id=current_user.id, title=payload.title)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


def get_owned_chat(chat_id, current_user: User, db: Session) -> Chat:
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")
    return chat


@app.delete("/chats/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chat(
    chat_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    chat = get_owned_chat(chat_id, current_user, db)
    db.delete(chat)  # messages cascade-delete via the relationship
    db.commit()


@app.get("/chats/{chat_id}/messages", response_model=list[MessageOut])
def list_messages(
    chat_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    chat = get_owned_chat(chat_id, current_user, db)
    return chat.messages


# Placeholder reply until the real agent runtime (Bedrock + LangGraph) replaces it.
_PLACEHOLDER_REPLY = (
    "This is a placeholder response — the real agent isn't wired up yet, "
    "but the message pipeline (storage + streaming) is working."
)


def _stream_reply(chat_id: str, reply_text: str):
    db = next(get_db())
    try:
        words = reply_text.split(" ")
        for i, word in enumerate(words):
            chunk = word if i == 0 else f" {word}"
            yield f"data: {json.dumps({'delta': chunk})}\n\n"
            time.sleep(0.03)

        assistant_message = Message(chat_id=chat_id, role="assistant", content=reply_text)
        db.add(assistant_message)
        db.commit()
        db.refresh(assistant_message)
        yield f"data: {json.dumps({'done': True, 'message_id': str(assistant_message.id)})}\n\n"
    finally:
        db.close()


@app.post("/chats/{chat_id}/messages")
def create_message(
    chat_id: str,
    payload: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    chat = get_owned_chat(chat_id, current_user, db)

    user_message = Message(chat_id=chat.id, role="user", content=payload.content)
    db.add(user_message)
    db.commit()

    return StreamingResponse(_stream_reply(str(chat.id), _PLACEHOLDER_REPLY), media_type="text/event-stream")
