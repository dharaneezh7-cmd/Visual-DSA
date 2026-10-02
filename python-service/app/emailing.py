import logging
import smtplib
import sys
from email.message import EmailMessage

from .config import settings

logger = logging.getLogger("visualdsa.email")
if not logger.handlers:
    handler = logging.StreamHandler(sys.stderr)
    handler.setFormatter(logging.Formatter("%(levelname)s %(name)s: %(message)s"))
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    logger.propagate = False


def _flush():
    for handler in logger.handlers:
        try:
            handler.flush()
        except Exception:  # noqa: BLE001
            pass


def send_otp_email(email: str, otp: str, purpose: str) -> dict:
    """Deliver an OTP by email via SMTP.

    Returns the same envelope in both branches so callers stay agnostic.
    """
    if not settings.smtp_configured:
        if settings.env != "production":
            logger.info("SMTP not configured (dev mode). OTP email delivery skipped for %s.", email)
            _flush()
            return {"delivered": False, "reason": "SMTP not configured; dev mode fallback"}
        logger.warning("SMTP not configured in production. Cannot deliver email to %s.", email)
        _flush()
        return {"delivered": False, "reason": "SMTP service not configured"}

    subject = {
        "password-reset": "Your Visual DSA Password Reset OTP",
        "verify": "Your Visual DSA Verification OTP",
    }.get(purpose, "Your Visual DSA OTP")

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.mail_from
    msg["To"] = email
    msg.set_content(
        f"Your Visual DSA OTP is {otp}.\n"
        "It is valid for 10 minutes. Do not share it with anyone.\n\n"
        "If you did not request this, you can safely ignore this email."
    )

    try:
        if settings.smtp_port == 465:
            with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=10) as server:
                server.login(settings.smtp_user, settings.smtp_password)
                server.send_message(msg)
        else:
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(settings.smtp_user, settings.smtp_password)
                server.send_message(msg)
        logger.info("OTP email sent to %s", email)
        return {"delivered": True, "reason": "sent"}
    except Exception as exc:  # noqa: BLE001
        logger.warning("SMTP delivery failed for %s: %s", email, exc)
        return {"delivered": False, "reason": f"SMTP error: {exc}"}