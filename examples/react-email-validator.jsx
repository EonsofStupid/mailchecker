/**
 * EmailValidator — A drop-in React component powered by MailChecker.
 *
 * This component validates email addresses in real time and blocks
 * disposable/temporary email services (55,000+ domains).
 *
 * Usage:
 *   import EmailValidator from "./react-email-validator";
 *   <EmailValidator onValidEmail={(email) => console.log("Valid:", email)} />
 *
 * Installation:
 *   npm install mailchecker
 *
 * Works with: React, Next.js, Vite, Bolt.new, Lovable.dev
 * No API keys required. No network requests. Everything runs client-side.
 */

import { useState, useCallback } from "react";
import MailChecker from "mailchecker";

/**
 * Validate an email and return an error message (or empty string if valid).
 * @param {string} email
 * @returns {string} Error message, or "" if valid.
 */
export function validateEmail(email) {
  if (!email) return "";
  if (!MailChecker.isValid(email)) {
    // MailChecker returns false for both bad format and disposable domains
    if (!email.includes("@") || email.indexOf("@") === email.length - 1) {
      return "Please enter a valid email address.";
    }
    return "Disposable or temporary emails are not allowed. Please use a permanent email address.";
  }
  return "";
}

/**
 * EmailValidator React component.
 *
 * Props:
 *   - onValidEmail(email: string): called when the user enters a valid, non-disposable email
 *   - placeholder: input placeholder text (default: "you@example.com")
 *   - className: optional CSS class name for the wrapper div
 *   - inputClassName: optional CSS class name for the input element
 *   - label: optional label text (default: "Email")
 */
export default function EmailValidator({
  onValidEmail,
  placeholder = "you@example.com",
  className = "",
  inputClassName = "",
  label = "Email",
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setEmail(value);

      if (touched) {
        const err = validateEmail(value);
        setError(err);
        if (!err && value && onValidEmail) {
          onValidEmail(value);
        }
      }
    },
    [touched, onValidEmail]
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
    const err = validateEmail(email);
    setError(err);
    if (!err && email && onValidEmail) {
      onValidEmail(email);
    }
  }, [email, onValidEmail]);

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor="mailchecker-email"
          style={{ display: "block", marginBottom: "0.25rem", fontWeight: 500 }}
        >
          {label}
        </label>
      )}
      <input
        id="mailchecker-email"
        type="email"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={inputClassName}
        aria-invalid={!!error}
        aria-describedby={error ? "mailchecker-error" : undefined}
        style={{
          width: "100%",
          padding: "0.5rem",
          borderRadius: "0.375rem",
          border: `1px solid ${error ? "#ef4444" : "#d1d5db"}`,
          outline: "none",
        }}
      />
      {error && (
        <p
          id="mailchecker-error"
          role="alert"
          style={{
            color: "#ef4444",
            fontSize: "0.875rem",
            marginTop: "0.25rem",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
