## 1. Signup

- **Endpoint:** `/user/signup`
- **HTTP Method:** POST
- **Short Description:** Register a new user (email, username, fullname, phone, password).
- **Dependency/Auth:** None
- **Error Codes:**
  - 400: Email already registered, username taken, phone exists, weak password
  - 500: Internal server error
- **Notes:** Sends OTP to email after signup. Returns full user object.

---

## 2. Login

- **Endpoint:** `/user/login`
- **HTTP Method:** POST
- **Short Description:** Authenticate user and return JWT access token.
- **Dependency/Auth:** None
- **Error Codes:**
  - 400: Invalid login (wrong username or password)
  - 500: Internal server error
- **Notes:** Returns JWT token for authentication in future requests.

---

## 3. Get Current User

- **Endpoint:** `/user/me`
- **HTTP Method:** GET
- **Short Description:** Get details of the currently authenticated user.
- **Dependency/Auth:** JWT Bearer token required
- **Error Codes:**
  - 401: Unauthorized (missing/invalid token)
  - 403: Inactive user
  - 500: Internal server error
- **Notes:** Returns user object for the current session.

---

## 4. Update User

- **Endpoint:** `/user/update`
- **HTTP Method:** PUT
- **Short Description:** Update current user's details (username, fullname, phone).
- **Dependency/Auth:** JWT Bearer token required
- **Error Codes:**
  - 401: Unauthorized (missing/invalid token)
  - 403: Inactive user
  - 400: Email confirmation does not match
  - 500: Internal server error
- **Notes:** Requires email confirmation query param to match current user's email.

---

## 5. Update Password

- **Endpoint:** `/user/update-password/{email}`
- **HTTP Method:** PUT
- **Short Description:** Update password for the user with the given email.
- **Dependency/Auth:** JWT Bearer token required
- **Error Codes:**
  - 401: Unauthorized (missing/invalid token)
  - 404: User not found
  - 400: Incorrect old password
  - 500: Internal server error
- **Notes:** Old password must match. Returns success message.

---

## 6. Read User by Username

- **Endpoint:** `/user/read/{username}`
- **HTTP Method:** GET
- **Short Description:** Get user details by username.
- **Dependency/Auth:** JWT Bearer token required
- **Error Codes:**
  - 401: Unauthorized (missing/invalid token)
  - 404: User not found
  - 500: Internal server error
- **Notes:** Returns user object for the given username.

---

## 7. Delete User

- **Endpoint:** `/user/delete/me`
- **HTTP Method:** DELETE
- **Short Description:** Delete the currently authenticated user after confirmation.
- **Dependency/Auth:** JWT Bearer token required
- **Error Codes:**
  - 401: Unauthorized (missing/invalid token)
  - 400: Account deletion not confirmed, passwords do not match/incorrect
  - 500: Internal server error
- **Notes:** Requires password confirmation and delete_account flag in body.

---

## 8. Logout

- **Endpoint:** `/user/logout`
- **HTTP Method:** POST
- **Short Description:** Logout user (stateless JWT, client-side token removal).
- **Dependency/Auth:** JWT Bearer token required
- **Error Codes:**
  - 401: Unauthorized (missing/invalid token)
  - 500: Internal server error
- **Notes:** Client should remove token after logout.

---

## 9. Disable User

- **Endpoint:** `/user/disable`
- **HTTP Method:** POST
- **Short Description:** Disable the current user's account.
- **Dependency/Auth:** JWT Bearer token required
- **Error Codes:**
  - 401: Unauthorized (missing/invalid token)
  - 400: Incorrect password
  - 500: Internal server error
- **Notes:** Requires password in body. Sets user as inactive.

---

## 10. Enable User

- **Endpoint:** `/user/enable`
- **HTTP Method:** POST
- **Short Description:** Enable the current user's account.
- **Dependency/Auth:** JWT Bearer token required
- **Error Codes:**
  - 401: Unauthorized (missing/invalid token)
  - 400: Incorrect password
  - 500: Internal server error
- **Notes:** Requires password in body. Sets user as active.

---
