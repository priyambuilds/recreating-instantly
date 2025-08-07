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
    
    SLACK_CLIENT_ID: str
    SLACK_CLIENT_SECRET: str
    SLACK_REDIRECT_URI: str = "http://localhost:8000/user/sso/slack/callback"
    SLACK_AUTH_URL: str = "https://slack.com/oauth/v2/authorize"
    SLACK_TOKEN_URL: str = "https://slack.com/api/oauth.v2.access"
    SLACK_USERINFO_URL: str = "https://slack.com/api/users.identity"

    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    GITHUB_REDIRECT_URI: str = "http://localhost:8000/user/sso/github/callback"
    GITHUB_AUTH_URL: str = "https://github.com/login/oauth/authorize"
    GITHUB_TOKEN_URL: str = "https://github.com/login/oauth/access_token"
    GITHUB_USERINFO_URL: str = "https://api.github.com/user"

    X_CLIENT_ID: str
    X_CLIENT_SECRET: str
    X_REDIRECT_URI: str = "http://127.0.0.1:8000/user/sso/x/callback"
    X_AUTH_URL: str = "https://twitter.com/i/oauth2/authorize"
    X_TOKEN_URL: str = "https://api.twitter.com/2/oauth2/token"
    X_USERINFO_URL: str = "https://api.twitter.com/2/users/me"

    LINKEDIN_CLIENT_ID: str
    LINKEDIN_CLIENT_SECRET: str
    LINKEDIN_REDIRECT_URI: str = "http://127.0.0.1:8000/user/sso/linkedin/callback"
    LINKEDIN_AUTH_URL: str = "https://www.linkedin.com/oauth/v2/authorization"
    LINKEDIN_TOKEN_URL: str = "https://www.linkedin.com/oauth/v2/accessToken"
    LINKEDIN_USERINFO_URL: str = "https://api.linkedin.com/v2/me"
    LINKEDIN_EMAIL_URL: str = "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))"


    BREVO_API_KEY: str
    SENDER_EMAIL: str

    GOOGLE_SHEET_ID: str

    STRIPE_SECRET_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()





'''
    X_AUTH_URL: str = "https://api.x.com/oauth2/authorize"
    X_TOKEN_URL: str = "https://api.x.com/oauth2/token"
    X_USERINFO_URL: str = "https://api.x.com/2/users/me"
'''