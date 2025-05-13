import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useNavigation } from "@react-navigation/native";
import { signIn } from "../../Auth/signin"; // Adjust the path to your signIn function
import { AuthContext } from "../authstack/AuthContext"; // Adjust the path to your AuthContext


export default function LoginScreen() {
  const navigation = useNavigation();
  const { setUserInfo } = React.useContext(AuthContext); // Use the context to set user info
  const handleSignIn = async () => {
    
    try {
      
      const result = await signIn(setUserInfo); // Call your signIn function here
      
      if (result) {
        console.log("User signed in successfully:", result);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' as never}]
        });
      }
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log('User cancelled the login flow');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log('Sign in is in progress already');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log('Play services not available or outdated');
        } else {
          console.error('Some other error happened:', error);
        }
      } else {
        console.error('An unknown error occurred:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App!</Text>
      <GoogleSigninButton
        style={styles.googleButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleSignIn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  googleButton: {
    width: 192,
    height: 48,
  },
});