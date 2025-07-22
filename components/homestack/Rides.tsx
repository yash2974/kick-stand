import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity, Linking } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SafeScreenWrapper from "./SafeScreenWrapper";
import RideJoinRequest from "../Elements/RideJoinRequest";
import { AuthContext } from "../authstack/AuthContext";
import { getValidAccessToken } from "../../Auth/checkToken";
import { handleLogout } from "../../Auth/handleLogout";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ReportRide from "../Elements/ReportRide";

type Ride = {
  ride_id: number;
  image_url: string;
  title: string;
  description: string;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time: string;
  current_riders: number;
  created_by: string;
  map_url: string;
};

export default function Rides() {

  const [rides, setRides] = React.useState<Ride[]>([]);
  const [visibleRides, setVisibleRides] = React.useState<Ride[]>([]);
  const [loading, setLoading] = React.useState(true);
  // const [rideJoinRequestModalVisible, setRideJoinRequestModalVisible] = React.useState(false);
  const [selectedRide, setSelectedRide] = React.useState<Ride | null>(null);
  const [participatedRides, setParticipatedRides] = React.useState<number[]>([]);
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedRideReport, setSelectedRideReport] = React.useState<Ride | null>(null);  
  const user_id = userInfo?.user.id
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const userRides = async () => {
    const accessToken = await getValidAccessToken();
      if (!accessToken){
          handleLogout(navigation, setUserInfo)
    }
    try {
      const response = await fetch(`https://kick-stand.onrender.com/rides/rideparticipants/`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      })
    if (!response.ok){
      console.log("error fetching rides")
      return;
    }
    const data = await response.json();
    setParticipatedRides(data.map((item: {ride_id:number})=>item.ride_id));
    }
    catch (error) {
            console.log("error fetching details")
    }
  }
  const fetchRides = async (debouncedSearch: string) => {
    const accessToken = await getValidAccessToken();
      if (!accessToken){
          handleLogout(navigation, setUserInfo)
    }
    try {
      const response = await fetch(`https://kick-stand.onrender.com/rides?query=${debouncedSearch}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        }
      }
      );
      const data = await response.json();
      setRides(data);
      setVisibleRides(data);
    } catch (error) {
      console.error("Error fetching rides:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    const delayDebounce = setTimeout(()=>{
      setDebouncedSearch(search);
    }, 500)
    return ()=> clearTimeout(delayDebounce)
  }, [search])

  useEffect(() => { 
    fetchRides(debouncedSearch);
    userRides();
    
  }
  , [debouncedSearch]);

  const renderRide = ({ item }: { item: Ride }) => (
    <View>
    { user_id != item.created_by && !participatedRides.includes(item.ride_id) &&
    // fetch ride participants via api and condtinal render to show only rides not joined
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
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, backgroundColor: "#C62828", borderRadius: 20, paddingVertical: 4, paddingHorizontal:8 }} onPress={() => setSelectedRide(item)}>
                <Text style={{ color: "#121212", fontSize: 10, fontFamily: "Inter_18pt-SemiBold" }}>Join Ride</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, backgroundColor: "#B0BEC5", borderRadius: 20, paddingVertical: 4, paddingHorizontal:8, justifyContent: "center" }} onPress={() => setSelectedRideReport(item)}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={12}
                  color="#C62828"
                  style={{marginRight: 3}}
                />
                <Text style={{ color: "#121212", fontSize: 10, fontFamily: "Inter_18pt-SemiBold" }}>Report</Text>
              </TouchableOpacity>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="account-group" size={20} color="#9c908f" />
              <Text style={{ color:"#9c908f", fontFamily: "Inter_18pt-Regular"}}> {item.current_riders}</Text>
            </View>
          </View>
        </View>
      </View>
    }
    
    </View>
    
);

useEffect(()=>{
    const filtered = rides.filter(
      ride => ride.created_by !== user_id && !participatedRides.includes(ride.ride_id)
    );
    setVisibleRides(filtered);
}, [rides, participatedRides])


  return (
    <View style={{flex:1, backgroundColor: "#121212"}}>
    <SafeScreenWrapper>
    <View style={{ flex: 1, justifyContent: "flex-start", backgroundColor : "#121212" , padding: 15}}>
      
        <View>
            <View >
              <View style={{flexDirection:"row",backgroundColor:"#424242", paddingHorizontal: 20, alignItems:"center", borderRadius: 10, marginBottom: 16}}>
                  <MaterialCommunityIcons name="map-marker" size={20} color="#FFFFFF"/>
                  <TextInput placeholder="Search Locations" style={{flex: 1}} onChangeText={setSearch} value={search}></TextInput>
              </View>
            </View>
            <View style={{paddingBottom: insets.bottom + 70}}>
              <FlatList
                data={visibleRides}
                renderItem={renderRide}
                keyExtractor={(item) => String(item.ride_id)}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  loading ? (
                    <Text style={{ color: '#ECEFF1', textAlign: 'center' }}>Loading rides...</Text>
                  ) : (
                    <Text style={{ color: '#ECEFF1', textAlign: 'center' }}>No rides available</Text>
                  )
                }
              />
              {selectedRide && <RideJoinRequest
                visible={true}
                onClose={() => {
                  setSelectedRide(null);
                }}
                description={selectedRide.description}
                title={selectedRide.title}
                ride_id={selectedRide.ride_id}
                created_by={selectedRide.created_by}
                
              /> }
              {
                selectedRideReport && <ReportRide visible={true} onClose={()=>setSelectedRideReport(null)} ride_id={selectedRideReport.ride_id} loading={loading} setLoading={setLoading} user_id={user_id} ride_owner_user_id={selectedRideReport.created_by}/>
              }
    
            </View>

        </View>  
        
    </View>
    
    </SafeScreenWrapper>
    </View>
      
    
  );
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  
});