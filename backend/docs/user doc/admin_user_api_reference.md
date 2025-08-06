## 1. Read All Users
- **Endpoint:** `/admin/users/readall`
- **HTTP Method:** GET
- **Short Description:** Retrieve a list of all users in the system.
- **Dependency/Auth:** JWT Bearer token required (admin access recommended)
- **Error Codes:**
  - 401: Unauthorized (missing/invalid token)
  - 500: Internal server error
- **Notes:** Returns a list of user public schemas. Intended for admin use only.

---

## 2. Delete User
- **Endpoint:** `/admin/users/delete/me`
- **HTTP Method:** DELETE
- **Short Description:** Delete a user by email after confirmation.
- **Dependency/Auth:** JWT Bearer token required (admin access recommended)
- **Error Codes:**
  - 400: Deletion cancelled, email not found
  - 401: Unauthorized (missing/invalid token)
  - 500: Internal server error
- **Notes:** Requires a confirmation object in the request body and the user's email as a parameter. Intended for admin use only.

---
