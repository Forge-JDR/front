import React, { useEffect, useId, useRef } from "react";
import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  X,
  Dices,
} from "lucide-react";
import { Link } from "react-router-dom";

export function Brand({ compact = false }) {
  return (
    <Link className="brand" to="/" aria-label="Forge JDR — accueil">
      <span className="brand-mark">
        <Dices size={23} strokeWidth={1.5} />
      </span>
      {!compact && (
        <span>
          forge<span className="brand-suffix">jdr</span>
          <small>L'ATELIER DES AVENTURES</small>
        </span>
      )}
    </Link>
  );
}
export function Button({
  variant = "primary",
  busy = false,
  icon: Icon,
  children,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`ui-button ui-button--${variant} ${className}`}
      {...props}
      disabled={busy || props.disabled}
      aria-busy={busy || undefined}
    >
      {busy ? (
        <LoaderCircle className="spin" size={17} />
      ) : (
        Icon && <Icon size={17} aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
export function Field({
  label,
  hint,
  error,
  as: Element = "input",
  className = "",
  id,
  ...props
}) {
  const generated = useId();
  const fieldId = id || generated;
  return (
    <div className={`ui-field ${className}`}>
      <label htmlFor={fieldId}>
        {label}
        {props.required && <span aria-hidden="true"> *</span>}
      </label>
      <Element
        {...props}
        aria-label={typeof label === "string" ? label : undefined}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${fieldId}-help` : undefined}
      />
      {(hint || error) && (
        <p
          id={`${fieldId}-help`}
          className={error ? "field-error" : "field-hint"}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
export function Notice({ children, variant = "error" }) {
  if (!children) return null;
  const Icon = variant === "error" ? AlertCircle : CheckCircle2;
  return (
    <div
      className={`ui-notice ui-notice--${variant}`}
      role={variant === "error" ? "alert" : "status"}
    >
      <Icon size={18} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
export function EmptyState({ icon: Icon = Dices, title, children, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={26} strokeWidth={1.5} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}
export function Modal({
  title,
  description,
  children,
  onClose,
  busy = false,
  wide = false,
}) {
  const ref = useRef();
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute("open", "");
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`ui-dialog ${wide ? "ui-dialog--wide" : ""}`}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
    >
      <header className="dialog-header">
        <div>
          <span className="eyebrow">VOTRE ATELIER</span>
          <h2 id={titleId}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <Button
          variant="ghost"
          aria-label="Fermer"
          icon={X}
          disabled={busy}
          onClick={onClose}
        />
      </header>
      <div className="dialog-body">{children}</div>
    </dialog>
  );
}
export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Landscape({ seed = 0, className = "" }) {
  const palettes = [
    ["#ddd6c5", "#b6bca8", "#667967", "#334b42"],
    ["#e6d2b9", "#ceb395", "#9d806a", "#68534a"],
    ["#d5dfe0", "#adbfc2", "#6b8a94", "#3f5b65"],
  ];
  const colors = palettes[seed % palettes.length];
  return (
    <svg
      className={`landscape ${className}`}
      viewBox="0 0 400 150"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="400" height="150" fill={colors[0]} />
      <circle cx="310" cy="39" r="21" fill="#fbf5de" />
      <path
        d="M0 90 80 30 143 98 206 49 290 103 348 61 400 89V150H0Z"
        fill={colors[1]}
      />
      <path
        d="M0 106 57 84 123 117 220 83 307 127 400 100V150H0Z"
        fill={colors[2]}
      />
      <path d="M0 131Q89 104 169 134T400 130V150H0Z" fill={colors[3]} />
      <path
        d="M230 150Q205 120 230 110T220 85"
        fill="none"
        stroke="#e8e6cf"
        strokeWidth="3"
        opacity=".6"
      />
    </svg>
  );
}
