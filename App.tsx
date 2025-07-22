import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';
import LoginScreen from './components/authstack/LoginScreen';
import HomeScreen from './components/homestack/HomeScreen';
import NewUser from './components/homestack/NewUser';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { User } from '@react-native-google-signin/google-signin/src/types';
import { AuthContext, AuthProvider } from './components/authstack/AuthContext';
import { Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WEB_CLIENT_ID, IOS_CLIENT_ID } from './Auth/key';
import LottieView from 'lottie-react-native';
import Support from './components/Elements/Support';



export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  NewUser: undefined; 
  Support: undefined;
};
GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID, // Required for getting the ID token
  iosClientId: IOS_CLIENT_ID, // For iOS apps (optional but recommended)
  offlineAccess: true, // Enables server-side API calls
});

const Stack = createNativeStackNavigator<RootStackParamList>();
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AppContent = () => {
  
 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {userInfo, isAuthLoading} = React.useContext(AuthContext);
  const [isLoading, setisLoading] = useState(true);
  const text = "Be respectful — hate speech or harassment will be flagged.";

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
      <View style={{flex: 1, backgroundColor: "#C62828", justifyContent: "center", alignItems: "center"}}>
        <LottieView source={require('./assets/loading/helmetLoading')} autoPlay={false} loop={false} style={{ width: 200, height: 200 }} />
        <Text style={{fontFamily: "Bitcount-VariableFont_CRSV,ELSH,ELXP,slnt,wght", fontSize: 20, color: "#121212"}}>Fueling Up</Text>
        <View style={{backgroundColor: "#121212", margin: 20, borderRadius: 20, padding: 20, width: 350, height: 100, position: "absolute", bottom: 0}}>
          <Text style={{fontSize: 16, color: "#EF6C00", fontFamily: "Inter_18pt-Bold"}}>Community Rules</Text>
          <Text style={{fontSize: 12, color: "#9E9E9E", fontFamily: "Inter_18pt-Regular"}}>{text}</Text>
        </View>
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
        <Stack.Screen
          name="Support"
          component={Support}
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