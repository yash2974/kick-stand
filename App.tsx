import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import LoginScreen from './components/authstack/LoginScreen'; // Adjust the path to your LoginScreen component
import HomeScreen from './components/homestack/HomeScreen'; // Adjust the path to your HomeScreen component
import { GoogleSignin} from '@react-native-google-signin/google-signin';
import { User } from '@react-native-google-signin/google-signin/src/types'; // Adjust the import based on your setup
import { AuthContext, AuthProvider } from './components/authstack/AuthContext';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userInfo, setUserInfo] = useState<User | null>(null);
  const { setUserInfo } = React.useContext(AuthContext); // Use the context to set user info
  const getCurrentUser = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    if (currentUser) {
      setUserInfo(currentUser);
      setIsLoggedIn(true);
    } else {
      setUserInfo(null);
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    getCurrentUser();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AuthProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Home" : "Login"}>
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