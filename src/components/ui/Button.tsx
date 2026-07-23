import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  href?: string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  href,
  target,
  rel,
  icon,
  className = '',
  style,
  onClick,
  type = 'button',
  disabled = false,
}) => {
  const variantClass = variant === 'primary' ? 'btn-cta-primary' : 'btn-cta-secondary';
  const combinedClassName = `btn-cta ${variantClass} ${className}`;

  const defaultIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );

  const content = (
    <>
      <span>{children}</span>
      <span className="btn-icon-wrapper">
        {icon || defaultIcon}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={combinedClassName}
        style={style}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClassName}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
};
