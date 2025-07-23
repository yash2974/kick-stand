import React, { use, useEffect } from "react";
import {View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Button, Modal, Linking} from "react-native";
import Clipboard from '@react-native-clipboard/clipboard';
import { AuthContext } from "../authstack/AuthContext";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Invitations from "../Elements/Invitations";
import { ScreenContentWrapper } from "react-native-screens";
import SafeScreenWrapper from "./SafeScreenWrapper";
import { DateTimePickerComponent } from "../Elements/DateTimePickerComponent";
import { ScrollView } from "react-native-gesture-handler";
import CreateRide from "../Elements/CreateRide";
import DeleteRide from "../Elements/DeleteRide";
import * as Keychain from 'react-native-keychain'
import { getValidAccessToken } from '../../Auth/checkToken';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { NavigationIndependentTree, useNavigation } from "@react-navigation/native";
import LottieView from 'lottie-react-native';
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootNavigationProp } from "../../App";
import { handleLogout } from "../../Auth/handleLogout";

export type HostStackParamList = {
  HostContent: undefined;
  CreateRide: undefined;
}

export type HostNavigationProp = NativeStackNavigationProp<HostStackParamList>;
const HostStack = createNativeStackNavigator<HostStackParamList>();

type Ride = {
  image_url: string;
  title: string;
  description: string;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time: string;
  current_riders: number;
  ride_id: number;
  invite_count: number;
  map_url: string;
  private: boolean;
  code: string
};



