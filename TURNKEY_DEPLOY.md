# MailChecker — Turnkey Deployment Guide for Bolt & Lovable

> **What is MailChecker?** A free, open-source library that checks whether an email address is real or from a throwaway/disposable email service (like Yopmail, Guerrilla Mail, 10MinuteMail, etc.). It validates email format **and** blocks over 55,000 known temporary email domains.

This guide is designed for **non-technical users** building apps on [Bolt.new](https://bolt.new) or [Lovable.dev](https://lovable.dev). You don't need to know how to code — just copy-paste the prompts below into your AI builder and it will do the rest.

---

## Table of Contents

- [Why Use MailChecker?](#why-use-mailchecker)
- [Quick Start — Lovable](#quick-start--lovable)
- [Quick Start — Bolt.new](#quick-start--boltnew)
- [Prompt Templates](#prompt-templates)
  - [Basic: Add Email Validation to a Form](#1-basic-add-email-validation-to-a-form)
  - [Full: Signup Form with Disposable Email Blocking](#2-full-signup-form-with-disposable-email-blocking)
  - [Advanced: Block Custom Domains](#3-advanced-block-custom-domains)
  - [API Route: Server-Side Validation](#4-api-route-server-side-email-validation)
- [Example Component (Copy-Paste Ready)](#example-component-copy-paste-ready)
- [How It Works](#how-it-works)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

---

## Why Use MailChecker?

- **Block fake signups** — Stop users from registering with throwaway emails
- **Improve deliverability** — Only collect emails you can actually reach
- **Zero config** — Works out of the box, no API keys needed
- **Free & open-source** — MIT licensed, no usage limits
- **55,000+ blocked domains** — Continuously updated by the community

---

## Quick Start — Lovable

1. Open your project in [Lovable](https://lovable.dev)
2. Copy one of the [Prompt Templates](#prompt-templates) below
3. Paste it into the Lovable chat
4. Lovable will install `mailchecker` and create the component for you
5. Done! Your form now blocks disposable emails

## Quick Start — Bolt.new

1. Open your project in [Bolt.new](https://bolt.new)
2. Copy one of the [Prompt Templates](#prompt-templates) below
3. Paste it into the Bolt prompt
4. Bolt will install `mailchecker` and wire everything up
5. Done! Your form now blocks disposable emails

---

## Prompt Templates

Copy-paste any of these prompts directly into Bolt or Lovable. They are self-contained instructions that the AI will follow to integrate MailChecker into your project.

### 1. Basic: Add Email Validation to a Form

> Use this if you already have a form and just want to add email validation.

```text
Add email validation to my form using the "mailchecker" npm package.

Install mailchecker:
  npm install mailchecker

Then, in my form's email field handler, import and use it like this:

  import MailChecker from "mailchecker";

When the user submits the form or blurs the email field, validate:
  1. Check that the email is not empty
  2. Use MailChecker.isValid(email) to check if the email is valid AND not from a disposable/throwaway service
  3. If MailChecker.isValid() returns false, show an error message: "Please use a real email address. Temporary or disposable emails are not allowed."
  4. If valid, proceed with form submission

Do not use any external API for this — mailchecker works entirely offline.
```

### 2. Full: Signup Form with Disposable Email Blocking

> Use this to create a complete signup form from scratch with built-in email validation.

```text
Create a signup form component with email validation that blocks disposable/temporary emails.

Install the "mailchecker" npm package:
  npm install mailchecker

Build a form with these fields:
  - Full Name (required)
  - Email (required, validated with mailchecker)
  - Password (required, minimum 8 characters)
  - Submit button

For the email field:
  1. Import mailchecker: import MailChecker from "mailchecker";
  2. On blur and on submit, run: MailChecker.isValid(email)
  3. If isValid returns false, display an inline error: "Please use a permanent email address. Disposable or temporary emails are not accepted."
  4. Style the error state with a red border and error text

The form should:
  - Disable the submit button until all validations pass
  - Show real-time validation feedback
  - Use existing project styling (Tailwind/shadcn if available)

mailchecker has zero dependencies and works entirely client-side — no API calls needed.
```

### 3. Advanced: Block Custom Domains

> Use this if you want to block specific domains in addition to the built-in list.

```text
Add email validation with custom blocked domains using the "mailchecker" npm package.

Install mailchecker:
  npm install mailchecker

In my email validation logic:
  1. Import: import MailChecker from "mailchecker";
  2. Add custom blocked domains on app initialization:
     MailChecker.addCustomDomains(["example.com", "mycompany-test.com"]);
  3. Then validate with: MailChecker.isValid(email)
  4. Show appropriate error messages:
     - If email format is invalid: "Please enter a valid email address."
     - If domain is blocked: "This email domain is not accepted. Please use a different email."

The addCustomDomains() call only needs to happen once (e.g., in your app's entry point or a utility module).
```

### 4. API Route: Server-Side Email Validation

> Use this to validate emails on the server side (Node.js/Next.js API routes).

```text
Create a server-side API endpoint that validates emails using the "mailchecker" npm package.

Install mailchecker:
  npm install mailchecker

Create an API route (e.g., /api/validate-email) that:
  1. Accepts a POST request with JSON body: { "email": "user@example.com" }
  2. Imports mailchecker: const MailChecker = require("mailchecker");
  3. Validates the email with MailChecker.isValid(email)
  4. Returns JSON response:
     - If valid: { "valid": true }
     - If invalid: { "valid": false, "reason": "disposable" } or { "valid": false, "reason": "invalid_format" }

Use this in my frontend form to validate the email server-side before creating the user account.
mailchecker works offline with no external API calls — it bundles a list of 55,000+ throwaway domains.
```

---

## Example Component (Copy-Paste Ready)

If you prefer to drop in code directly, here is a ready-to-use React component. See also [`examples/react-email-validator.jsx`](./examples/react-email-validator.jsx) for the full file.

```jsx
import { useState } from "react";
import MailChecker from "mailchecker";

export default function EmailInput({ onValidEmail }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validate = (value) => {
    setEmail(value);
    if (!value) {
      setError("");
      return;
    }
    if (!MailChecker.isValid(value)) {
      setError(
        "Please use a real email address. Temporary or disposable emails are not allowed."
      );
    } else {
      setError("");
      if (onValidEmail) onValidEmail(value);
    }
  };

  return (
    <div>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => validate(e.target.value)}
        placeholder="you@example.com"
        style={{ borderColor: error ? "red" : undefined }}
      />
      {error && <p style={{ color: "red", fontSize: "0.875rem" }}>{error}</p>}
    </div>
  );
}
```

---

## How It Works

```
User types email ──▶ MailChecker.isValid(email) ──▶ true/false
                         │
                         ├── Checks email format (regex)
                         └── Checks domain against 55,000+ blocked domains
```

1. **Format check** — Is the email syntactically valid? (e.g., has `@`, valid domain structure)
2. **Domain check** — Is the domain on the blocklist? (e.g., `yopmail.com`, `guerrillamail.com`)
3. Returns `true` only if both checks pass

No API keys. No network requests. Everything runs in your app's JavaScript bundle.

---

## Troubleshooting

### "Module not found" or "Cannot find module 'mailchecker'"

The package isn't installed yet. In your Bolt or Lovable prompt, make sure to include:
```
Install the "mailchecker" npm package: npm install mailchecker
```

### "MailChecker is not defined"

Make sure the import is at the top of your file:
```js
import MailChecker from "mailchecker";
```

### The form accepts a disposable email that should be blocked

MailChecker's blocklist is very large (55,000+ domains) but new disposable services appear regularly. You can block additional domains:
```js
MailChecker.addCustomDomains(["new-throwaway-service.com"]);
```

### My Lovable/Bolt project uses TypeScript

MailChecker ships with TypeScript definitions. The import works the same way:
```ts
import MailChecker from "mailchecker";
// MailChecker.isValid(email: string): boolean
```

### Bundle size concern

MailChecker's domain list is large (~1 MB). For most Bolt/Lovable projects this is fine. If you need a smaller bundle, consider server-side validation only (see [Prompt #4](#4-api-route-server-side-email-validation)).

---

## FAQ

**Q: Does this cost anything?**
A: No. MailChecker is free and open-source (MIT license).

**Q: Do I need an API key?**
A: No. Everything is bundled in the package — no external services needed.

**Q: Does it work offline?**
A: Yes. The full blocklist is included in the package.

**Q: Can I use this with React / Next.js / Vite?**
A: Yes. It works with any JavaScript framework. Bolt and Lovable both use React/Vite under the hood.

**Q: How do I keep the blocklist up to date?**
A: Run `npm update mailchecker` periodically, or set the version to `latest` in your `package.json`.

**Q: Can I add my own blocked domains?**
A: Yes. Use `MailChecker.addCustomDomains(["domain1.com", "domain2.com"])`.

---

## Links

- [MailChecker on npm](https://www.npmjs.com/package/mailchecker)
- [Full documentation (README)](./README.md)
- [Disposable domain list](./list.txt)
- [Bolt.new](https://bolt.new)
- [Lovable.dev](https://lovable.dev)
