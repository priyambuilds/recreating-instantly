## 1. List Subscriptions

- **Endpoint:** `/subscriptions/pricing`
- **HTTP Method:** GET
- **Short Description:** Retrieve a list of all available subscription plans.
- **Dependency/Auth:** None
- **Error Codes:**
  - 500: Internal server error
- **Notes:** Returns a list of subscription plan objects.

---

## 2. Get Subscription by ID

- **Endpoint:** `/subscriptions/{sub_id}`
- **HTTP Method:** GET
- **Short Description:** Retrieve details for a specific subscription plan by its ID.
- **Dependency/Auth:** None
- **Error Codes:**
  - 404: Subscription not found
  - 500: Internal server error
- **Notes:** Returns the subscription plan object for the given ID.

---

## 3. Get Basic Plan Pricing (Stripe)

- **Endpoint:** `/subscriptions/stripe/basic`
- **HTTP Method:** GET
- **Short Description:** Retrieve pricing and details for the Basic Stripe subscription plan.
- **Dependency/Auth:** None
- **Error Codes:**
  - 502: Stripe error (failed to fetch plan)
- **Notes:** Returns plan details from Stripe.

---

## 4. Get Pro Plan Pricing (Stripe)

- **Endpoint:** `/subscriptions/stripe/pro`
- **HTTP Method:** GET
- **Short Description:** Retrieve pricing and details for the Pro Stripe subscription plan.
- **Dependency/Auth:** None
- **Error Codes:**
  - 502: Stripe error (failed to fetch plan)
- **Notes:** Returns plan details from Stripe.

---

## 5. Get Business Plan Pricing (Stripe)

- **Endpoint:** `/subscriptions/stripe/business`
- **HTTP Method:** GET
- **Short Description:** Retrieve pricing and details for the Business Stripe subscription plan.
- **Dependency/Auth:** None
- **Error Codes:**
  - 502: Stripe error (failed to fetch plan)
- **Notes:** Returns plan details from Stripe.

---

## 6. Get Enterprise Plan Pricing (Stripe)

- **Endpoint:** `/subscriptions/stripe/enterprise`
- **HTTP Method:** GET
- **Short Description:** Redirects to contact/lead page for Enterprise plan inquiries.
- **Dependency/Auth:** None
- **Error Codes:**
  - 302: Redirect (expected behavior)
- **Notes:** No plan details returned; user is redirected to contact form.

---
