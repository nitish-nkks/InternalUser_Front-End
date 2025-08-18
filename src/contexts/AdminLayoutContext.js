import { createContext, useContext } from 'react';

// Create context for filter sidebar
const AdminLayoutContext = createContext();

export const useAdminLayout = () => {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error('useAdminLayout must be used within AdminLayout');
  }
  return context;
};

export default AdminLayoutContext;