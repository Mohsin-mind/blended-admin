import PropTypes from 'prop-types';
import { useState } from 'react';
import { classNames } from '@/utils/helper';

function SearchField({
  placeholder = 'Search...',
  className = '',
  inputClassName = '',
  value = '',
  onChange,
  onSearch,
  searchFields = ['name', 'email'], // Default search fields for dynamic search
  disabled = false,
  size = 'md',
  ...props
}) {
  const [inputValue, setInputValue] = useState(value);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-base',
  };

  const handleInputChange = e => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && onSearch) {
      // Support both old API (single value) and new API (value, searchFields)
      if (searchFields && searchFields.length > 0) {
        onSearch(inputValue, searchFields);
      } else {
        onSearch(inputValue);
      }
    }
  };



  return (
    <div className={className}>
      <div className='relative'>
        {/* Search Icon - Left Side */}
        <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base pointer-events-none'>
          <i className='icon-search' />
        </div>

        <input
          type='text'
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={classNames(
            'w-full border border-blended-gray_7 bg-white focus:outline-none',
            'placeholder:text-gray-400 font-medium',
            'pl-10', // Left padding for icon
            'focus:ring-1 focus:ring-blended-blue_3 focus:border-blended-blue_3',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            sizeClasses[size],
            inputClassName
          )}
          {...props}
        />
      </div>
    </div>
  );
}

SearchField.propTypes = {
  placeholder: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func, // Called when Enter is pressed, supports (value, searchFields) or (value)
  searchFields: PropTypes.arrayOf(PropTypes.string), // Fields to search in for dynamic search
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default SearchField;
