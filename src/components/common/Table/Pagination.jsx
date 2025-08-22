import cn from '@/lib/clsx';
import ActionButton from '../FormFields/ActionButton';
import { DEFAULT_PAGE_SIZE_OPTIONS } from '@/utils/constant/allConstant';

export default function Pagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  className = '',
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  // Don't render if no pages
  if (totalPages <= 1 && totalItems === 0) return null;

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageClick = page => {
    if (page !== '...' && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageSizeChange = event => {
    const newPageSize = parseInt(event.target.value, 10);
    onPageSizeChange(newPageSize);
  };

  const visiblePages = getVisiblePages();

  return (
    <div
      className={cn(
        'flex items-center justify-between py-4 px-6 bg-white border-t border-blended-gray_7',
        className
      )}
    >
      {/* Left side - Show dropdown and results count */}
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2 relative'>
          <span className='text-sm text-blended-gray_1 font-medium'>Show</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className='appearance-none border border-blended-gray_2 rounded-md px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blended-blue_3 focus:border-blended-blue_3 min-w-[80px]'
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className='absolute icon-arrow-down text-base right-2 top-1/2 -translate-y-1/2 pointer-events-none' />
        </div>

        {totalItems > 0 && (
          <span className='text-sm text-blended-gray_1'>
            Showing {from}-{to} of {totalItems} results
          </span>
        )}
      </div>

      {/* Right side - Pagination controls */}
      {totalPages > 1 && (
        <div className='flex items-center gap-2'>
          {/* Previous button */}
          <ActionButton
            variant='lightBlue'
            size='sm'
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className='px-3 py-1.5 text-sm hover:bg-blended-gray_7 disabled:opacity-70 disabled:cursor-not-allowed h-8'
          >
            <span className='icon-back text-base' />
          </ActionButton>

          {/* Page numbers */}
          <div className='flex items-center gap-1'>
            {visiblePages.map((page, index) => {
              const key = page === '...' ? `ellipsis-${index}` : `page-${page}`;
              return (
                <div key={key}>
                  {page === '...' ? (
                    <span className='px-3 py-1.5 text-sm text-blended-gray_1'>
                      ...
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePageClick(page)}
                      className={cn(
                        'w-8 h-8 rounded-full text-sm font-medium transition-colors',
                        page === currentPage
                          ? 'bg-blended-blue_3 text-white'
                          : 'text-blended-gray_1 hover:bg-blended-gray_7'
                      )}
                    >
                      {page}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Next button */}
          <ActionButton
            variant='lightBlue'
            size='sm'
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className='text-sm hover:bg-blended-gray_7 disabled:opacity-50 disabled:cursor-not-allowed h-8'
          >
            <span className='icon-next-arrow text-base' />
          </ActionButton>
        </div>
      )}
    </div>
  );
}
