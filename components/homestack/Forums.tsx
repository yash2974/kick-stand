import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Text, TouchableOpacity, View, Image, Dimensions } from "react-native";
import SafeScreenWrapper from "./SafeScreenWrapper"; // adjust the path
import { useNavigation, NavigationContainer, NavigationIndependentTree, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../authstack/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as Keychain from 'react-native-keychain'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { handleLogout } from "../../Auth/handleLogout";
import { getValidAccessToken } from "../../Auth/checkToken";
import { FlatList } from "react-native-gesture-handler";
import { ForumCard } from "../Elements/ForumCard";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import CreateForums from "./CreateForums";
import ForumPost from "./ForumPost";
import { RootStackParamList } from "../../App";



export type Forums = {
  _id: string,
  user_id: string,
  username: string,
  title: string,
  content: string,
  tags: string[],
  image_url: string,
  upvote: number,
  downvote: number,
  comments: number,
  created_at: string
}

export type HomeStackParamList = {
    Forums: undefined;
    CreateForums: undefined;
    ForumPost: {item: Forums, time: string, aspectRatio: number};
}

export type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

export function ForumsContent() {
  const navigationHome = useNavigation<HomeNavigationProp>();
  const navigationRoot = useNavigation<RootNavigationProp>();
  const { userInfo , setUserInfo} = useContext(AuthContext);
  const [forums, setForums] = useState([]);

  //fetch forums
  const fetchForums = async (query: string) => {
    const accessToken = await getValidAccessToken();
    if (!accessToken){
      handleLogout(navigationRoot, setUserInfo);
    }
    try{
      let url = "http://192.168.1.9:8001/forums"
      if (query){
        url+= `?query=${encodeURIComponent(query)}`;
      }
      const response = await fetch(url,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${accessToken}`,
        }
      })
      if (!response.ok){
        console.log("error");
        return;
      }
      const data = await response.json();
      setForums(data);
      console.log(data);
    }
    catch (error) {
      console.log("error");
    }
  }
  //
  const screenWidth = Dimensions.get('window').width;
  // const renderForums
  const renderForums = ({item}: {item: Forums}) => {
    return(
     <ForumCard item={item} />
    );
  }

  useFocusEffect(
  useCallback(() => {
    fetchForums("");
  }, [])
);



  return (
    <View style={{flex: 1, backgroundColor: "#121212"}}>
      <SafeScreenWrapper>
        <View style={{flex: 1, paddingTop: 15, paddingLeft: 15, paddingRight: 15}}>
          <Text style={{fontFamily: "Inter_18pt-Bold", color: "#C62828", fontSize: 24}}>@kickstand</Text>
          <View style={{flexDirection: "row", width: "100%", justifyContent: "space-between", marginVertical: 8}}>
            <View style={{flexDirection: "row", gap: 10}}>
              <TouchableOpacity style={{flexDirection: "row", alignItems: "baseline", backgroundColor: "#424242", padding: 8, borderRadius: 20}} onPress={()=>fetchForums("")}>
                <MaterialCommunityIcons name="clock-outline" size={13} style={{color: "#ECEFF1", marginHorizontal: 3}}/>
                <Text style={{fontFamily: "Inter_18pt-Regular", color: "#ECEFF1", marginHorizontal: 3, fontSize: 13}}>Latest</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection: "row", alignItems: "baseline", backgroundColor: "#424242", padding: 8, borderRadius: 20}} onPress={()=>fetchForums("Hot")}>
                <MaterialCommunityIcons name="fire" size={13} style={{color: "#ECEFF1", marginHorizontal: 3}}/>
                <Text style={{fontFamily: "Inter_18pt-Regular", color: "#ECEFF1", marginHorizontal: 3, fontSize: 13}}>Hot</Text>
              </TouchableOpacity>
            </View>
            <View style={{}}>
              <TouchableOpacity style={{flexDirection: "row", alignItems: "baseline", backgroundColor: "#C62828", padding: 8, borderRadius: 20}}  onPress={() => {navigationHome.navigate("CreateForums")}}>
                <MaterialCommunityIcons name="pencil-plus" size={13} style={{color: "#ECEFF1", marginHorizontal: 3}}/>
                <Text style={{fontFamily: "Inter_18pt-Regular", color: "#ECEFF1", marginHorizontal: 2, fontSize: 13}}>New Post</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data = {forums}
            renderItem = {renderForums}
            keyExtractor={(item)=> item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
                <Text>Uh oh nothing here.</Text>
            }
          />
        </View>
      </SafeScreenWrapper>
    </View>
    
  );
}

export default function Forums() {
  return (
      <HomeStack.Navigator initialRouteName={"Forums"}>
        <HomeStack.Screen 
          name="Forums" 
          component={ForumsContent}
          options={{ headerShown: false }}
        />
        <HomeStack.Screen
          name="CreateForums"
          component={CreateForums}
          options={{ headerShown: false}}
        />
        <HomeStack.Screen
          name="ForumPost"
          component={ForumPost}
          options={{ headerShown: false}}
        />
      </HomeStack.Navigator>
  )
}
