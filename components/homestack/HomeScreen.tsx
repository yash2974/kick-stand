import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from "../authstack/AuthContext";
import MainTabs from './MainTabs';

export default function HomeScreen() {
  
  const navigation = useNavigation();
  const { userInfo } = React.useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    try {
      if (!userInfo) return;
      const response = await fetch(`http://192.168.1.6:8001/users/${userInfo.user.id}`);
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

  return <MainTabs />;
}
