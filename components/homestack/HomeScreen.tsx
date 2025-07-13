import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from "../authstack/AuthContext";
import MainTabs from './MainTabs';
import * as Keychain from 'react-native-keychain'
import { getValidAccessToken } from '../../Auth/checkToken';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { handleLogout } from '../../Auth/handleLogout';


export default function HomeScreen() {
  
  const navigation = useNavigation();
  const { userInfo , setUserInfo} = React.useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
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
      setDbUser(data);
      console.log("User data", data);
    } catch {
      navigation.reset({ index: 0, routes: [{ name: 'NewUser' as never }] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
    getUserData();
  }, [userInfo]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (<MainTabs />);
}
