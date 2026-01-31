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
        primary: 'bg-primary-700 text-white hover:bg-primary-800 shadow-sm border border-transparent focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        secondary: 'bg-white text-gray-700 border border-secondary-300 hover:bg-secondary-50 shadow-sm focus:ring-2 focus:ring-secondary-200',
        danger: 'bg-red-700 text-white hover:bg-red-800 shadow-sm focus:ring-red-500',
        ghost: 'bg-transparent text-gray-600 hover:bg-secondary-100 hover:text-gray-900',
        outline: 'bg-transparent border-2 border-primary-700 text-primary-700 hover:bg-primary-50 font-semibold',
        accent: 'bg-accent text-primary-900 hover:bg-yellow-500 font-bold uppercase tracking-wider shadow-sm'
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
                'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
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
