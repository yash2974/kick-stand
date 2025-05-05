import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import LoginScreen from './components/authstack/LoginScreen'; // Adjust the path to your LoginScreen component
import HomeScreen from './components/homestack/HomeScreen'; // Adjust the path to your HomeScreen component
import NewUser from './components/homestack/NewUser'; // Adjust the path to your NewUser component
import { GoogleSignin} from '@react-native-google-signin/google-signin';
import { User } from '@react-native-google-signin/google-signin/src/types'; // Adjust the import based on your setup
import { AuthContext, AuthProvider } from './components/authstack/AuthContext';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  NewUser: undefined; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dbUser, setDbUser] = useState<User | null>(null); // State to hold the user object
  
  const { setUserInfo } = React.useContext(AuthContext); // Use the context to set user info
  const getCurrentUser = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    if (currentUser) {
      setUserInfo(currentUser);
      console.log("User is logged in:", currentUser.user.id);
      setIsLoggedIn(true);
    } else {
      setUserInfo(null);
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  };

  const isNewUser = async () => {
    try {
      const response = await fetch("http://192.168.1.5:8001/users/{currentUser.user.id}");
      const data = await response.json();
      setDbUser(data); // Set the user data in state
      console.log("User data:", dbUser);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  
  useEffect(() => {
    getCurrentUser();
  }, []);
  useEffect(() => {
    isNewUser();

  }, []); // Fetch user details when the component mounts

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
    <Stack.Navigator initialRouteName={isLoggedIn ? (dbUser ?  "Home" : "NewUser" ) : "Login"}>
        <Stack.Screen 
          name="NewUser" 
          component={NewUser} // Replace with your NewUser component
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