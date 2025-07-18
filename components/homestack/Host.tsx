import React, { use, useEffect } from "react";
import {View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Button, Modal} from "react-native";
import { AuthContext } from "../authstack/AuthContext";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Invitations from "../Elements/Invitations";
import { ScreenContentWrapper } from "react-native-screens";
import SafeScreenWrapper from "./SafeScreenWrapper";
import { DateTimePickerComponent } from "../Elements/DateTimePickerComponent";
import { ScrollView } from "react-native-gesture-handler";
import CreateRideModal from "../Elements/CreateRideModal";
import DeleteRide from "../Elements/DeleteRide";
import * as Keychain from 'react-native-keychain'
import { getValidAccessToken } from '../../Auth/checkToken';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";



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
};

export default function Host() {
    const { userInfo, setUserInfo } = React.useContext(AuthContext);
    const [rides, setRides] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedRideId, setSelectedRideId] = React.useState<number | null>(null);
    const [createRidevisible, setCreateRideVisible] = React.useState(false)
    const [deleteRideVisible, setDeleteRideVisible] = React.useState(false)
    const [selectedRideIdDelete, setSelectedRideIdDelete] = React.useState<number | null>(null);
    const navigation = useNavigation()

    const getRides = async (userId?: string) => {
      const token = await getValidAccessToken();
      if (!token){
        await handleLogout();
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
    };

    const handleLogout = async () => {
        try {
          await GoogleSignin.signOut();
          await Keychain.resetGenericPassword({ service: 'access_token' });
          await Keychain.resetGenericPassword({ service: 'refresh_token' });
          setUserInfo(null)
          navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] });
        }
        catch (error) {
          console.error("Logout error:", error);
          alert("Failed to log out. Try again.");
        }
      }

    

    const renderRide = ({ item }: { item: Ride }) => (
      <View style={styles.card}>
        
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ marginRight: 10 }}>
            <Image
              source={{ uri: item.image_url }}
              style={{ width: 30, height: 30, borderRadius: 4 }}
            />
          </View>
          <View style={{ justifyContent: 'flex-end' }}>
            <Text style={[styles.title, { lineHeight: 30 }]}>
              {item.title}
            </Text>
          </View>
        </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: "#9c908f" }}>{item.start_location}</Text>
            <MaterialCommunityIcons
              name="arrow-left-right"
              size={20}
              color="#9c908f"
              style={{ marginHorizontal: 5 }} // horizontal spacing instead of vertical
            />
            <Text style={{ color: "#9c908f" }}>{item.end_location}</Text>
          </View>
    
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="calendar-month" size={20} color="#9c908f" />
            <Text style={{ color:"#9c908f"}}> {new Date(item.start_time).toLocaleString()}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center',width: '100%', justifyContent: 'space-between', marginTop: 10 }}>
            <View style={{ flexDirection:'row'}}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, backgroundColor: "#C62828", borderRadius: 20, padding: 5, paddingHorizontal: 10 }} onPress={()=>setSelectedRideIdDelete(item.ride_id)}>
                <Text style={{ color: "#ECEFF1", fontSize: 12 }}>Delete Ride</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setSelectedRideId(item.ride_id)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, backgroundColor: "#C62828", borderRadius: 20, padding: 5, paddingHorizontal: 10 }}>
                <Text style={{ color: "#ECEFF1", fontSize: 12 }}>Lobby</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="account-group" size={20} color="#9c908f" />
              <Text style={{ color:"#9c908f"}}> {item.current_riders}</Text>
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
              }}/>
            )}
            <View style={{ flex: 1, justifyContent: "flex-start", padding: 15}}>
              <View style={{ flex:3, marginBottom: 8 }}>
                <View style={{marginBottom: 8}}>
                    <Text style={{ fontSize: 24, fontFamily: "Inter_18pt-SemiBold", color: "#C62828"}}>
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
                        <Text style={{ color: '#fff', textAlign: 'center' }}>Loading rides...</Text>
                        ) : (
                        <Text style={{ color: '#fff', textAlign: 'center'}}>No rides available</Text>
                        )
                    }
                />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setCreateRideVisible(true)}
                style={{
                  backgroundColor: "#C62828",
                  marginTop: 12,
                  borderRadius: 10,
                  paddingVertical: 14,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontFamily: "Inter_18pt-SemiBold", color: "#ECEFF1" }}>
                  Create Ride
                </Text>
                <Text style={{ color: "#ECEFF1", fontSize: 12, marginTop: 4 }}>
                  Tap to start hosting your next journey
                </Text>
              </TouchableOpacity>

              
              
            </View>
            <CreateRideModal visible={createRidevisible} onClose={()=>{setCreateRideVisible(false)}}/>
          </SafeScreenWrapper>
        </View>
    );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#222',
    padding: 16,
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 4,
    flex:1
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  
});

