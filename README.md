This is the Backend of CLIC-Summary-Manager.

The project is created by FastAPI.

You need to add the proper config to core/config.py before using this service.

A reference configuration is the following:
```python
import os

class Settings:
    APP_TITLE: str = os.getenv("APP_TITLE", "XXX")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "database://address")
    OPENAI_API_KEY: str | None = "API_KEY"
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "API_MODEL")
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "#CORS_ADDRESS").split(",")
        if origin.strip()
    ]

settings = Settings()
```