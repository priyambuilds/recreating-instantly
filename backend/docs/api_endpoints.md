# API Endpoint Documentation

## Users
- POST /user/signup
- PUT /user/update
- PUT /user/update-password/{email}
- GET /user/me
- GET /user/read/{username}
- DELETE /user/delete/me
- POST /user/login
- POST /user/logout
- POST /user/disable
- POST /user/enable

## Users Admin
- GET /admin/users/readall
- DELETE /admin/users/delete/me

## SSO
- GET /user/sso/google/login
- GET /user/sso/google/callback
- GET /user/sso/github/login
- GET /user/sso/github/callback
- GET /user/sso/discord/login
- GET /user/sso/discord/callback
- GET /user/sso/slack/login
- GET /user/sso/slack/callback
- GET /user/sso/x/login
- GET /user/sso/x/callback

## OTP
- POST /user/otp/send
- POST /user/otp/resend
- POST /user/otp/verify

## Contact
- POST /contact/lead

## Stripe Subscriptions
- GET /subscriptions/stripe/basic
- GET /subscriptions/stripe/pro
- GET /subscriptions/stripe/business
- GET /subscriptions/stripe/enterprise

## Mock Mail APIs
- GET /mailserver/email/draft
- GET /mailserver/email/sent
- GET /mailserver/email/soft-bounce
- GET /mailserver/email/hard-bounce
- GET /mailserver/email/received
- POST /mailserver/email/success
- GET /mailserver/email/analytics

## Mock Contacts APIs
- GET /mailserver/contacts/total
- GET /mailserver/contacts/lists
- GET /mailserver/contacts/emailed
- GET /mailserver/contacts/replied
- GET /mailserver/contacts/blocked
- GET /mailserver/contacts/active
- GET /mailserver/contacts/inactive
- GET /mailserver/contacts/analytics

## Mock Finance APIs
- GET /mailserver/finance/spent
- GET /mailserver/finance/received
- GET /mailserver/finance/roi
- GET /mailserver/finance/mmr
- GET /mailserver/finance/analytics

## Email Analytics
- POST /analytics/email/event
- GET /analytics/email/summary

## Contact Analytics
- POST /analytics/contacts/event
- GET /analytics/contacts/summary

## Finance Analytics
- POST /analytics/finance/event
- GET /analytics/finance/summary

## Health
- GET /health

## Root
- GET /
