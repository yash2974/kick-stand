import React, { createContext, useState } from 'react';

export const AuthContext = createContext({
  userInfo: null,
  setUserInfo: (user: any) => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
