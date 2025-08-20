import PropTypes from 'prop-types';
import cn from '@/lib/clsx';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-full';

  const sizeClasses = {
    sm: 'px-2 py-1 text-[10px]',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    available: 'bg-blended-blue_5 text-blended-blue_6',
    assigned: 'bg-blended-blue_7 text-white',
    inactive: 'bg-blended-grey_10 text-white',
    suspended: 'bg-blended-red_2 text-blended-red_1',
    unavailable: 'bg-blended-red_2 text-blended-red_1',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'default',
    'available',
    'assigned',
    'inactive',
    'suspended',
    'unavailable',
    'success',
    'warning',
    'error',
    'info',
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Badge;
