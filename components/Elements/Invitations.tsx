import React, { use } from "react";
import { View, Text, StyleSheet, Modal, Touchable, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { FlatList } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type InvitationsProps = {
  visible: boolean;
  onClose: () => void;
  ride_id?: number; 
};

type Ride = {
    ride_id: number;
    requested_at: string;
    user_id: string;
    status: string;
    username: string;
};

export default function Invitations({ visible, onClose, ride_id}: InvitationsProps) {
    const [lobby, setLobby] = React.useState([]);
    const [invitations, setInvitations] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const getInvitations = async (ride_Id?: number, status?: string) => {
        try {
            const response = await fetch(`http://192.168.1.9:8001/rides/ridejoinrequests/${status}/${ride_Id}`);
            const data = await response.json();
            if(status=="pending"){
                setInvitations(data);
            }
            else{
                setLobby(data)
            }
            console.log("Fetched invitations:", data);
        } catch (error) {
            console.error("Error fetching invitations:", error);
        } finally {
            setLoading(false); // set after fetch finishes
        }
    };


    const handleAcceptInvitation = async (rideId: number, userId: string) => {
        try {
            const response = await fetch(`http://192.168.1.9:8001/rides/rideparticipants/accept`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ride_id: rideId,
                    user_id: userId,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to accept invitation");
            }
            const data = await response.json();
            console.log("Invitation accepted:", data);
        } catch (error) {
            console.error("Error accepting invitation:", error);
            alert("unsuccessful")
            
        } finally{
            onClose()
            // instead of closing the modal just refresh the modal
        }
    
    };

    const handleDeclineInvitation = async (rideId: number, userId: string) => {
        try {
            const response = await fetch(`http://192.168.1.9:8001/rides/rideparticipants/reject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ride_id: rideId,
                    user_id: userId,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to decline invitation");
            }
            const data = await response.json();
            console.log("Invitation declined:", data);
        } catch (error) {
            console.error("Error declining invitation:", error);
            alert("unsuccessful")
        } finally{
            onClose()
        }
    }

    useEffect(() => {
        getInvitations(ride_id,"pending");
        getInvitations(ride_id,"accepted");
    }, [ride_id]);

    const renderRideInvitations = ({item}: {item: Ride}) => {
        return(
        <View key={item.ride_id} style={{backgroundColor: "#424242", flex: 1, height: 40, borderRadius: 5, marginVertical: 8, flexDirection: "row", justifyContent: "space-between", paddingVertical: 5, paddingHorizontal: 10, alignItems: "center"}}>
            <View>
                <Text style={{fontFamily: "Inter_18pt-Regular", color: "#ECEFF1"}}>{item.username}</Text>
            </View>
            <View style={{flexDirection: "row"}}>
                <TouchableOpacity onPress={()=>handleAcceptInvitation(item.ride_id, item.user_id)}>
                    <View>
                        <MaterialCommunityIcons name="checkbox-marked" size={30} color="#66BB6A"></MaterialCommunityIcons>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>handleDeclineInvitation(item.ride_id, item.user_id)}>
                    <View>
                        <MaterialCommunityIcons name="close-box" size={30} color="#EF6C00" />
                    </View>
                </TouchableOpacity>
            </View>

        </View>
        );
    };

    const renderLobby = ({item}: {item: Ride}) => {
        return(
        <View key={item.ride_id} style={{backgroundColor: "#424242", flex: 1, height: 40, borderRadius: 5, marginVertical: 8, flexDirection: "row", justifyContent: "space-between", paddingVertical: 5, paddingHorizontal: 10, alignItems: "center"}}>
            <View>
                <Text style={{fontFamily: "Inter_18pt-Regular", color: "#ECEFF1"}}>{item.username}</Text>
            </View>
            <View style={{flexDirection: "row"}}>
                <TouchableOpacity onPress={()=>handleDeclineInvitation(item.ride_id, item.user_id)}>
                    <View>
                        <MaterialCommunityIcons name="close-box" size={30} color="#EF6C00" />
                    </View>
                </TouchableOpacity>
            </View>

        </View>
        );
    };
     
    


    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={styles.container}>
            <View style={styles.modalView}>
                <View style={{flex: 1}}>
                    <View style={{flexDirection: "row", alignItems: "baseline", justifyContent: "space-between"}}>
                        <Text style={{color: "#C62828", fontFamily: "Inter_18pt-Bold", fontSize: 30}}>Lobby</Text>
                        <TouchableOpacity onPress={()=>{onClose()}}>
                            <MaterialCommunityIcons name="close" size={20} color="#C62828" />
                        </TouchableOpacity>
                    </View>
                    <FlatList 
                        data={lobby}
                        renderItem={renderLobby}
                        keyExtractor={(item) => item.ride_id.toString()}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                        loading ? (
                            <Text style={{ color: '#ECEFF1', textAlign: 'center' }}>Loading Invites...</Text>
                        ) : (
                            <Text style={{ color: '#ECEFF1', textAlign: 'center', margin: 20, fontFamily: "Inter_18pt-Regular", fontSize: 10 }}>Your throttle buddies haven't called yet.</Text>
                        )
                        }
                    />
                </View>
                <View style={{flex: 1}}>
                    <Text style={{color: "#C62828", fontFamily: "Inter_18pt-Bold", fontSize: 30}}>Requests</Text>
                    <FlatList 
                        data={invitations}
                        renderItem={renderRideInvitations}
                        keyExtractor={(item) => item.ride_id.toString()}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                        loading ? (
                            <Text style={{ color: '#ECEFF1', textAlign: 'center' }}>Loading Invites...</Text>
                        ) : (
                            <Text style={{ color: '#ECEFF1', textAlign: 'center', margin: 20, fontFamily: "Inter_18pt-Regular", fontSize: 10 }}>Your throttle buddies haven't called yet.</Text>
                        )
                        }
                    />
                </View>
            </View>
        </View>
        </Modal>

    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    height: "50%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1F1F1F",
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    color: "#007BFF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
    rideContainer: {
        backgroundColor: "#222",
        padding: 16,
        marginTop: 8,
        borderRadius: 8,
    },
    rideTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#C62828",
    },
    rideDescription: {
        fontSize: 14,
        color: "#9c908f",
    },
    rideStatus: {
        fontSize: 14,
        color: "#9c908f",
    },
    rideClose: {
        fontSize: 14,
        color: "#C62828",
        marginTop: 10,
        textDecorationLine: "underline",
    },

});