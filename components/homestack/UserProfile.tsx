import React, { useEffect, useState } from "react";
import { Button, Linking, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Dimensions, RefreshControl } from "react-native";
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
import VehicleDetailsModal from "../Elements/VehicleDetailsModal";
import LottieView from "lottie-react-native";
import AddVehicle from "../Elements/AddVehicleModal";
import AddVehicleModal from "../Elements/AddVehicleModal";
import type { Forums } from "./Forums";
import { ForumCard } from "../Elements/ForumCard";
import ForumPost from "./ForumPost";
import ServiceReviews from "./ServiceReviews";
import CreateReviews from "../Elements/CreateReviews";

type Vehicle = {
  vehicle_id: string;
  model_name: string;
  user_id: string;
}


export type UserProfileStackParamList = {
  UserProfileContent: undefined;
  Support: undefined;
  ForumPost: {item: Forums, time: string, aspectRatio: number};
  ServiceReviews: undefined;
  ActiveRides: undefined;
  ServiceAlerts: undefined;
  CreateReviews: undefined;
  
}
export type UserProfileNavigationProp = NativeStackNavigationProp<UserProfileStackParamList>;
const UserProfileStack = createNativeStackNavigator<UserProfileStackParamList>();


export function UserProfileContent() {
  const screenWidth = Dimensions.get("window").width - 30;
  const rootnavigation = useNavigation<RootNavigationProp>();
  const userprofilenavigation = useNavigation<UserProfileNavigationProp>();
  const hostNavigation = useNavigation<HostNavigationProp>();
  const { userInfo , setUserInfo} = React.useContext(AuthContext);
  const [reportBugVisible, setReportBugVisible] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [vehicleDetailsModal, setvehicleDetailsModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [addVehicleModal, setAddVehicleModal] = useState(false);
  const [userForums, setUserForums] = useState<Forums[]> ([]);
  const [loadingForums, setLoadingForums] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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

  const onRefresh = async () => {
    console.log("refresh")
      setRefreshing(true);
      await getUserForums();
      setRefreshing(false);
    };

  const getUserForums = async () => {
    setLoadingForums(true);
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      handleLogout(rootnavigation, setUserInfo);
    }
    try {
      const response = await fetch("https://kick-stand.onrender.com/forums/user",{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      });
      if (!response.ok){
        console.log("error fetching");
        setLoadingForums(false);
        return;
      }
      const data = await response.json();
      setUserForums(data);
    }
    catch (error) {
      console.log("error");
    } finally {
      setLoadingForums(false);
    }
  }

  useEffect(()=> {
   getUserVehicles();
  }, [vehicles]);
  useEffect(()=> {
   getUserForums();
  }, []);


  const renderVehicles = ({item}: {item: Vehicle}) => (
    <View style={{backgroundColor: "#121212", width: screenWidth, flexDirection: "row", paddingHorizontal: 10, alignItems: "center",padding: 10, justifyContent: "space-between"}}>
      <MaterialCommunityIcons name="arrow-left-circle" size={20} color= {isFirst ? "#424242" : "#C62828"} />
      <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}} onPress={()=>{
          setSelectedVehicle(item.model_name)
          setvehicleDetailsModal(true)}}>
        <Image source={require('../../assets/photos/motorbike.png')} style={{ width: 50, height: 50, marginHorizontal: 10 }}/> 
        <View style={{ alignItems: "center", marginHorizontal: 10 }}>
        <View style={{ alignItems: "flex-start" }}>
          <Text style={{ textAlign: "left" }}>
            <Text style={{ fontFamily: "Inter_18pt-SemiBold", color: "#424242", fontSize: 10 }}>Model: </Text>
            <Text style={{ fontFamily: "Inter_18pt-SemiBold", color: "#424242", fontSize: 10 }}>{item.model_name}</Text>
          </Text>
          <Text style={{ textAlign: "left" }}>
            <Text style={{ fontFamily: "Inter_18pt-SemiBold", color: "#424242", fontSize: 10 }}>Vehicle No: </Text>
            <Text style={{ fontFamily: "Inter_18pt-SemiBold", color: "#424242", fontSize: 10 }}>{item.vehicle_id}</Text>
          </Text>
        </View>
      </View>
      </TouchableOpacity>
      { isLast ? 
        <TouchableOpacity onPress={()=>setAddVehicleModal(true)}>
          <MaterialCommunityIcons name="plus-circle" size={20} color="#C62828" />
        </TouchableOpacity> 
        : <MaterialCommunityIcons name="arrow-right-circle" size={20} color="#C62828" />}
    </View>
  )

  
  return (
    <MenuProvider>
      <View style={{flex: 1, backgroundColor: "#121212"}}>
        <SafeScreenWrapper>
          <View style={{flex: 1, paddingTop: 15, paddingLeft: 15, paddingRight: 15, justifyContent: "space-between"}}>
            <View style={{flex: 1}}>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <Image source={user_image_url ? { uri: user_image_url } : require("../../assets/photos/racer.png")} style={{width: 80, height: 80, borderRadius: 50, borderWidth: 2, borderColor: "#C62828", marginRight: 14}}/>
                <View>
                  <Text style={{ color: "#ECEFF1", fontFamily: "Inter_18pt-SemiBold", fontSize: 14}}>{userInfo?.user.givenName} {userInfo?.user.familyName}</Text>
                  <Text style={{ color: "#ECEFF1", fontFamily: "Inter_18pt-SemiBold", fontSize: 14}}>RPM</Text>
                </View>
              </View>
                <View>
                  <Menu>
                    <MenuTrigger 
                      customStyles={{
                      TriggerTouchableComponent: TouchableWithoutFeedback 
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
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 14 }}>
                <TouchableOpacity
                  onPress={() => userprofilenavigation.navigate("ActiveRides")}
                  style={{
                    backgroundColor: "#1F1F1F",
                    borderRadius: 10,
                    height: 80,
                    flex: 1,
                    marginHorizontal: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons name="motorbike" size={20} color="#C62828" style={{ marginBottom: 6 }} />
                  <Text style={{ color: "#C62828", fontFamily: "Inter_18pt-SemiBold", fontSize: 12, textAlign: "center" }}>
                    Active Rides
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => userprofilenavigation.navigate("ServiceAlerts")}
                  style={{
                    backgroundColor: "#1F1F1F",
                    borderRadius: 10,
                    height: 80,
                    flex: 1,
                    marginHorizontal: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons name="bell-alert" size={20} color="#C62828" style={{ marginBottom: 6 }} />
                  <Text style={{ color: "#C62828", fontFamily: "Inter_18pt-SemiBold", fontSize: 12, textAlign: "center" }}>
                    Service Alerts
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => userprofilenavigation.navigate("ServiceReviews")}
                  style={{
                    backgroundColor: "#1F1F1F",
                    borderRadius: 10,
                    height: 80,
                    flex: 1,
                    marginHorizontal: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons name="star-circle" size={20} color="#C62828" style={{ marginBottom: 6 }} />
                  <Text style={{ color: "#C62828", fontFamily: "Inter_18pt-SemiBold", fontSize: 12, textAlign: "center" }}>
                    Service Reviews
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{
                overflow: 'hidden',
              }}>
                
                <FlatList
                  data={vehicles}
                  renderItem={renderVehicles}
                  keyExtractor={(item) => item.vehicle_id}
                  contentContainerStyle={{}}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled
                  style={{backgroundColor: "#1F1F1F"}} 
                  onMomentumScrollEnd={(e) => {
                    const offsetX = e.nativeEvent.contentOffset.x;
                    const currentPage = Math.round(offsetX / screenWidth);

                    setIsFirst(currentPage === 0);
                    setIsLast(currentPage === vehicles.length - 1);
                  }}
                  ListEmptyComponent={loadingVehicles ? 
                    <View style={{justifyContent: "center", alignItems: "center", flexDirection: "row", height: 70, backgroundColor: "#121212", width: screenWidth}}>
                      <LottieView source={require('../../assets/loading/MotorcycleDetails.json')} autoPlay loop style={{ width: 50, height: 50, marginRight: 6 }} />
                      <Text style={{ color:"#424242", fontFamily: "Inter_18pt-Regular", fontSize: 12}}>Loading up your rides..</Text>
                    </View>
                    : 
                    <TouchableOpacity style={{justifyContent: "center", alignItems: "center", flexDirection: "row", height: 70, backgroundColor: "#121212", width: screenWidth}}>
                      <Text style={{ color:"#C62828", fontFamily: "Inter_18pt-SemiBold", fontSize: 12, marginRight: 6}}>Start by adding your ride to the garage</Text>
                      <MaterialCommunityIcons name="plus-circle" size={20} color="#C62828" />
                    </TouchableOpacity>
                  }
                />
              </View>
              <FlatList
                data={userForums}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => <ForumCard item={item} />}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  loadingForums ? (
                    <View style={{justifyContent: "center", alignItems: "center", marginVertical: 100}}>
                      <LottieView source={require('../../assets/loading/loadingAnimation.json')} autoPlay loop style={{ width: 100, height: 100 }} />
                      <Text style={{ color: '#9c908f', fontFamily: "Inter_18pt-Bold", fontSize: 10}}>Getting your forums</Text>
                    </View>
                  ) : (
                    <View style={{justifyContent: "center", alignItems: "center", marginVertical: 100}}>
                      <MaterialCommunityIcons name="engine-off" size={40} color="#9c908f"/>
                      <Text style={{ color: '#9c908f', fontFamily: "Inter_18pt-Bold", fontSize: 10}}>No rides yet :)</Text>
                      <Text style={{ color: '#9c908f', fontFamily: "Inter_18pt-Bold", fontSize: 10}}>Lift your Kickstand by hitting Create Ride!</Text>
                    </View>
                  )
                }
                refreshControl={
                  <RefreshControl refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#C62828"]}
                  progressBackgroundColor="#121212"
                  progressViewOffset={50} />
                }
              />
            </View>
          </View>
          <ReportBug visible={reportBugVisible} loading={loadingReport} onClose={()=>{setReportBugVisible(false)}} setLoading={setLoadingReport}/>
          <VehicleDetailsModal onClose={()=>{
            setSelectedVehicle("")
            setvehicleDetailsModal(false)
          }}
          visible={vehicleDetailsModal}
          vehicle={selectedVehicle}
          />
          <AddVehicleModal visible={addVehicleModal} onClose={()=>setAddVehicleModal(false)}/>
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
        <UserProfileStack.Screen
        name="ForumPost"
        component={ForumPost}
        options={{ headerShown: false}}
        />
        <UserProfileStack.Screen
        name="ServiceReviews"
        component={ServiceReviews}
        options={{ headerShown: false}}
        />
        <UserProfileStack.Screen
        name="ActiveRides"
        component={ServiceReviews}
        options={{ headerShown: false}}
        />
        <UserProfileStack.Screen
        name="ServiceAlerts"
        component={ServiceReviews}
        options={{ headerShown: false}}
        />
        <UserProfileStack.Screen
        name="CreateReviews"
        component={CreateReviews}
        options={{ headerShown: false}}
        />
        
      </UserProfileStack.Navigator>
  )
}
