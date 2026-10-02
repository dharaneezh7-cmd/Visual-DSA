from typing import List, Optional

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .analysis import ProgressRecord, PracticeRecord, analyze_progress
from .config import settings
from .emailing import send_otp_email

app = FastAPI(
    title="Visual DSA Supporting Service",
    description="OTP email delivery and learning analytics for the Visual DSA platform.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "X-Internal-API-Key"],
)


def verify_internal_key(x_internal_api_key: Optional[str] = Header(None, alias="X-Internal-API-Key")) -> None:
    if not x_internal_api_key or x_internal_api_key != settings.internal_api_key:
        raise HTTPException(status_code=401, detail="Unauthorized internal request.")


class SendOtpRequest(BaseModel):
    email: str
    otp: str
    purpose: str = "password-reset"


class AnalyzeRequest(BaseModel):
    progress: List[ProgressRecord] = []
    practices: List[PracticeRecord] = []


@app.get("/health")
def health() -> dict:
    return {"success": True, "service": "visual-dsa-python", "status": "ok"}


@app.post("/send-otp", dependencies=[Depends(verify_internal_key)])
def send_otp(payload: SendOtpRequest) -> dict:
    if not payload.email.strip():
        raise HTTPException(status_code=400, detail="Email is required.")
    if not payload.otp.strip() or not payload.otp.isdigit() or len(payload.otp) != 6:
        raise HTTPException(status_code=400, detail="OTP must be exactly 6 digits.")

    delivery = send_otp_email(payload.email.strip(), payload.otp, payload.purpose)
    return {
        "success": True,
        "message": "OTP handled by mail service.",
        "email": payload.email,
        "purpose": payload.purpose,
        "delivered": delivery["delivered"],
        "deliveryNote": delivery["reason"],
    }


@app.post("/analyze-progress", dependencies=[Depends(verify_internal_key)])
def analyze(payload: AnalyzeRequest) -> dict:
    result = analyze_progress(payload.progress, payload.practices)
    return {"success": True, "analysis": result}