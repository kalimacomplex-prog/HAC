from datetime import datetime, timedelta
from typing import Optional

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from .config import settings
from .database import users_col

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def create_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.jwt_expire_minutes)
    return jwt.encode(
        {"sub": user_id, "exp": expire},
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )


def create_job_token(job_id: str, user_id: str, ttl_seconds: int) -> str:
    """Token de uso único e escopo único: só autoriza terminar ESTE job
    (ver api/routes/worker.py::finish_job). Injetado como env var na
    Machine efêmera que executa o job (api/fly_machines.py) — mais
    restrito que autenticar como o usuário dono ou como a conta de
    serviço admin, já que não serve pra mais nada além desse /finish."""
    expire = datetime.utcnow() + timedelta(seconds=ttl_seconds)
    return jwt.encode(
        {"sub": user_id, "job_id": job_id, "typ": "job", "exp": expire},
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )


def decode_job_token(token: str) -> Optional[dict]:
    """Retorna os claims se `token` for um job-token válido (não expirado,
    `typ == "job"`), senão None — nunca levanta exceção, pra caller poder
    tentar esse caminho antes de cair no `get_current_user` normal."""
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError:
        return None
    if payload.get("typ") != "job":
        return None
    return payload


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        # Job-tokens (ver create_job_token) só valem pra
        # /worker/jobs/{id}/finish, nunca pra autenticação geral — do
        # contrário um token de escopo único viraria, na prática, uma
        # sessão completa do usuário dono do job.
        if payload.get("typ") == "job":
            raise credentials_error
        user_id: Optional[str] = payload.get("sub")
        if user_id is None:
            raise credentials_error
    except JWTError:
        raise credentials_error

    user = await users_col.find_one({"_id": user_id})
    if user is None or not user.get("is_active", True):
        raise credentials_error
    return user
