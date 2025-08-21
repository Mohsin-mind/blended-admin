import { useState } from 'react';
import useSWR from 'swr';
import UserManagementHeader from '@/components/common/pages/UserManagementHeader';
import GenericTable from '@/components/common/Table';
import Badge from '@/components/common/UI/Badge';
import ActionButton from '@/components/common/FormFields/ActionButton';
import Modal from '@/components/common/UI/Modal';

import Checkbox from '@/components/common/FormFields/Checkbox';
import { getStatusVariant } from '@/utils/mockData/userManagementData';
import { exportUserData } from '@/utils/exportUtils';
import { getUsers, inviteTeacher } from '@/services/userManagementService';
import {
  TEACHER_SUBJECTS,
  TEACHER_DOMAINS,
  USER_ROLES,
  USER_STATUS,
} from '@/utils/constant/allConstant';
import EyeIcon from '@/assets/images/svg/eye.svg';
import EditIcon from '@/assets/images/svg/edit.svg';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentInstitution: '',
    preferredSubjects: [],
    preferredDomains: [],
  });

  // Map active tab to role
  const getRoleFromTab = tab => {
    switch (tab) {
      case 'students':
        return USER_ROLES.STUDENT;
      case 'teachers':
        return USER_ROLES.TEACHER;
      case 'internal-staff':
        return USER_ROLES.INTERNAL_STAFF;
      default:
        return USER_ROLES.ALL;
    }
  };

  // Fetch users data
  const {
    data: usersData,
    error,
    mutate,
  } = useSWR(
    ['users', activeTab, currentPage, pageSize, sortBy, sortOrder, searchValue],
    async () => {
      const params = {
        page: currentPage,
        limit: pageSize,
        role: getRoleFromTab(activeTab),
        status: USER_STATUS.ALL,
        sortBy,
        sortOrder,
        search: searchValue,
      };
      return await getUsers(params);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 0,
      errorRetryInterval: 1000,
    }
  );

  // Handle search change
  const handleSearchChange = value => {
    setSearchValue(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle tab change
  const handleTabChange = tab => {
    setActiveTab(tab);
    setSearchValue('');
    setCurrentPage(1);
    setSortBy('firstName');
    setSortOrder('asc'); // Already lowercase
  };

  // Handle page change
  const handlePageChange = page => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = newPageSize => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle sort change
  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder.toLowerCase()); // Convert to lowercase for API
  };

  // Handle invite
  const handleInvite = () => {
    setIsInviteModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsInviteModalOpen(false);
    // Reset form data
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      currentInstitution: '',
      preferredSubjects: [],
      preferredDomains: [],
    });
  };

  // Handle form submission
  const handleSubmitInvite = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      return;
    }

    setIsSubmitting(true);
    try {
      await inviteTeacher(formData);
      handleCloseModal();
      mutate(); // Refresh the users list
    } catch (inviteError) {
      console.error('Error inviting teacher:', inviteError);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle checkbox changes for subjects
  const handleSubjectChange = (subject, checked) => {
    setFormData(prev => ({
      ...prev,
      preferredSubjects: checked
        ? [...prev.preferredSubjects, subject]
        : prev.preferredSubjects.filter(s => s !== subject),
    }));
  };

  // Handle checkbox changes for domains
  const handleDomainChange = (domain, checked) => {
    setFormData(prev => ({
      ...prev,
      preferredDomains: checked
        ? [...prev.preferredDomains, domain]
        : prev.preferredDomains.filter(d => d !== domain),
    }));
  };

  // Get table columns based on active tab
  const getTableColumns = tab => {
    const baseColumns = [
      {
        key: 'name',
        title: 'NAME',
        isSortable: true,
        sortKey: 'firstName',
        renderContent: value => {
          return (
            <div className='flex items-center gap-3'>
              <span className='font-medium'>{value}</span>
            </div>
          );
        },
      },
      {
        key: 'email',
        title: 'EMAIL',
        isSortable: true,
        renderContent: value => <span>{value}</span>,
      },
      {
        key: 'status',
        title: 'STATUS',
        isSortable: false,
        renderContent: value => (
          <Badge variant={getStatusVariant(value)} size='sm'>
            {value}
          </Badge>
        ),
      },
      {
        key: 'lastActive',
        title: 'LAST ACTIVE',
        isSortable: true,
        renderContent: value => {
          if (!value) return <span className='text-blended-gray_1'>Never</span>;
          try {
            const date = new Date(value);
            return <span>{date.toLocaleDateString()}</span>;
          } catch {
            return <span>{value}</span>;
          }
        },
      },
    ];

    // Add tab-specific columns
    if (tab === 'teachers') {
      baseColumns.push({
        key: 'assignedCourses',
        title: 'ASSIGNED COURSES',
        isSortable: false,
        renderContent: () => <span className='text-blended-gray_1'>-</span>,
      });
    } else if (tab === 'students') {
      baseColumns.push({
        key: 'enrolledCourses',
        title: 'ENROLLED COURSES',
        isSortable: false,
        renderContent: () => <span className='text-blended-gray_1'>-</span>,
      });
    } else if (tab === 'internal-staff') {
      baseColumns.push({
        key: 'department',
        title: 'DEPARTMENT',
        isSortable: false,
        renderContent: () => <span className='text-blended-gray_1'>-</span>,
      });
    }

    // Add actions column
    baseColumns.push({
      key: 'actions',
      title: 'ACTIONS',
      isSortable: false,
      isSticky: true,
      renderContent: (_, __) => (
        <div className='flex items-center gap-2'>
          <ActionButton
            variant='none'
            size='sm'
            onClick={() => {
              // TODO: Implement view functionality
            }}
            icon={EyeIcon}
            className='p-1'
          />
          <ActionButton
            variant='none'
            size='sm'
            onClick={() => {
              // TODO: Implement edit functionality
            }}
            icon={EditIcon}
            className='p-1'
          />
        </div>
      ),
    });

    return baseColumns;
  };

  // Handle export
  const handleExport = () => {
    const data = usersData?.data?.users || [];
    const columns = getTableColumns(activeTab);
    exportUserData(data, activeTab, columns);
  };

  const columns = getTableColumns(activeTab);
  const data = usersData?.data?.users || [];
  const totalItems = usersData?.data?.pagination?.total || 0;
  const loading = !usersData && !error;

  // Handle error state
  if (error) {
    console.error('Error fetching users:', error);
  }

  return (
    <div className='p-8 space-y-6 h-full w-full bg-blended-gray_8'>
      <UserManagementHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onSearch={() => {
          // Empty function since we handle search via SWR
        }}
        onExport={handleExport}
        onInvite={handleInvite}
      />

      <div className='bg-white rounded-lg border border-blended-gray_7 overflow-hidden'>
        <GenericTable
          columns={columns}
          data={data}
          showCheckbox={false}
          showAvatar
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          totalItems={totalItems}
          pageSize={pageSize}
          loading={loading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          tableWrapperClass=''
        />
      </div>

      {/* Dynamic Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={handleCloseModal}
        title='Invite New Teacher'
        description='Enter basic details to invite a new teacher. An invitation email will be sent with login instructions upon submission.'
        size='lg'
      >
        <div className='space-y-6'>
          {/* Basic Details Section */}
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  FIRST NAME
                </label>
                <input
                  type='text'
                  value={formData.firstName}
                  onChange={e => handleInputChange('firstName', e.target.value)}
                  className='w-full border border-blended-gray_2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blended-blue_3 focus:border-blended-blue_3'
                  placeholder='Enter first name'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  LAST NAME
                </label>
                <input
                  type='text'
                  value={formData.lastName}
                  onChange={e => handleInputChange('lastName', e.target.value)}
                  className='w-full border border-blended-gray_2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blended-blue_3 focus:border-blended-blue_3'
                  placeholder='Enter last name'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                EMAIL ADDRESS
              </label>
              <input
                type='email'
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className='w-full border border-blended-gray_2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blended-blue_3 focus:border-blended-blue_3'
                placeholder='Enter email address'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                CURRENT INSTITUTION
              </label>
              <div className='flex items-center gap-3'>
                <input
                  type='text'
                  value={formData.currentInstitution}
                  onChange={e =>
                    handleInputChange('currentInstitution', e.target.value)
                  }
                  className='flex-1 border border-blended-gray_2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blended-blue_3 focus:border-blended-blue_3'
                  placeholder='Enter Here'
                />
                <div className='w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold'>
                  300
                </div>
              </div>
            </div>
          </div>

          {/* Optional Fields Section */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <h3 className='text-lg font-semibold text-blended-gray_9'>
                Optional field
              </h3>
              <div className='w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold'>
                300
              </div>
            </div>

            <p className='text-sm text-blended-gray_9'>
              Good to have to categorise the teacher if they decide to skip the
              details in their profile.
            </p>

            {/* Core Subjects */}
            <div className='space-y-3'>
              <h4 className='text-base font-medium text-blended-gray_5'>
                WHAT CORE SUBJECTS IS THE TEACHER MOST QUALIFIED TO TEACH?
              </h4>
              <div className='space-y-2'>
                {Object.values(TEACHER_SUBJECTS).map(subject => (
                  <Checkbox
                    key={subject}
                    id={`core-${subject}`}
                    name={`core-${subject}`}
                    label={subject}
                    checked={formData.preferredSubjects.includes(subject)}
                    onChange={e =>
                      handleSubjectChange(subject, e.target.checked)
                    }
                  />
                ))}
              </div>
            </div>

            {/* Domains */}
            <div className='space-y-3'>
              <h4 className='text-base font-medium text-blended-gray_5'>
                WHICH BROADER DOMAINS OR APPLICATION AREAS IS THE TEACHER
                PROFICIENT IN?
              </h4>
              <div className='space-y-2'>
                {Object.values(TEACHER_DOMAINS).map(domain => (
                  <Checkbox
                    key={domain}
                    id={`domain-${domain}`}
                    name={`domain-${domain}`}
                    label={domain}
                    checked={formData.preferredDomains.includes(domain)}
                    onChange={e => handleDomainChange(domain, e.target.checked)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end gap-3 pt-6 border-t border-blended-gray_7'>
            <ActionButton
              variant='link'
              size='sm'
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancel
            </ActionButton>
            <ActionButton
              variant='primary'
              size='sm'
              onClick={handleSubmitInvite}
              disabled={
                isSubmitting ||
                !formData.firstName ||
                !formData.lastName ||
                !formData.email
              }
            >
              {isSubmitting ? 'Sending...' : 'Send Invite'}
            </ActionButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
