import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Keychain from 'react-native-keychain'


const BACKEND_URL = 'http://192.168.1.9:8080/api/auth/google'; // Replace with your backend's URL

import { IOS_CLIENT_ID, WEB_CLIENT_ID } from './key'; // Replace with your actual keys



GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID, // Required for getting the ID token
  iosClientId: IOS_CLIENT_ID, // For iOS apps (optional but recommended)
  offlineAccess: true, // Enables server-side API calls
});

export const signIn = async (setUserInfo: (user: any) => void) => {

  console.log("geg")
  
  try {
    // Prompt user to sign in with Google
    await GoogleSignin.hasPlayServices();
    const userSignIn = await GoogleSignin.signIn();
    console.log('User signed in:', userSignIn);
    

    // Extract ID token
    const { idToken } = await GoogleSignin.getTokens();
    
    

    // Send the ID token to your backend
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      throw new Error(`Failed to authenticate. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Authenticated user:', data);
    
    // Handle JWT and user info (e.g., save token in secure storage)
    setUserInfo(userSignIn.data); // Set user info in context
    const { token, user } = data;
    await Keychain.setGenericPassword('jwt', token)
    console.log('JWT:', token);
    console.log('User:', user);

    // You might store the token securely using libraries like @react-native-async-storage/async-storage
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Google Sign-In or backend error:', error.message);
    } else {
      console.error('Google Sign-In or backend error:', error);
    }
  }
};
