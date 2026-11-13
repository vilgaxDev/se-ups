import React from 'react';

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'lime';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  className = '',
  dot = false,
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
  }[size];

  const variantStyles = {
    success: 'bg-[#E8F4ED] text-[#167447] border border-[#167447]/20',
    warning: 'bg-[#FEF6EE] text-[#A96B19] border border-[#A96B19]/20',
    error: 'bg-[#FDF2F2] text-[#C13F43] border border-[#C13F43]/20',
    info: 'bg-[#EFF8FF] text-[#326D9A] border border-[#326D9A]/20',
    neutral: 'bg-[#F5F8F3] text-[#627168] border border-[#E3EAE4]',
    lime: 'bg-[#EDF8C9] text-[#123C30] border border-[#D6F36A]',
  }[variant];

  const dotColors = {
    success: 'bg-[#167447]',
    warning: 'bg-[#A96B19]',
    error: 'bg-[#C13F43]',
    info: 'bg-[#326D9A]',
    neutral: 'bg-[#89968E]',
    lime: 'bg-[#146B50]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-medium ${sizeStyles} ${variantStyles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors}`} />}
      {children}
    </span>
  );
};
