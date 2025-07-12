import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from "../authstack/AuthContext";
import MainTabs from './MainTabs';
import * as Keychain from 'react-native-keychain'


export default function HomeScreen() {
  
  const navigation = useNavigation();
  const { userInfo } = React.useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
   
  const getTokenFromKeychain = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const token = credentials.password;
        return token;
      }
    } catch (error) {
      console.log("Error reading Keychain:", error);
    }
    return null;
  };

  

  const getUserData = async () => {
    try {
      const token = await getTokenFromKeychain()
      console.log(token)
      if (!userInfo) return;
      const response = await fetch(`https://kick-stand.onrender.com/users/${userInfo.user.id}`);
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
    getUserData();
  }, [userInfo]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (<MainTabs />);
}
