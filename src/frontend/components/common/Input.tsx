import React, { useState } from 'react';
import classNames from 'classnames';
import { InputProps } from 'src/shared/types/index';

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
  error = false,
  helperText,
  label,
  fullWidth = false,
  startAdornment,
  endAdornment,
  className,
  ...rest
}) => {
  const [inputId] = useState(() => `excel-input-${Math.random().toString(36).substr(2, 9)}`);

  const inputClassName = classNames(
    'excel-input',
    {
      'excel-input--full-width': fullWidth,
      'excel-input--error': error,
      'excel-input--disabled': disabled,
      'excel-input--readonly': readOnly,
    },
    className
  );

  const containerClassName = classNames(
    'excel-input-container',
    {
      'excel-input-container--full-width': fullWidth,
    }
  );

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className="excel-input__label">
          {label}
        </label>
      )}
      <div className="excel-input__wrapper">
        {startAdornment && (
          <div className="excel-input__adornment excel-input__adornment--start">
            {startAdornment}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={inputClassName}
          aria-invalid={error}
          aria-describedby={helperText ? `${inputId}-helper-text` : undefined}
          {...rest}
        />
        {endAdornment && (
          <div className="excel-input__adornment excel-input__adornment--end">
            {endAdornment}
          </div>
        )}
      </div>
      {helperText && (
        <p
          id={`${inputId}-helper-text`}
          className={classNames('excel-input__helper-text', {
            'excel-input__helper-text--error': error,
          })}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};