import React from "react";
import { Button, Linking, Text, View } from "react-native";
import SafeScreenWrapper from "./SafeScreenWrapper"; // adjust the path
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../authstack/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as Keychain from 'react-native-keychain'
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import Support from "../Elements/Support";
import type { RootNavigationProp } from "../../App";
import type { HostNavigationProp } from "./Host";
export type UserProfileStackParamList = {
  UserProfileContent: undefined;
  Support: undefined;
}
export type UserProfileNavigationProp = NativeStackNavigationProp<UserProfileStackParamList>;
const UserProfileStack = createNativeStackNavigator<UserProfileStackParamList>();

export function UserProfileContent() {
    const rootnavigation = useNavigation<RootNavigationProp>();
    const userprofilenavigation = useNavigation<UserProfileNavigationProp>();
    const hostNavigation = useNavigation<HostNavigationProp>();
    const { userInfo , setUserInfo} = React.useContext(AuthContext);
    const handleLogout = async () => {
    console.log("log out")
    try {
      await GoogleSignin.signOut();
      await Keychain.resetGenericPassword({ service: 'access_token' });
      await Keychain.resetGenericPassword({ service: 'refresh_token' });
      setUserInfo(null)
      rootnavigation.reset({ index: 0, routes: [{ name: 'Login' as never }] });
    }
    catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out. Try again.");
    }
    }
    const openGoogleMaps= ()=> {
      const url = "https://www.google.com/maps"
      Linking.openURL(url);
    }
  return (
    <SafeScreenWrapper>
        <View style={{justifyContent: "space-between", flex: 1}}>
      <Text>Forums</Text>
      <Button title='open' onPress={openGoogleMaps}></Button>
      <Button title="logout" onPress={()=>handleLogout()}></Button>
      <Button title="support" onPress={()=>rootnavigation.navigate("Support")}></Button>
      <Text>gwergw</Text>
      </View>
    </SafeScreenWrapper>
  );
}

export default function UserProfile() {
  return (
    
      <UserProfileStack.Navigator initialRouteName={"UserProfileContent"}>
        <UserProfileStack.Screen 
          name="UserProfileContent" 
          component={UserProfileContent}
          options={{ headerShown: false }}
        />
        <UserProfileStack.Screen
          name="Support"
          component={Support}
          options={{ headerShown: false}}
        />
        
      </UserProfileStack.Navigator>
  )
}
