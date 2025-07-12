import { GoogleSignin, User } from '@react-native-google-signin/google-signin';
import React, { createContext, use, useEffect, useState } from 'react';

export const AuthContext = createContext({
  userInfo: null as User | null,
  setUserInfo: (user: any) => {},
  isAuthLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [userInfo, setUserInfo] = useState<null | User>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
        setUserInfo(currentUser);
        console.log("User is logged in:", currentUser.user.id);
      } else {
        console.log("no user auth context");
      }
    } catch (e) {
      console.error("Error fetching user:", e);
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, isAuthLoading}}>
      {children}
    </AuthContext.Provider>
  );
};
