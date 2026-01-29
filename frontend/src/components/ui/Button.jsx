import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    ...props
}, ref) => {
    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md ring-offset-2 focus:ring-2 focus:ring-primary-500',
        secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-sm focus:ring-2 focus:ring-slate-200',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md focus:ring-red-500',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        icon: 'p-2'
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
