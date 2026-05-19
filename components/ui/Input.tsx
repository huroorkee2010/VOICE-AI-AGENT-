import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, icon, ...props }, ref) => {
    const inputClassName = [
      'w-full px-4 py-2 rounded-lg bg-dark-700 border border-dark-600 text-white placeholder-dark-400',
      'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
      'transition-all duration-200',
      error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
      icon ? 'pl-10' : '',
      className || '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">
              {icon}
            </div>
          )}
          <input ref={ref} className={inputClassName} {...props} />
        </div>
        {error && (
          <p className="text-red-400 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
