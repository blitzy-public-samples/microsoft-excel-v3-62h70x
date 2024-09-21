import React from 'react';
import classNames from 'classnames';
import { ButtonProps } from 'src/shared/types/index';

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  className,
}) => {
  const buttonClasses = classNames(
    'button',
    `button--${variant}`,
    `button--${size}`,
    {
      'button--full-width': fullWidth,
      'button--disabled': disabled,
    },
    className
  );

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {startIcon && <span className="button__start-icon">{startIcon}</span>}
      <span className="button__content">{children}</span>
      {endIcon && <span className="button__end-icon">{endIcon}</span>}
    </button>
  );
};

// Add comments for each step
// Step 1: Destructure props with default values
// Step 2: Create a className string using classNames utility
// Step 3: Return a button element with appropriate attributes and styles
// Step 4: Render children, startIcon, and endIcon as needed