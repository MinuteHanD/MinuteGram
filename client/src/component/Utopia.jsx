import React from 'react';

export const ModernCard = React.memo(({ children, className = '', ...props }) => (
    <div
      className={`bg-zinc-900/60 backdrop-blur-lg border border-zinc-700/70 rounded-2xl shadow-xl shadow-black/30 ${className}`}
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
    const baseStyles = 'rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-98';
    const variants = {
      primary: 'bg-gradient-to-br from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-lg shadow-teal-500/20',
      secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700',
      ghost: 'hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-100',
      danger: 'bg-red-600 hover:bg-red-500 text-white',
      outline: 'border border-teal-500 text-teal-400 hover:bg-teal-500/10'
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5',
      lg: 'px-7 py-3 text-lg'
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
      className={`p-2.5 rounded-lg group ${active ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20' : 'hover:bg-zinc-800/70 text-zinc-400 hover:text-zinc-100'} transition-all flex items-center justify-center gap-2`}
      onClick={onClick}
      {...props}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-100'}`} />
      {label && <span className="text-sm font-medium">{label}</span>}
    </button>
  ));
  
  export const ModernInput = React.memo(({ label, id, type = 'text', className = '', ...props }) => (
    <div className="space-y-1">
      {label && <label htmlFor={id} className="block text-sm font-medium text-zinc-400">{label}</label>}
      <input
        id={id}
        type={type}
        className={`w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors duration-200 ${className}`}
        {...props}
      />
    </div>
  ));
  
  export const ModernTextarea = React.memo(({ label, id, className = '', ...props }) => (
    <div className="space-y-1">
      {label && <label htmlFor={id} className="block text-sm font-medium text-zinc-400">{label}</label>}
      <textarea
        id={id}
        rows="4"
        className={`w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-y transition-colors duration-200 ${className}`}
        {...props}
      ></textarea>
    </div>
  ));