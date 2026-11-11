import React from 'react';

interface PromoBadge3DProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PromoBadge3D: React.FC<PromoBadge3DProps> = ({ text, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[9px] px-2 py-0.5 shadow-sm',
    md: 'text-xs px-3 py-1 shadow-md',
    lg: 'text-sm px-4 py-1.5 shadow-lg',
  };

  return (
    <div
      className={`inline-flex items-center justify-center font-black tracking-wider uppercase rounded-full text-white ${sizeClasses[size]} ${className}`}
      style={{
        background: 'linear-gradient(180deg, #FFE082 0%, #FFB300 20%, #E65100 80%, #BF360C 100%)',
        border: '2px solid #FFF',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.35), inset 0 2px 2px rgba(255, 255, 255, 0.8), inset 0 -2px 2px rgba(0, 0, 0, 0.4)',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
      }}
    >
      <span className="drop-shadow-sm">{text}</span>
    </div>
  );
};
