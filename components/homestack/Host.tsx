import React, { use, useEffect } from "react";
import {View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList} from "react-native";
import { AuthContext } from "../authstack/AuthContext";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Invitations from "../Elements/Invitations";

type Ride = {
  image_url: string;
  title: string;
  description: string;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time: string;
  current_riders: number;
  ride_id: string;
  invite_count: number;
};

export default function Host() {

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [startLocation, setStartLocation] = React.useState("");
    const [endLocation, setEndLocation] = React.useState("");
    const [startTime, setStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const { userInfo } = React.useContext(AuthContext);
    const [rides, setRides] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [invitationsVisible, setInvitationsVisible] = React.useState(false);
    

    const getRides = async (userId?: string) => {
        try {
        const params = new URLSearchParams();
        if (userId) {
            params.append("created_by", userId);
        }

        const response = await fetch(`http://192.168.1.8:8001/rides/?${params.toString()}`);
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

    const createRide = async () => {
        try {
            const response = await fetch("http://192.168.1.8:8001/rides/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    start_location: startLocation,
                    end_location: endLocation,
                    start_time: startTime,
                    end_time: endTime,
                    current_riders: 1,
                }),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log("Ride created successfully:", data);
        } catch (error) {
            console.error("Error creating ride:", error);
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
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, backgroundColor: "#C62828", borderRadius: 20, padding: 5, paddingHorizontal: 10 }}>
                <Text style={{ color: "#ECEFF1", fontSize: 12 }}>Exit Ride</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setInvitationsVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, backgroundColor: "#C62828", borderRadius: 20, padding: 5, paddingHorizontal: 10 }}>
                <Text style={{ color: "#ECEFF1", fontSize: 12 }}>Invitations {item.invite_count?`(${item.invite_count})`:'' }</Text>
                </TouchableOpacity>
            </View>
            <Invitations visible={invitationsVisible} onClose={() => setInvitationsVisible(false)} ride_id ={item.ride_id }></Invitations>
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
    }, [userInfo]);


    return (
        <View style={{ flex: 1, justifyContent: "flex-start", backgroundColor : "#121212" , padding: 25}}>
          <View style={{ flex:3}}>
            <View>
                <Text style={{ fontSize: 24, fontFamily: "Inter_18pt-SemiBold", color: "#C62828", marginBottom: 10 }}>
                    Active Rides
                </Text>
            </View>
            <FlatList
                data={rides}
                renderItem={renderRide}
                keyExtractor={(item) => item.title}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    loading ? (
                    <Text style={{ color: '#fff', textAlign: 'center' }}>Loading rides...</Text>
                    ) : (
                    <Text style={{ color: '#fff', textAlign: 'center' }}>No rides available</Text>
                    )
                }
            />
          </View>
          <View style={{flex:2}}>
            <Text style={{ fontSize: 24, fontFamily: "Inter_18pt-SemiBold", color: "#C62828", marginBottom: 10 }}>
                Create Ride
            </Text>
          </View>

            

        
        </View>
    );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#222',
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
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