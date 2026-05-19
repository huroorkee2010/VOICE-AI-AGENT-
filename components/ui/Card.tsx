import React from 'react';
import classNames from 'classnames';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
  glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, gradient = false, glass = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames(
          'rounded-xl transition-all duration-200',
          glass
            ? 'bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10'
            : 'bg-dark-800 border border-dark-700 hover:border-dark-600',
          gradient && 'bg-gradient-to-br from-dark-800 via-dark-800 to-dark-900',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
