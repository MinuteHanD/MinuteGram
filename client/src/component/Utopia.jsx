import React from 'react';

export const ModernCard = React.memo(({ children, className = '', ...props }) => (
    <div
      className={`bg-base-200 border border-base-300 rounded-lg shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  ));
  
  export const ModernButton = React.memo(({ 
    children, 
    variant = 'primary', 
    className = '', 
    type = 'button',
    disabled = false,
    size = 'md',
    onClick,
    ...props 
  }) => {
    const baseStyles = 'rounded-md font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
      primary: 'bg-primary hover:bg-primary-focus text-primary-content',
      secondary: 'bg-secondary hover:bg-secondary-focus text-secondary-content',
      ghost: 'hover:bg-base-300 text-base-content',
      danger: 'bg-error hover:bg-error/80 text-white',
      outline: 'border border-primary text-primary hover:bg-primary/10'
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    };
    
    return (
      <button 
        type={type} 
        disabled={disabled} 
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
        {...props}
      >
        {children}
      </button>
    );
  });
  
  export const ModernIconButton = React.memo(({ icon: Icon, label, active = false, onClick, className = '', ...props }) => (
    <button
      className={`p-2 rounded-md group ${active ? 'bg-primary text-primary-content' : 'hover:bg-base-300 text-base-content'} transition-all flex items-center justify-center gap-2`}
      onClick={onClick}
      {...props}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-primary-content' : 'text-base-content group-hover:text-primary-content'}`} />
      {label && <span className="text-sm font-medium">{label}</span>}
    </button>
  ));
  
  export const ModernInput = React.memo(({ label, id, type = 'text', className = '', ...props }) => (
    <div className="space-y-1">
      {label && <label htmlFor={id} className="block text-sm font-medium text-base-content/80">{label}</label>}
      <input
        id={id}
        type={type}
        className={`w-full p-2 rounded-md bg-base-200 border border-base-300 text-base-content focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors duration-200 ${className}`}
        {...props}
      />
    </div>
  ));
  
  export const ModernTextarea = React.memo(({ label, id, className = '', ...props }) => (
    <div className="space-y-1">
      {label && <label htmlFor={id} className="block text-sm font-medium text-base-content/80">{label}</label>}
      <textarea
        id={id}
        rows="4"
        className={`w-full p-2 rounded-md bg-base-200 border border-base-300 text-base-content focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-y transition-colors duration-200 ${className}`}
        {...props}
      ></textarea>
    </div>
  ));