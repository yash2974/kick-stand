import React, { useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SafeScreenWrapper from "./SafeScreenWrapper";

type Ride = {
  image_url: string;
  title: string;
  description: string;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time: string;
  current_riders: number;
};

export default function Rides() {

  const [rides, setRides] = React.useState<Ride[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => { 
    const fetchRides = async () => {
      try {
        const response = await fetch("http://192.168.1.9:8001/rides/");
        const data = await response.json();
        setRides(data);
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }
  , []);

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
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, backgroundColor: "#C62828", borderRadius: 20, padding: 5, paddingHorizontal: 10 }}>
          <Text style={{ color: "#ECEFF1", fontSize: 12 }}>Join Ride</Text>
        </TouchableOpacity>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="account-group" size={20} color="#9c908f" />
          <Text style={{ color:"#9c908f"}}> {item.current_riders}</Text>
        </View>
      </View>
    </View>
  </View>
);



  return (
    <View style={{flex:1, backgroundColor: "#121212"}}>
    <SafeScreenWrapper>
    <View style={{ flex: 1, justifyContent: "flex-start", backgroundColor : "#121212" , padding: 25}}>
      
        <View>
            <View style={{flexDirection:"row"}}>
            <View style={{flexDirection:"row",backgroundColor:"#424242", paddingHorizontal: 20, alignItems:"center", borderRadius: 26, margin: 5}}>
                <MaterialCommunityIcons name="map-marker" size={20} color="#FFFFFF"/><Text style={{fontSize: 12, color:"#ECEFF1"}}>Location</Text>
            </View>
            <View style={{flexDirection:"row", backgroundColor:"#424242", paddingHorizontal: 20, paddingVertical: 8, alignItems:"center", borderRadius: 26, margin: 5}}>
                <MaterialCommunityIcons name="calendar-month" size={20} color="#FFFFFF"/><Text style={{fontSize: 12, color:"#ECEFF1"}}> Date</Text>
            </View>
            </View>
            <View>
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

        </View>   
    </View>
    </SafeScreenWrapper>
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
    flexDirection: 'row',
    flex:1
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  
});