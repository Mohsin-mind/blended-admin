import { useState, useMemo } from 'react';
import UserManagementHeader from '@/components/common/pages/UserManagementHeader';
import GenericTable from '@/components/common/Table';
import Badge from '@/components/common/UI/Badge';
import ActionButton from '@/components/common/FormFields/ActionButton';
import Modal from '@/components/common/UI/Modal';
import Button from '@/components/common/FormFields/Button';
import InputField from '@/components/common/FormFields/InputField';
import Checkbox from '@/components/common/FormFields/Checkbox';
import { mockTeachers, mockStudents, mockInternalStaff, getStatusVariant } from '@/utils/mockData/userManagementData';
import { exportUserData } from '@/utils/exportUtils';
import EyeIcon from '@/assets/images/svg/eye.svg';
import EditIcon from '@/assets/images/svg/edit.svg';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Dr Jhonathan Meyers',
    email: 'jhon.meyers@gmail.com',
    institution: '',
    coreSubjects: {
      'AI Ethics': true,
      'ML for Health': false,
      'Data Privacy': false,
      'Foundations of Deep Learning': false,
      'Computational Thinking': false,
      'Tech for Impact': false,
      'Scientific Writing': false,
      'Research Methodology': false,
      'Data Science Essentials': false
    },
    domains: {
      'Robotics': true,
      'Healthcare': false,
      'Climate Science': false,
      'Sustainability': false,
      'Social Impact': false,
      'Quantum Computing': false,
      'Education': false,
      'Finance': false,
      'Urban Development': false
    }
  });

  // Get data based on active tab
  const getDataByTab = (tab) => {
    switch (tab) {
      case 'students':
        return mockStudents;
      case 'teachers':
        return mockTeachers;
      case 'internal-staff':
        return mockInternalStaff;
      default:
        return mockTeachers;
    }
  };

  // Filter data based on search
  const handleSearch = (searchTerm, searchFields) => {
    const data = getDataByTab(activeTab);
    if (!searchTerm.trim()) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item =>
      searchFields.some(field => {
        const value = item[field] || '';
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
    setFilteredData(filtered);
  };

  // Handle search change
  const handleSearchChange = (value) => {
    setSearchValue(value);
    if (!value.trim()) {
      setFilteredData(getDataByTab(activeTab));
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchValue('');
    setFilteredData(getDataByTab(tab));
  };

  // Handle export
  const handleExport = (format) => {
    const data = getDataByTab(activeTab);
    const columns = getTableColumns(activeTab);
    exportUserData(data, activeTab, columns);
  };

  // Handle invite
  const handleInvite = () => {
    setIsInviteModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsInviteModalOpen(false);
  };

  // Handle form submission
  const handleSubmitInvite = () => {
    console.log('Invite form submitted:', formData);
    // TODO: Implement API call to send invitation
    setIsInviteModalOpen(false);
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (category, subject, checked) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subject]: checked
      }
    }));
  };

  // Get table columns based on active tab
  const getTableColumns = (tab) => {
    const baseColumns = [
      {
        key: 'name',
        title: 'NAME',
        isSortable: true,
        renderContent: (value, _, row) => (
          <div className="flex items-center gap-3">
            {row.avatar && (
              <div className="w-10 h-10 bg-blended-blue_3 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{row.avatar}</span>
              </div>
            )}
            <span className="font-medium">{value}</span>
          </div>
        ),
      },
      {
        key: 'email',
        title: 'EMAIL',
        isSortable: true,
        renderContent: (value) => <span>{value}</span>,
      },
      {
        key: 'status',
        title: 'STATUS',
        isSortable: false,
        renderContent: (value) => (
          <Badge variant={getStatusVariant(value)} size="sm">
            {value}
          </Badge>
        ),
      },
      {
        key: 'lastActive',
        title: 'LAST ACTIVE',
        isSortable: true,
        renderContent: (value) => <span>{value}</span>,
      },
    ];

    // Add tab-specific columns
    if (tab === 'teachers') {
      baseColumns.push({
        key: 'assignedCourses',
        title: 'ASSIGNED COURSES',
        isSortable: false,
        renderContent: (value) => <span>{value || '-'}</span>,
      });
    } else if (tab === 'students') {
      baseColumns.push({
        key: 'enrolledCourses',
        title: 'ENROLLED COURSES',
        isSortable: false,
        renderContent: (value) => <span>{value || '-'}</span>,
      });
    } else if (tab === 'internal-staff') {
      baseColumns.push({
        key: 'department',
        title: 'DEPARTMENT',
        isSortable: false,
        renderContent: (value) => <span>{value || '-'}</span>,
      });
    }

    // Add actions column
    baseColumns.push({
      key: 'actions',
      title: 'ACTIONS',
      isSortable: false,
      isSticky: true,
      renderContent: (_, __, row) => (
        <div className="flex items-center gap-2">
          <ActionButton
            variant="none"
            size="sm"
            onClick={() => console.log('View', row.id)}
            icon={EyeIcon}
            className="p-1"
          />
          <ActionButton
            variant="none"
            size="sm"
            onClick={() => console.log('Edit', row.id)}
            icon={EditIcon}
            className="p-1"
          />
        </div>
      ),
    });

    return baseColumns;
  };

  // Initialize filtered data
  useMemo(() => {
    setFilteredData(getDataByTab(activeTab));
  }, [activeTab]);

  const columns = getTableColumns(activeTab);
  const data = filteredData.length > 0 ? filteredData : getDataByTab(activeTab);

  return (
      <div className="p-8 space-y-6 h-full w-full bg-blended-gray_8">
        <UserManagementHeader
          activeTab={activeTab}
          onTabChange={handleTabChange}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          onExport={handleExport}
          onInvite={handleInvite}
        />

        <div className="bg-white rounded-lg border border-blended-gray_7 overflow-hidden">
          <GenericTable
            columns={columns}
            data={data}
            showCheckbox={false}
            showAvatar={true}
            currentPage={1}
            onPageChange={() => {}}
            totalItems={data.length}
            pageSize={10}
            loading={false}
            sortBy=""
            sortOrder="asc"
            onSortChange={() => {}}
            tableWrapperClass=""
          />
        </div>

        {/* Dynamic Modal */}
        <Modal
          isOpen={isInviteModalOpen}
          onClose={handleCloseModal}
          title="Invite New Teacher"
          description="Enter basic details to invite a new teacher. An invitation email will be sent with login instructions upon submission."
          size="lg"
        >
          <div className="space-y-6">
            {/* Basic Details Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full border border-blended-gray_2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blended-blue_3 focus:border-blended-blue_3"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full border border-blended-gray_2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blended-blue_3 focus:border-blended-blue_3"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CURRENT INSTITUTION
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => handleInputChange('institution', e.target.value)}
                    className="flex-1 border border-blended-gray_2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blended-blue_3 focus:border-blended-blue_3"
                    placeholder="Enter Here"
                  />
                  <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold">
                    300
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Fields Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-blended-gray_9">Optional field</h3>
                <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold">
                  300
                </div>
              </div>
              
              <p className="text-sm text-blended-gray_9">
                Good to have to categorise the teacher if they decide to skip the details in their profile.
              </p>

              {/* Core Subjects */}
              <div className="space-y-3">
                <h4 className="text-base font-medium text-blended-gray_5">
                  WHAT CORE SUBJECTS IS THE TEACHER MOST QUALIFIED TO TEACH?
                </h4>
                <div className="space-y-2">
                  {Object.keys(formData.coreSubjects).map((subject) => (
                    <Checkbox
                      key={subject}
                      id={`core-${subject}`}
                      name={`core-${subject}`}
                      label={subject}
                      checked={formData.coreSubjects[subject]}
                      onChange={(e) => handleCheckboxChange('coreSubjects', subject, e.target.checked)}
                    />
                  ))}
                </div>
              </div>

              {/* Domains */}
              <div className="space-y-3">
                <h4 className="text-base font-medium text-blended-gray_5">
                  WHICH BROADER DOMAINS OR APPLICATION AREAS IS THE TEACHER PROFICIENT IN?
                </h4>
                <div className="space-y-2">
                  {Object.keys(formData.domains).map((domain) => (
                    <Checkbox
                      key={domain}
                      id={`domain-${domain}`}
                      name={`domain-${domain}`}
                      label={domain}
                      checked={formData.domains[domain]}
                      onChange={(e) => handleCheckboxChange('domains', domain, e.target.checked)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-blended-gray_7">
              <Button
                type="button"
                variant="link"
                onClick={handleCloseModal}
                className="px-6 py-2"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handleSubmitInvite}
                className="px-6 py-2 bg-blended-blue_7 hover:bg-blended-blue_1 text-white"
              >
                Send Invite
              </Button>
            </div>
          </div>
        </Modal>
      </div>
  );
};

export default UserManagement;
