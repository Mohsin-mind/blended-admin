import PropTypes from 'prop-types';
import { useEffect } from 'react';
import cn from '@/lib/clsx';

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
}) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = event => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle overlay click to close modal
  const handleOverlayClick = event => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black bg-opacity-50 backdrop-blur-sm',
        overlayClassName
      )}
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          'relative bg-white rounded-xl shadow-2xl',
          'w-full max-h-[90vh] overflow-y-auto p-10',
          sizeClasses[size],
          contentClassName
        )}
      >
        {/* Header */}
        <div className='flex items-start justify-between pb-5 mb-5 border-b border-blended-gray_7'>
          <div className='flex-1 pr-4'>
            {title && (
              <h2 className='text-3xl font-semibold text-blended-blue_7 mb-2'>
                {title}
              </h2>
            )}
            {description && (
              <p className='text-sm text-blended-gray_9 max-w-lg'>
                {description}
              </p>
            )}
          </div>

          {showCloseButton && (
            <button
              onClick={onClose}
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full',
                'flex items-center justify-center',
                'bg-white border border-gray-300',
                'text-gray-500 hover:text-gray-700',
                'hover:bg-gray-50 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              )}
              aria-label='Close modal'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className={cn(className)}>{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
  contentClassName: PropTypes.string,
};

export default Modal;
