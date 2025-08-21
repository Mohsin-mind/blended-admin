export const mockTeachers = [
  {
    id: 1,
    name: 'Dr. Ayesha Khan',
    email: 'ayesha.khan@blended.edu',
    status: 'ASSIGNED',
    lastActive: '2 minutes ago',
    assignedCourses: 'AI Ethics, ML Foundations',
    avatar: 'AK',
  },
  {
    id: 2,
    name: 'Prof. Michael Rao',
    email: 'michael.rao@blended.edu',
    status: 'ASSIGNED',
    lastActive: '1 hour ago',
    assignedCourses: 'Data Science, Statistics',
    avatar: 'MR',
  },
  {
    id: 3,
    name: 'Prof. Elena García',
    email: 'elena.garcia@blended.edu',
    status: 'INACTIVE',
    lastActive: 'Jan 19, 2020',
    assignedCourses: 'Machine Learning',
    avatar: 'EG',
  },
  {
    id: 4,
    name: 'Dr. Darell Steward',
    email: 'darell.steward@blended.edu',
    status: 'SUSPENDED',
    lastActive: '12 hours ago',
    assignedCourses: 'Computer Vision',
    avatar: 'DS',
  },
];

export const mockStudents = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@student.blended.edu',
    status: 'AVAILABLE',
    lastActive: '1 hour ago',
    enrolledCourses: 'AI Ethics, ML Foundations',
    avatar: 'JS',
  },
  {
    id: 2,
    name: 'Emma Wilson',
    email: 'emma.wilson@student.blended.edu',
    status: 'AVAILABLE',
    lastActive: '30 minutes ago',
    enrolledCourses: 'Data Science, Statistics',
    avatar: 'EW',
  },
  {
    id: 3,
    name: 'Alex Johnson',
    email: 'alex.johnson@student.blended.edu',
    status: 'INACTIVE',
    lastActive: '2 days ago',
    enrolledCourses: 'Machine Learning',
    avatar: 'AJ',
  },
];

export const mockInternalStaff = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@blended.edu',
    status: 'CURRENTLY UNAVAILABLE',
    lastActive: '30 minutes ago',
    department: 'IT Support',
    avatar: 'SJ',
  },
];

// Helper function to get status variant for Badge component
export const getStatusVariant = status => {
  const statusMap = {
    // Mock data statuses
    AVAILABLE: 'available',
    ASSIGNED: 'assigned',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    'CURRENTLY UNAVAILABLE': 'unavailable',
    // API response statuses
    active: 'available',
    'pending_verification': 'inactive',
    inactive: 'inactive',
    suspended: 'suspended',
  };
  return statusMap[status] || 'default';
};
