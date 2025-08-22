import api from './api';
import { handlePost } from './handlePost';

// Get users with pagination and filters
export async function getUsers(params = {}) {
  const {
    page = 1,
    limit = 10,
    role = 'all',
    status = 'all',
    sortBy = 'name',
    sortOrder = 'asc',
    search = '',
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    role,
    status,
    sortBy,
    sortOrder,
  });

  if (search) {
    queryParams.append('search', search);
  }

  const response = await api.get(`/admin/users?${queryParams.toString()}`);
  return response.data;
}

// Invite teacher
export async function inviteTeacher(teacherData) {
  return await handlePost(api, 'POST', '/admin/invite-teacher', teacherData);
}
