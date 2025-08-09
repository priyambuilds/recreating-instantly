# API Endpoint Documentation (Full URLs)

Base URL: http://localhost:8000

## Users
- POST http://localhost:8000/user/signup
- PUT http://localhost:8000/user/update
- PUT http://localhost:8000/user/update-password/{email}
- GET http://localhost:8000/user/me
- GET http://localhost:8000/user/read/{username}
- DELETE http://localhost:8000/user/delete/me
- POST http://localhost:8000/user/login
- POST http://localhost:8000/user/logout
- POST http://localhost:8000/user/disable
- POST http://localhost:8000/user/enable

## Users Admin
- GET http://localhost:8000/admin/users/readall
- DELETE http://localhost:8000/admin/users/delete/me

## SSO
- GET http://localhost:8000/user/sso/google/login
- GET http://localhost:8000/user/sso/google/callback
- GET http://localhost:8000/user/sso/github/login
- GET http://localhost:8000/user/sso/github/callback
- GET http://localhost:8000/user/sso/discord/login
- GET http://localhost:8000/user/sso/discord/callback
- GET http://localhost:8000/user/sso/slack/login
- GET http://localhost:8000/user/sso/slack/callback
- GET http://localhost:8000/user/sso/x/login
- GET http://localhost:8000/user/sso/x/callback

## OTP
- POST http://localhost:8000/user/otp/send
- POST http://localhost:8000/user/otp/resend
- POST http://localhost:8000/user/otp/verify

## Contact
- POST http://localhost:8000/contact/lead

## Stripe Subscriptions
- GET http://localhost:8000/subscriptions/stripe/basic
- GET http://localhost:8000/subscriptions/stripe/pro
- GET http://localhost:8000/subscriptions/stripe/business
- GET http://localhost:8000/subscriptions/stripe/enterprise

## Mock Mail APIs
- GET http://localhost:8000/mailserver/email/draft
- GET http://localhost:8000/mailserver/email/sent
- GET http://localhost:8000/mailserver/email/soft-bounce
- GET http://localhost:8000/mailserver/email/hard-bounce
- GET http://localhost:8000/mailserver/email/received
- POST http://localhost:8000/mailserver/email/success
- GET http://localhost:8000/mailserver/email/analytics

## Mock Contacts APIs
- GET http://localhost:8000/mailserver/contacts/total
- GET http://localhost:8000/mailserver/contacts/lists
- GET http://localhost:8000/mailserver/contacts/emailed
- GET http://localhost:8000/mailserver/contacts/replied
- GET http://localhost:8000/mailserver/contacts/blocked
- GET http://localhost:8000/mailserver/contacts/active
- GET http://localhost:8000/mailserver/contacts/inactive
- GET http://localhost:8000/mailserver/contacts/analytics

## Mock Finance APIs
- GET http://localhost:8000/mailserver/finance/spent
- GET http://localhost:8000/mailserver/finance/received
- GET http://localhost:8000/mailserver/finance/roi
- GET http://localhost:8000/mailserver/finance/mmr
- GET http://localhost:8000/mailserver/finance/analytics

## Email Analytics
- POST http://localhost:8000/analytics/email/event
- GET http://localhost:8000/analytics/email/summary

## Contact Analytics
- POST http://localhost:8000/analytics/contacts/event
- GET http://localhost:8000/analytics/contacts/summary

## Finance Analytics
- POST http://localhost:8000/analytics/finance/event
- GET http://localhost:8000/analytics/finance/summary

## Health
- GET http://localhost:8000/health

## Root
- GET http://localhost:8000/
