## 1. X SSO Login

- **Endpoint:** `/user/sso/x/login`
- **HTTP Method:** GET
- **Short Description:** Redirects user to X (Twitter) OAuth login page for authentication.
- **Dependency/Auth:** None
- **Error Codes:**
  - 500: Internal server error (URL generation failure)
- **Notes:** Used to initiate X SSO login flow.

---

## 2. X SSO Callback

- **Endpoint:** `/user/sso/x/callback`
- **HTTP Method:** GET
- **Short Description:** Handles X OAuth callback, exchanges code for access token, fetches user info, and logs in or creates user.
- **Dependency/Auth:** None
- **Error Codes:**
  - 400: Missing code, token exchange failed, failed to fetch X user info, no access_token returned by X
  - 500: Internal server error
- **Notes:** Sets JWT cookie and redirects to docs. Creates or updates user in SSOUserBase.

---

## 3. Google SSO Login

- **Endpoint:** `/user/sso/google/login`
- **HTTP Method:** GET
- **Short Description:** Redirects user to Google OAuth login page for authentication.
- **Dependency/Auth:** None
- **Error Codes:**
  - 500: Internal server error (URL generation failure)
- **Notes:** Used to initiate Google SSO login flow.

---

## 4. Google SSO Callback

- **Endpoint:** `/user/sso/google/callback`
- **HTTP Method:** GET
- **Short Description:** Handles Google OAuth callback, exchanges code for access token, fetches user info, and logs in or creates user.
- **Dependency/Auth:** None
- **Error Codes:**
  - 400: Missing code, token exchange failed, failed to fetch Google user info
  - 500: Internal server error
- **Notes:** Sets JWT cookie and redirects to docs. Creates or updates user in SSOUserBase.

---

## 5. GitHub SSO Login

- **Endpoint:** `/user/sso/github/login`
- **HTTP Method:** GET
- **Short Description:** Redirects user to GitHub OAuth login page for authentication.
- **Dependency/Auth:** None
- **Error Codes:**
  - 500: Internal server error (URL generation failure)
- **Notes:** Used to initiate GitHub SSO login flow.

---

## 6. GitHub SSO Callback

- **Endpoint:** `/user/sso/github/callback`
- **HTTP Method:** GET
- **Short Description:** Handles GitHub OAuth callback, exchanges code for access token, fetches user info, and logs in or creates user.
- **Dependency/Auth:** None
- **Error Codes:**
  - 400: Missing code, token exchange failed, failed to fetch GitHub user info, no access_token returned by GitHub
  - 500: Internal server error
- **Notes:** Sets JWT cookie and redirects to docs. Creates or updates user in SSOUserBase.

---

## 7. Discord SSO Login

- **Endpoint:** `/user/sso/discord/login`
- **HTTP Method:** GET
- **Short Description:** Redirects user to Discord OAuth login page for authentication.
- **Dependency/Auth:** None
- **Error Codes:**
  - 500: Internal server error (URL generation failure)
- **Notes:** Used to initiate Discord SSO login flow.

---

## 8. Discord SSO Callback

- **Endpoint:** `/user/sso/discord/callback`
- **HTTP Method:** GET
- **Short Description:** Handles Discord OAuth callback, exchanges code for access token, fetches user info, and logs in or creates user.
- **Dependency/Auth:** None
- **Error Codes:**
  - 400: Missing code, token exchange failed, failed to fetch Discord user info, no access_token returned by Discord
  - 500: Internal server error
- **Notes:** Sets JWT cookie and redirects to docs. Creates or updates user in SSOUserBase.

---

## 9. Slack SSO Login

- **Endpoint:** `/user/sso/slack/login`
- **HTTP Method:** GET
- **Short Description:** Redirects user to Slack OAuth login page for authentication.
- **Dependency/Auth:** None
- **Error Codes:**
  - 500: Internal server error (URL generation failure)
- **Notes:** Used to initiate Slack SSO login flow.

---

## 10. Slack SSO Callback

- **Endpoint:** `/user/sso/slack/callback`
- **HTTP Method:** GET
- **Short Description:** Handles Slack OAuth callback, exchanges code for access token, fetches user info, and logs in or creates user.
- **Dependency/Auth:** None
- **Error Codes:**
  - 400: Missing code, token exchange failed, failed to fetch Slack user info, no access_token returned by Slack
  - 500: Internal server error
- **Notes:** Sets JWT cookie and redirects to docs. Creates or updates user in SSOUserBase.

---
