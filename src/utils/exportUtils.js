/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of column definitions with key and title
 * @param {string} filename - Name of the file to download
 */
export const exportToCSV = (data, columns, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from columns
  const headers = columns
    .filter(col => col.key !== 'actions') // Exclude actions column
    .map(col => col.title);

  // Convert data to CSV format
  const csvContent = [
    headers.join(','),
    ...data.map(row => {
      return columns
        .filter(col => col.key !== 'actions') // Exclude actions column
        .map(col => {
          const value = row[col.key];
          // Handle values that contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        })
        .join(',');
    })
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Export user management data based on active tab
 * @param {Array} data - Array of user data
 * @param {string} activeTab - Current active tab (students, teachers, internal-staff)
 * @param {Array} columns - Table columns configuration
 */
export const exportUserData = (data, activeTab, columns) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${activeTab}-export-${timestamp}.csv`;
  
  exportToCSV(data, columns, filename);
};
