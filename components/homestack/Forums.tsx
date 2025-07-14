import React from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import SafeScreenWrapper from "./SafeScreenWrapper"; // adjust the path
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../authstack/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as Keychain from 'react-native-keychain'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { handleLogout } from "../../Auth/handleLogout";
import { getValidAccessToken } from "../../Auth/checkToken";


export default function Forums() {
  const navigation = useNavigation();
  const { userInfo , setUserInfo} = React.useContext(AuthContext);

  // //fetch forums
  // const fetchForums = async () => {
  //   const accessToken = await getValidAccessToken();
  //   if (!accessToken){
  //     handleLogout(navigation, setUserInfo);
  //   }
  //   try{
  //     const response = await fetch("https://kick-stand.onrender.com/forums",{
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         // Authorization: `Bearer ${accessToken}`,
  //       }
  //     })
  //   }
  // }



  return (
    <View style={{flex: 1, backgroundColor: "#121212"}}>
      <SafeScreenWrapper>
        <View style={{flex: 1, padding: 25}}>
          <Text style={{fontFamily: "Inter_18pt-Bold", color: "#C62828", fontSize: 24}}>@kickstand</Text>
          <View style={{flexDirection: "row", width: "100%", justifyContent: "space-between", marginVertical: 8}}>
            <View style={{flexDirection: "row", gap: 10}}>
              <TouchableOpacity style={{flexDirection: "row", alignItems: "baseline", backgroundColor: "#1F1F1F", padding: 8, borderRadius: 20}}>
                <MaterialCommunityIcons name="clock-outline" style={{color: "#ECEFF1", marginHorizontal: 2}}/>
                <Text style={{fontFamily: "Inter_18pt-Regular", color: "#ECEFF1", marginHorizontal: 2}}>Latest</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection: "row", alignItems: "baseline", backgroundColor: "#1F1F1F", padding: 8, borderRadius: 20}}>
                <MaterialCommunityIcons name="fire" style={{color: "#ECEFF1", marginHorizontal: 2}}/>
                <Text style={{fontFamily: "Inter_18pt-Regular", color: "#ECEFF1", marginHorizontal: 2}}>Hot</Text>
              </TouchableOpacity>
            </View>
            <View style={{}}>
              <TouchableOpacity style={{flexDirection: "row", alignItems: "baseline", backgroundColor: "#C62828", padding: 8, borderRadius: 20}}>
                <MaterialCommunityIcons name="pencil-plus" style={{color: "#ECEFF1", marginHorizontal: 2}}/>
                <Text style={{fontFamily: "Inter_18pt-Regular", color: "#ECEFF1", marginHorizontal: 2}}>New Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeScreenWrapper>
    </View>
    
  );
}
