import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import LoginScreen from './components/authstack/LoginScreen';
import HomeScreen from './components/homestack/HomeScreen';
import NewUser from './components/homestack/NewUser';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { User } from '@react-native-google-signin/google-signin/src/types';
import { AuthContext, AuthProvider } from './components/authstack/AuthContext';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  NewUser: undefined; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false)
  const [dbUser, setDbUser] = useState<User | null>(null);
  
  const { userInfo, setUserInfo } = React.useContext(AuthContext) as {
    userInfo: User | null;
    setUserInfo: React.Dispatch<React.SetStateAction<User | null>>;
  };
  
  const getCurrentUser = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    if (currentUser) {
      setIsCheckingUser(true)
      setUserInfo(currentUser);
      console.log("User is logged in:", currentUser.user.id);
      console.log("state", userInfo); // This will log correctly after re-render
      setIsLoggedIn(true);
    } else {
      setUserInfo(null);
      setIsLoggedIn(false);
      console.log("no user")
    }
    setIsLoading(false);
  };

  const isNewUser = async () => {
    console.log("isnewuser")
    try {
      if (!userInfo) return; // Guard clause to prevent fetch if no userInfo
      const response = await fetch(`http://192.168.1.9:8001/users/${userInfo.user.id}`);
      const data = await response.json();
      setDbUser(data);
      console.log("User data:", data);
    } catch (error) {
      console.log("new user");
    }
    setIsCheckingUser(false)
  };
  
  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    
    if (userInfo) {
      isNewUser();
    }
  }, [userInfo]); // Dependency on userInfo

  if (isLoading || isCheckingUser) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? (dbUser ? "Home" : "NewUser") : "Login"}>
        <Stack.Screen 
          name="NewUser" 
          component={NewUser}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;