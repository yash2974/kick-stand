import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as Keychain from 'react-native-keychain'

export const handleLogout = async (
    navigation: any,
    setUserInfo: (user: any) => void
) => {
    try {
      await GoogleSignin.signOut();
      await Keychain.resetGenericPassword({ service: 'access_token' });
      await Keychain.resetGenericPassword({ service: 'refresh_token' });
      setUserInfo(null)
      navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] });
    }
    catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out. Try again.");
    }
  }