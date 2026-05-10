from datetime import datetime

from fastapi import APIRouter, HTTPException, status
from bson import ObjectId

from ..auth import hash_password, verify_password, create_token, get_current_user
from ..database import users_col
from ..models.user import UserCreate, UserLogin, UserOut, user_doc_to_out
from fastapi import Depends

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=201)
async def register(body: UserCreate):
    if await users_col.find_one({"email": body.email}):
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    user_id = str(ObjectId())
    doc = {
        "_id": user_id,
        "email": body.email,
        "name": body.name,
        "hashed_password": hash_password(body.password),
        "role": "user",
        "is_active": True,
        "created_at": datetime.utcnow(),
    }
    await users_col.insert_one(doc)
    return user_doc_to_out(doc)


@router.post("/login")
async def login(body: UserLogin):
    user = await users_col.find_one({"email": body.email})
    if not user or not verify_password(body.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    if not user.get("is_active", True):
        raise HTTPException(status_code=403, detail="Conta desativada")

    token = create_token(user["_id"])
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
async def me(current_user: dict = Depends(get_current_user)):
    return user_doc_to_out(current_user)
