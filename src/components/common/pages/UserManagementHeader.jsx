import PropTypes from 'prop-types';
import SearchField from '@/components/common/FormFields/SearchField';
import ActionButton from '@/components/common/FormFields/ActionButton';
import ToggleTab from '@/components/common/Navigation/ToggleTab';
import ExportIcon from '@/assets/images/svg/export.svg';
import PlusIcon from '@/assets/images/svg/plus.svg';

const UserManagementHeader = ({
  title = 'User Management',
  description = 'View, filter, and manage all users enrolled on the platform. Easily add new students or faculty and monitor their access levels.',
  searchValue = '',
  onSearchChange,
  onSearch,
  searchFields = ['name', 'email'],
  onExport,
  activeTab,
  onTabChange,
  onInvite,
  tabs = [
    { value: 'students', label: 'STUDENTS' },
    { value: 'teachers', label: 'TEACHERS' },
    { value: 'internal-staff', label: 'INTERNAL STAFF' },
  ],
  className = '',
}) => {
  const getInviteButtonText = tab => {
    const buttonTextMap = {
      teachers: 'Invite Teacher',
      'internal-staff': 'Invite Staff',
    };
    return buttonTextMap[tab] || 'Invite Teacher';
  };

  const handleExport = () => {
    if (onExport) {
      // Export as CSV by default
      onExport('csv');
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Title, Description, Search and Export Row */}
      <div className='flex justify-between items-start gap-6'>
        {/* Title and Description */}
        <div className='flex-1'>
          <h1 className='text-3xl font-semibold text-blended-blue_7 mb-2'>
            {title}
          </h1>
          <p className='text-blended-gray_9 text-sm max-w-sm'>{description}</p>
        </div>

        {/* Search and Export */}
        <div className='flex items-center gap-3'>
          <div className='w-80'>
            <SearchField
              placeholder='Search by Name & Email...'
              value={searchValue}
              onChange={onSearchChange}
              onSearch={onSearch}
              searchFields={searchFields}
              inputClassName='px-4 py-2.5'
            />
          </div>
          <ActionButton
            variant='secondary'
            className='px-4 py-3'
            onClick={handleExport}
            icon={ExportIcon}
          >
            Export
          </ActionButton>
        </div>
      </div>

      {/* Tabs and Invite Button Row */}
      <div className='flex justify-between items-center'>
        <ToggleTab
          options={tabs}
          activeOption={activeTab}
          onOptionChange={onTabChange}
          behavior='switch'
        />
        {activeTab !== 'students' && (
          <ActionButton
            variant='secondary'
            size='md'
            onClick={onInvite}
            icon={PlusIcon}
          >
            {getInviteButtonText(activeTab)}
          </ActionButton>
        )}
      </div>
    </div>
  );
};

UserManagementHeader.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  onSearch: PropTypes.func,
  searchFields: PropTypes.arrayOf(PropTypes.string),
  onExport: PropTypes.func,
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func,
  onInvite: PropTypes.func,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  className: PropTypes.string,
};

export default UserManagementHeader;
