import React, { useEffect, useState } from 'react';
import { View, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from "../authstack/AuthContext";
import MainTabs from './MainTabs';
import * as Keychain from 'react-native-keychain'
import { getValidAccessToken } from '../../Auth/checkToken';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { handleLogout } from '../../Auth/handleLogout';
import LottieView from 'lottie-react-native';
import SafeScreenWrapper from './SafeScreenWrapper';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


export default function HomeScreen() {
  
  const navigation = useNavigation();
  const { userInfo , setUserInfo} = React.useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("Be respectful — hate speech or harassment will be flagged.");
  const loadingRules = [
  "Be respectful — hate speech or harassment will be flagged.",
  "Only post rides you genuinely plan to conduct.",
  "Wear proper safety gear — helmet and gloves are mandatory.",
  "Ride responsibly — reckless behavior isn’t tolerated.",
  "Keep the community clean — no spam or misleading posts."
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % loadingRules.length;
      setText(loadingRules[index]);
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  
  const checkToken = async () =>{
  const accessToken = await getValidAccessToken();
    if (!accessToken) {
      handleLogout(navigation, setUserInfo);
    } else {
      console.log("token valid", accessToken)
  }
}

  const getUserData = async () => {
    const accessToken = await getValidAccessToken();
      if (!accessToken){
        handleLogout(navigation, setUserInfo)
    }
    try {
      if (!userInfo) return;
      const response = await fetch(`https://kick-stand.onrender.com/users/`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      });
      const data = await response.json();
      if (data === null) {
        // User not found in DB, reset navigation
        navigation.reset({ index: 0, routes: [{ name: 'NewUser' as never }] });
        setLoading(false)
      } else {
        // Successfully got user data
        setDbUser(data);
        console.log("User data", data);
        setLoading(false)
      }
    } catch {
      console.log("Network error or API offline");
      setTimeout(getUserData, 3000); // retry in 3 seconds
    } 
  };

  useEffect(() => {
    checkToken();
    getUserData();
  }, [userInfo]);

  if (loading) {
    return  (
        <View style={{flex: 1, backgroundColor: "#C62828", justifyContent: "center", alignItems: "center"}}>
          <LottieView source={require('../../assets/loading/helmetLoading.json')} autoPlay loop style={{ width: 200, height: 200 }} />
          <Text style={{fontFamily: "Bitcount-VariableFont_CRSV,ELSH,ELXP,slnt,wght", fontSize: 20, color: "#121212"}}>Fueling Up</Text>
          <View style={{backgroundColor: "#121212", margin: 20, borderRadius: 20, padding: 20, width: 350, height: 100, position: "absolute", bottom: 0}}>
            <Text style={{fontSize: 16, color: "#EF6C00", fontFamily: "Inter_18pt-Bold"}}>Community Rules</Text>
            <Text style={{fontSize: 12, color: "#9E9E9E", fontFamily: "Inter_18pt-Regular"}}>{text}</Text>
          </View>
        </View>
    );
  }

  return (<MainTabs />);
}
