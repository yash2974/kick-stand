import React from "react";
import { Button, Text, View } from "react-native";
import SafeScreenWrapper from "./SafeScreenWrapper"; // adjust the path
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../authstack/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as Keychain from 'react-native-keychain'


export default function Forums() {
    const navigation = useNavigation();
    const { userInfo , setUserInfo} = React.useContext(AuthContext);
    const handleLogout = async () => {
    console.log("log out")
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
  return (
    <SafeScreenWrapper>
        <View style={{justifyContent: "space-between", flex: 1}}>
      <Text>Forums</Text>
      <Button title="logout" onPress={()=>handleLogout()}></Button>
      <Text>gwergw</Text>
      </View>
    </SafeScreenWrapper>
  );
}
