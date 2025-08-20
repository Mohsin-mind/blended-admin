import PropTypes from 'prop-types';
import cn from '@/lib/clsx';

const Checkbox = ({
  id,
  name,
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  labelClassName = '',
  ...props
}) => {
  return (
    <label className={cn('flex items-center gap-3 cursor-pointer', className)}>
      <input
        id={id}
        name={name}
        type='checkbox'
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          'w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500',
          'focus:ring-2 focus:ring-offset-2',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        {...props}
      />
      {label && (
        <span className={cn('text-sm text-gray-700', labelClassName)}>
          {label}
        </span>
      )}
    </label>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
};

export default Checkbox;
