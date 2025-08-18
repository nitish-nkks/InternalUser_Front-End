export const getStoredUser = () => {
  const user = localStorage.getItem("userDetails");
  return user ? JSON.parse(user) : null;
};