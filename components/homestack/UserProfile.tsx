import React, { useEffect, useState } from "react";
import { Button, Linking, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import SafeScreenWrapper from "./SafeScreenWrapper"; // adjust the path
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../authstack/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as Keychain from 'react-native-keychain'
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import Support from "../Elements/Support";
import type { RootNavigationProp } from "../../App";
import type { HostNavigationProp } from "./Host";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { MenuProvider } from 'react-native-popup-menu';
import { handleLogout } from "../../Auth/handleLogout";
import ReportBug from "../Elements/ReportBug";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { FlatList } from "react-native-gesture-handler";
import { getValidAccessToken } from "../../Auth/checkToken";

type Vehicle = {
  vehicle_id: string;
  model_name: string;
  user_id: string;
}


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
  const [reportBugVisible, setReportBugVisible] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const user_image_url = userInfo?.user.photo;

  const getUserVehicles = async () => {
    setLoadingVehicles(true);
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      handleLogout(rootnavigation, setUserInfo);
    }
    try {
      const response = await fetch("https://kick-stand.onrender.com/vehicles",{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      });
      if (!response.ok){
        console.log("error fetching");
        setLoadingVehicles(false);
        return;
      }
      const data = await response.json();
      setVehicles(data);
    }
    catch (error) {
      console.log("error");
    } finally {
      setLoadingVehicles(false);
    }
    
  }

  useEffect(()=> {
   getUserVehicles();
  }, []);

  const renderVehicles = ({item}: {item: Vehicle}) => (
    <View style={{backgroundColor: "#1F1F1F"}}>
      <Image source={require('../../assets/photos/racer.png')} style={{ width: 25, height: 25 }}/> 
      <Text>{item.model_name}</Text>
    </View>
  )

  
  return (
    <MenuProvider>
      <View style={{flex: 1, backgroundColor: "#121212"}}>
        <SafeScreenWrapper>
          <View style={{flex: 1, padding: 15}}>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <Image source={user_image_url ? { uri: user_image_url } : require("../../assets/photos/racer.png")} style={{width: 80, height: 80, borderRadius: 50, borderWidth: 2, borderColor: "#C62828", marginRight: 14}}/>
                <View>
                  <Text style={{ color: "#424242", fontFamily: "Inter_18pt-SemiBold"}}>{userInfo?.user.givenName}</Text>
                  <Text style={{ color: "#424242", fontFamily: "Inter_18pt-SemiBold"}}>RPM</Text>
                </View>
              </View>
              <View>
                <Menu>
                  <MenuTrigger 
                    customStyles={{
                    TriggerTouchableComponent: TouchableWithoutFeedback // disables default touchable feedback
                  }}>
                    <MaterialCommunityIcons name="cog" size={20} style={{color: "#C62828", marginHorizontal: 3}}/>
                  </MenuTrigger>
                   <MenuOptions 
                     customStyles={{
                      optionsContainer: {
                        backgroundColor: '#1F1F1F',
                        borderRadius: 10,
                        padding: 5,
                        width: 150,
                      },
                      optionWrapper: {
                        padding: 10,
                      },
                      optionText: {
                        color: '#C62828',
                        fontFamily: 'Inter_18pt-SemiBold',
                      },
                    }}>
                      <MenuOption onSelect={() =>setReportBugVisible(true)}>
                        <Text style={{ color: "#C62828", fontFamily: "Inter_18pt-SemiBold"}}>Report Bug</Text>
                      </MenuOption>
                      <View style={{ height: 1, backgroundColor: '#424242', marginVertical: 4 }} />
                      <MenuOption onSelect={() => handleLogout(rootnavigation, setUserInfo)}>
                        <Text style={{ color: "#C62828", fontFamily: "Inter_18pt-SemiBold"}}>Logout</Text>
                      </MenuOption>
                    </MenuOptions>
                </Menu>
              </View>
            </View>
            <View>
              <FlatList
                data = {vehicles}
                renderItem={renderVehicles}
                keyExtractor={(item) => item.vehicle_id}
                contentContainerStyle={{ paddingBottom: 20 }}
                horizontal
                showsHorizontalScrollIndicator={false}
                />
            </View>
          </View>
          <ReportBug visible={reportBugVisible} loading={loadingReport} onClose={()=>{setReportBugVisible(false)}} setLoading={setLoadingReport}/>
        </SafeScreenWrapper>
      </View>
    </MenuProvider>
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
