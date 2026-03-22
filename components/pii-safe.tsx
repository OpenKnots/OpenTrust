import { Fragment, type ReactNode } from "react";

const PHONE_RE =
  /(?:\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}|\+\d{7,15}\b/g;

/**
 * Renders a string with detected phone numbers visually blurred.
 * Hover to temporarily reveal. Works in both server and client components.
 */
export function PiiSafe({ children }: { children: string | null | undefined }) {
  if (!children) return null;

  const parts: ReactNode[] = [];
  let lastIndex = 0;

  PHONE_RE.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = PHONE_RE.exec(children)) !== null) {
    if (match.index > lastIndex) {
      parts.push(children.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={match.index} className="pii-blur" aria-label="Redacted">
        {match[0]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (parts.length === 0) return <>{children}</>;

  if (lastIndex < children.length) {
    parts.push(children.slice(lastIndex));
  }

  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </>
  );
}
