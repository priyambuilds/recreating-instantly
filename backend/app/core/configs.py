from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_hostname: str
    database_port: str
    database_password: str
    database_name: str
    database_username: str

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_DAYS: int
    SESSION_TTL_DAYS: int = 7
    ACCESS_TOKEN_MAX_AGE: int

    PROJECT_NAME: str = "Recreating Instantly"
    PROJECT_DESCRIPTION: str = "A platform to send and share your favorite moments instantly with emails."
    PROJECT_VERSION: str = "1.0.0"

    
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/user/sso/google/callback"
    GOOGLE_AUTH_URL: str = "https://accounts.google.com/o/oauth2/v2/auth"
    GOOGLE_TOKEN_URL: str = "https://oauth2.googleapis.com/token"
    GOOGLE_USERINFO_URL: str = "https://www.googleapis.com/oauth2/v2/userinfo"

    DISCORD_CLIENT_ID: str
    DISCORD_CLIENT_SECRET: str
    DISCORD_REDIRECT_URI: str = "http://localhost:8000/user/sso/discord/callback"
    DISCORD_USER_URL: str = "https://discord.com/api/users/@me"
    DISCORD_TOKEN_URL: str = "https://discord.com/api/oauth2/token"
    DISCORD_AUTH_URL: str = "https://discord.com/oauth2/authorize"
    
    class Config:
        env_file = ".env"

settings = Settings()





