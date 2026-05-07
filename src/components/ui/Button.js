import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ children, onClick, variant = 'primary', className, disabled }) => {
  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-600 text-black font-bold',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    outline: 'bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black',
    ghost: 'bg-transparent hover:bg-white/10 text-white',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        'px-6 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
};
