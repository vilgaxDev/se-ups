import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#123C30]"
          >
            {label}
            {props.required && <span className="text-[#C13F43] ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-[#89968E]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-xl bg-white border text-sm text-[#17251F] placeholder:text-[#89968E] transition-all duration-150 h-11 ${
              leftIcon ? 'pl-10' : 'pl-3.5'
            } ${rightIcon ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-[#C13F43] focus:border-[#C13F43] focus:ring-2 focus:ring-[#C13F43]/20'
                : 'border-[#E3EAE4] hover:border-[#89968E] focus:border-[#146B50] focus:ring-2 focus:ring-[#146B50]/15'
            } outline-none disabled:bg-[#F5F8F3] disabled:text-[#89968E] disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-[#89968E] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#C13F43] font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-[#627168]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#123C30]"
          >
            {label}
            {props.required && <span className="text-[#C13F43] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`w-full appearance-none rounded-xl bg-white border text-sm text-[#17251F] transition-all duration-150 h-11 px-3.5 pr-10 ${
              error
                ? 'border-[#C13F43] focus:border-[#C13F43] focus:ring-2 focus:ring-[#C13F43]/20'
                : 'border-[#E3EAE4] hover:border-[#89968E] focus:border-[#146B50] focus:ring-2 focus:ring-[#146B50]/15'
            } outline-none disabled:bg-[#F5F8F3] disabled:text-[#89968E] cursor-pointer ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#627168]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && <p className="text-xs text-[#C13F43] font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-[#627168]">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, rows = 3, ...props }, ref) => {
    const areaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={areaId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#123C30]"
          >
            {label}
            {props.required && <span className="text-[#C13F43] ml-1">*</span>}
          </label>
        )}
        <textarea
          id={areaId}
          ref={ref}
          rows={rows}
          className={`w-full rounded-xl bg-white border text-sm text-[#17251F] placeholder:text-[#89968E] p-3 transition-all duration-150 ${
            error
              ? 'border-[#C13F43] focus:border-[#C13F43] focus:ring-2 focus:ring-[#C13F43]/20'
              : 'border-[#E3EAE4] hover:border-[#89968E] focus:border-[#146B50] focus:ring-2 focus:ring-[#146B50]/15'
          } outline-none disabled:bg-[#F5F8F3] disabled:text-[#89968E] ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[#C13F43] font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-[#627168]">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
