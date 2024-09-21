import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { DropdownProps, DropdownItem } from 'src/shared/types/index';

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  placeholder = 'Select an option',
  value,
  onChange,
  disabled = false,
  error = false,
  helperText,
  fullWidth = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(
    items.find((item) => item.value === value) || null
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dropdownClasses = classNames(
    'dropdown',
    {
      'dropdown--fullwidth': fullWidth,
      'dropdown--disabled': disabled,
      'dropdown--error': error,
    },
    className
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    setSelectedItem(item);
    setIsOpen(false);
    onChange(item.value);
  };

  return (
    <div className={dropdownClasses} ref={dropdownRef}>
      <button
        ref={buttonRef}
        className="dropdown__button"
        onClick={toggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedItem ? selectedItem.label : placeholder}
      </button>
      {isOpen && (
        <ul className="dropdown__menu" role="listbox">
          {items.map((item) => (
            <li
              key={item.value}
              className={classNames('dropdown__item', {
                'dropdown__item--selected': item.value === selectedItem?.value,
              })}
              onClick={() => handleItemClick(item)}
              role="option"
              aria-selected={item.value === selectedItem?.value}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
      {helperText && <p className="dropdown__helper-text">{helperText}</p>}
    </div>
  );
};