import PropTypes from 'prop-types';
import cn from '@/lib/clsx';

const ActionButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon,
  onClick,
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const variantClasses = {
    primary: 'bg-blended-blue_3 text-white focus:ring-blended-blue_3 focus:outline-none focus:ring-2 focus:ring-offset-2',
    secondary: 'bg-white text-blended-blue_7 focus:ring-blended-blue_3 focus:outline-none focus:ring-2 focus:ring-offset-2',
    outline: 'bg-transparent text-blended-gray_1 border border-blended-gray_2 focus:ring-blended-gray_2 focus:outline-none focus:ring-2 focus:ring-offset-2',
    danger: 'bg-red-600 text-white focus:ring-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2',
    success: 'bg-green-600 text-white focus:ring-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2',
    none: 'bg-transparent text-inherit focus:ring-transparent focus:ring-offset-transparent',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed hover:bg-opacity-50';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        disabled && disabledClasses,
        className
      )}
    >
      {icon && <img className="mr-2 h-4 w-4" src={icon} alt='icon'/>}
      {children}
    </button>
  );
};

ActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default ActionButton;
