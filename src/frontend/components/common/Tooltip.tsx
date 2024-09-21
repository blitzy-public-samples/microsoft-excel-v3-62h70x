import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { TooltipProps } from 'src/shared/types/index';

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 300,
  className,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const tooltipClasses = classNames(
    'tooltip',
    `tooltip--${position}`,
    className,
    { 'tooltip--visible': isVisible }
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const childElement = React.cloneElement(children, {
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
  });

  return (
    <div className="tooltip-wrapper">
      {childElement}
      {isVisible && (
        <div className={tooltipClasses} ref={tooltipRef}>
          {content}
        </div>
      )}
    </div>
  );
};