import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Mock user state - no real authentication
  const [user, setUser] = useState(null);

  // Mock login function
  const login = (role, userData) => {
    setUser({
      role: role, // 'admin', 'warden', 'student', 'visitor'
      ...userData
    });
  };

  // Mock logout function
  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}