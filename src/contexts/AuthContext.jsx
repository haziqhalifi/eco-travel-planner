import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, handleApiError } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isLoggedIn, setIsLoggedIn] = useState(false);

   // Check if user is logged in on app start
   useEffect(() => {
      checkAuthStatus();
   }, []);

   const checkAuthStatus = async () => {
      if (authAPI.isLoggedIn()) {
         try {
            const userData = await authAPI.getCurrentUser();
            setUser(userData);
            setIsLoggedIn(true);
         } catch (error) {
            console.error('Auth check failed:', error);
            authAPI.logout();
            setUser(null);
            setIsLoggedIn(false);
         }
      }
      setIsLoading(false);
   };

   const login = async (credentials) => {
      try {
         setIsLoading(true);
         const response = await authAPI.login(credentials);
         setUser(response.user);
         setIsLoggedIn(true);
         return { success: true, user: response.user };
      } catch (error) {
         const errorMessage = handleApiError(error, 'Login failed');
         return { success: false, error: errorMessage };
      } finally {
         setIsLoading(false);
      }
   };

   const register = async (userData) => {
      try {
         setIsLoading(true);
         const response = await authAPI.register(userData);
         setUser(response.user);
         setIsLoggedIn(true);
         return { success: true, user: response.user };
      } catch (error) {
         const errorMessage = handleApiError(error, 'Registration failed');
         return { success: false, error: errorMessage };
      } finally {
         setIsLoading(false);
      }
   };

   const logout = () => {
      authAPI.logout();
      setUser(null);
      setIsLoggedIn(false);
   };

   const value = {
      user,
      isLoggedIn,
      isLoading,
      login,
      register,
      logout,
      checkAuthStatus
   };

   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   );
}; 