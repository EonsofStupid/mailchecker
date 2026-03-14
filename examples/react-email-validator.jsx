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

import { useState, useCallback, useId } from "react";
import MailChecker from "mailchecker";

/**
 * Validate an email and return an error message (or empty string if valid).
 * MailChecker.isValid() checks both format and disposable domains in one call.
 * @param {string} email
 * @returns {string} Error message, or "" if valid.
 */
export function validateEmail(email) {
  if (!email) return "";
  if (!MailChecker.isValid(email)) {
    return "Please enter a valid, permanent email address. Disposable or temporary emails are not accepted.";
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
 *   - id: optional HTML id for the input element (auto-generated if omitted)
 */
export default function EmailValidator({
  onValidEmail,
  placeholder = "you@example.com",
  className = "",
  inputClassName = "",
  label = "Email",
  id,
}) {
  const generatedId = useId();
  const inputId = id || `${generatedId}-email`;
  const errorId = `${inputId}-error`;
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
          htmlFor={inputId}
          style={{ display: "block", marginBottom: "0.25rem", fontWeight: 500 }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type="email"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={inputClassName}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
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
          id={errorId}
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