function HostContent() {
    const { userInfo, setUserInfo } = React.useContext(AuthContext);
    const [rides, setRides] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedRideId, setSelectedRideId] = React.useState<number | null>(null);
    const [selectedRideIdDelete, setSelectedRideIdDelete] = React.useState<number | null>(null);
    const rootNavigation = useNavigation<RootNavigationProp>();
    const hostNavigation = useNavigation<HostNavigationProp>();

    const getRides = async (userId?: string) => {
      const token = await getValidAccessToken();
      if (!token){
        await handleLogout(rootNavigation, setUserInfo);
        return;
      }
        try {
        const params = new URLSearchParams();
        if (userId) {
            params.append("created_by", userId);
        }
        const response = await fetch(`https://kick-stand.onrender.com/rides/?${params.toString()}`,{
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 404) {
        setRides([]);
        setLoading(false);
        return;
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRides(data);
        console.log("Fetched rides:", data);
        } catch (error) {
            console.error("Error fetching rides:", error);
            return []; 
        }
        finally {
          setLoading(false);
        }
    };
    

    const renderRide = ({ item }: { item: Ride }) => (
      <View style={styles.card}>
        
        <View>
          <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ marginRight: 10, flexDirection: "row", alignItems: "center"}}>
              <Image
                source={{ uri: item.image_url }}
                style={{ width: 30, height: 30, borderRadius: 4, marginRight: 8 }}
              />
              <Text
                style={{
                  fontFamily: "Inter_18pt-SemiBold",
                  color: "#ECEFF1",
                  fontSize: 18,
                  marginRight: 4,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_18pt-Regular",
                  color: "#C62828",
                  fontSize: 10,
                }}
              >
                {item.private ? "(Private)" : null}
              </Text>
            </View>
            <TouchableOpacity onPress={()=>Linking.openURL(item.map_url)}>
              <Image source={require('../../assets/photos/logo.png')} style={{ width: 25, height: 25 }}/> 
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2}}>
            <Text style={{ color: "#9c908f", fontFamily: "Inter_18pt-Regular", fontSize: 12
             }}>{item.start_location}</Text>
            <MaterialCommunityIcons
              name="arrow-left-right"
              size={15}
              color="#66BB6A"
              style={{ marginHorizontal: 5 }} // horizontal spacing instead of vertical
            />
            <Text style={{ color: "#9c908f", fontFamily: "Inter_18pt-Regular", fontSize: 12
             }}>{item.end_location}</Text>
          </View>
    
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="calendar-month" size={15} color="#9c908f" />
            <Text style={{ color:"#9c908f", fontFamily: "Inter_18pt-Regular", fontSize: 12}}> {new Date(item.start_time + "Z").toLocaleString()}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center',width: '100%', justifyContent: 'space-between', marginTop: 10 }}>
            <View style={{ flexDirection:'row'}}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, backgroundColor: "#C62828", borderRadius: 20, paddingVertical: 4, paddingHorizontal:8 }} onPress={()=>setSelectedRideIdDelete(item.ride_id)}>
                <Text style={{ color: "#121212", fontSize: 10, fontFamily: "Inter_18pt-SemiBold" }}>Delete Ride</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setSelectedRideId(item.ride_id)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, backgroundColor: "#C62828", borderRadius: 20, paddingVertical: 4, paddingHorizontal: 8 }}>
                <Text style={{ color: "#121212", fontSize: 10, fontFamily: "Inter_18pt-SemiBold" }}>Lobby</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={()=>Clipboard.setString(item.code)}>
                <View style={{backgroundColor: "#121212", paddingVertical: 2, paddingHorizontal: 5, marginRight: 15, width: 70, justifyContent: "center", alignItems: "center"}}>
                  <Text style={{fontFamily: "Inter_18pt-Bold", color: "#66BB6A", fontSize: 13}}>{item.code}</Text>
                </View>
              </TouchableOpacity>
              <MaterialCommunityIcons name="account-group" size={20} color="#9c908f" />
              <Text style={{ color:"#9c908f", fontFamily: "Inter_18pt-Regular"}}> {item.current_riders}</Text>
            </View>
          </View>
        </View>
      </View>
    );

    useEffect(() => {
        getRides(userInfo?.user.id);
    }, []);
  
    return (
        <View style={{flex: 4, backgroundColor : "#121212"}}>
          <SafeScreenWrapper>
            {selectedRideId && (
              <Invitations
                visible={true}
                ride_id={selectedRideId}
                onClose={() => {setSelectedRideId(null)
                  getRides(userInfo?.user.id);
                }}
              />
            )}
            {selectedRideIdDelete && (
              <DeleteRide
              visible={true}
              ride_id={selectedRideIdDelete}
              onClose={()=> {setSelectedRideIdDelete(null)
                getRides(userInfo?.user.id);
              }}
              loading={loading}
              setLoading={setLoading}/>
            )}
            <View style={{ flex: 1, justifyContent: "flex-start", padding: 15}}>
              <View style={{ flex:3, marginBottom: 8 }}>
                <View style={{marginBottom: 8}}>
                    <Text style={{ fontSize: 24, fontFamily: "Bitcount-VariableFont_CRSV,ELSH,ELXP,slnt,wght", color: "#C62828"}}>
                        Active Rides
                    </Text>
                </View>
                <View style={{ flex: 1, borderRadius: 10}}>
                <FlatList
                    data={rides}
                    renderItem={renderRide}
                    keyExtractor={(item) => String(item.ride_id)}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        loading ? (
                          <View style={{justifyContent: "center", alignItems: "center", marginVertical: 100}}>
                            <LottieView source={require('../../assets/loading/loadingAnimation.json')} autoPlay loop style={{ width: 100, height: 100 }} />
                            <Text style={{ color: '#9c908f', fontFamily: "Inter_18pt-Bold", fontSize: 10}}>Getting your rides ready…</Text>
                          </View>
                        ) : (
                          <View style={{justifyContent: "center", alignItems: "center", marginVertical: 100}}>
                            <MaterialCommunityIcons name="engine-off" size={40} color="#9c908f"/>
                            <Text style={{ color: '#9c908f', fontFamily: "Inter_18pt-Bold", fontSize: 10}}>No rides yet :)</Text>
                            <Text style={{ color: '#9c908f', fontFamily: "Inter_18pt-Bold", fontSize: 10}}>Lift your Kickstand by hitting Create Ride!</Text>
                          </View>
                        )
                    }
                />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {hostNavigation.navigate("CreateRide")}}
                style={{
                  backgroundColor: "#C62828",
                  marginTop: 12,
                  borderRadius: 10,
                  paddingVertical: 14,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontFamily: "Inter_18pt-Bold", color: "#121212" }}>
                  Create Ride
                </Text>
                <Text style={{ color: "#121212", fontSize: 12, fontFamily: "Inter_18pt-SemiBold" }}>
                  Tap to start hosting your next journey
                </Text>
              </TouchableOpacity>

              
              
            </View>
          </SafeScreenWrapper>
        </View>
    );
}

export default function Host() {
  return (
    
      <HostStack.Navigator initialRouteName={"HostContent"}>
        <HostStack.Screen 
          name="HostContent" 
          component={HostContent}
          options={{ headerShown: false }}
        />
        <HostStack.Screen
          name="CreateRide"
          component={CreateRide}
          options={{ headerShown: false}}
        />
        
      </HostStack.Navigator>
  )
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#222',
    padding: 14,
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 4,
    flex:1
  },
  
  
});

