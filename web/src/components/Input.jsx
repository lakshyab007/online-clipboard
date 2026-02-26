import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function Input({
  label,
  error,
  className = '',
  type = 'text',
  id,
  helperText,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const isPasswordField = type === 'password';
  const displayType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={displayType}
          className={`
            block w-full px-4 py-2.5 border-2 rounded-lg
            placeholder-slate-400 text-slate-900
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'}
            ${isPasswordField ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors p-1"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm font-medium text-red-600 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
}
