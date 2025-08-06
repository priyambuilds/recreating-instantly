## 1. Send OTP
- **Endpoint:** `/user/otp/send`
- **HTTP Method:** POST
- **Short Description:** Generate and send a new OTP to the specified email address.
- **Dependency/Auth:** None
- **Error Codes:**
  - 500: Internal server error
- **Notes:** Returns the OTP object (for dev/testing). In production, OTP is sent to the user's email.

---

## 2. Resend OTP
- **Endpoint:** `/user/otp/resend`
- **HTTP Method:** POST
- **Short Description:** Remove any existing OTPs for the email and send a new OTP.
- **Dependency/Auth:** None
- **Error Codes:**
  - 500: Internal server error
- **Notes:** Useful for users who did not receive or lost the previous OTP. Returns the new OTP object (for dev/testing).

---

## 3. Verify OTP
- **Endpoint:** `/user/otp/verify`
- **HTTP Method:** POST
- **Short Description:** Verify the OTP for the given email. Marks user as email_verified if successful.
- **Dependency/Auth:** None
- **Error Codes:**
  - 404: OTP not found
  - 400: Invalid OTP, OTP has expired
  - 500: Internal server error
- **Notes:** Deletes the OTP after successful verification. Returns a success message.

---
