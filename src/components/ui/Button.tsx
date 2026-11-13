import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'lime';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-5 py-2.5 gap-2.5 h-12',
  }[size];

  const variantStyles = {
    primary: 'bg-[#146B50] text-white hover:bg-[#123C30] focus-visible:ring-[#146B50] shadow-sm',
    secondary: 'bg-[#E8F4ED] text-[#123C30] hover:bg-[#d6eade] focus-visible:ring-[#146B50]',
    outline: 'border border-[#E3EAE4] bg-white text-[#17251F] hover:bg-[#F5F8F3] hover:border-[#89968E] focus-visible:ring-[#146B50]',
    ghost: 'text-[#627168] hover:bg-[#F5F8F3] hover:text-[#17251F] focus-visible:ring-[#146B50]',
    destructive: 'bg-[#C13F43] text-white hover:bg-[#a63438] focus-visible:ring-[#C13F43]',
    lime: 'bg-[#D6F36A] text-[#123C30] hover:bg-[#c9e85c] focus-visible:ring-[#123C30] font-semibold shadow-sm',
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
