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
        const accessTokenCheck = await Keychain.getGenericPassword({ service: 'access_token' });
        const refreshTokenCheck = await Keychain.getGenericPassword({ service: 'refresh_token' });

    if (!accessTokenCheck && !refreshTokenCheck) {
        setUserInfo(null);
        navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] });
    } 
    else {
        alert("Token clear failed. Try again.");
        console.error("Access or Refresh token still present in Keychain.");
        }
    }
    catch (error) {
        console.error("Logout error:", error);
        alert("Failed to log out. Try again.");
    }
  }