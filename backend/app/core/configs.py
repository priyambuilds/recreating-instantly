from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_hostname: str
    database_port: str
    database_password: str
    database_name: str
    database_username: str

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    SESSION_TTL_DAYS: int = 7

    PROJECT_NAME: str = "Recreating Instantly"
    PROJECT_DESCRIPTION: str = "A platform to send and share your favorite moments instantly with emails."
    PROJECT_VERSION: str = "1.0.0"

    DISCORD_CLIENT_ID: str
    DISCORD_CLIENT_SECRET: str
    DISCORD_REDIRECT_URI: str
    class Config:
        env_file = ".env"

settings = Settings()





