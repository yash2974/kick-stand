import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { signIn } from './Auth/signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  interface User {
    name: string;
    email: string;
  }

  const [user, setUser] = useState<User | null>(null);

  const handleSignIn = async () => {
    const result = await signIn();
    if (result) {
      setUser(result.user); // Save authenticated user info
      console.log('User info:', result.user);  
    }
  };

  return (
    <View style={styles.backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? 'black' : 'white'}
      />
      <Text style={styles.title}>Welcome to React Native!</Text>
      {user ? (
        <Text style={styles.userInfo}>
          Signed in as: {user.name} ({user.email})
        </Text>
      ) : (
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleSignIn}
          disabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600',
  },
  userInfo: {
    fontSize: 18,
    marginTop: 20,
    color: 'gray',
  },
});

export default App;
