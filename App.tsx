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
import { Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  NewUser: undefined; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent = () => {
  
 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {userInfo, isAuthLoading} = React.useContext(AuthContext);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
  if (!isAuthLoading) {
    if (userInfo) {
      setIsLoggedIn(true);
      console.log("User is logged in:", userInfo);
    } else {
      setIsLoggedIn(false);
      console.log("User is not logged in");
    }
    setisLoading(false);
  }
}, [isAuthLoading, userInfo]);

  if (isAuthLoading || isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  
  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Home" : "Login"}>
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
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView style={{flex: 1}}>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
    </SafeAreaView>
    </GestureHandlerRootView>
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