import React from 'react';
import { AuthProvider } from './auth';
import { ToastProvider } from './toast';

export const AppProvider: React.FC = ({ children }) => {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
};
