import os
from pathlib import Path

from dotenv import load_dotenv


# Load .env from the python-service directory
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)


def _get(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


class Settings:
    port: int = int(_get("PYTHON_PORT", "8000"))
    env: str = _get("PYTHON_ENV", "development")

    internal_api_key: str = _get("INTERNAL_API_KEY", "default-internal-key-change-me")

    smtp_host: str = _get("SMTP_HOST")
    smtp_port: int = int(_get("SMTP_PORT", "465"))
    smtp_user: str = _get("SMTP_USER")
    smtp_password: str = _get("SMTP_PASSWORD")
    mail_from: str = _get(
        "MAIL_FROM",
        "Visual DSA <no-reply@example.com>"
    )

    allowed_origins: list[str] = [
        origin.strip()
        for origin in _get(
            "ALLOWED_ORIGINS",
            "http://localhost:5000,http://localhost:5173"
        ).split(",")
        if origin.strip()
    ]

    @property
    def smtp_configured(self) -> bool:
        return bool(
            self.smtp_host
            and self.smtp_user
            and self.smtp_password
        )


settings = Settings()