import React, { use } from "react";
import { View, Text, StyleSheet, Modal, Touchable, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { FlatList } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type InvitationsProps = {
  visible: boolean;
  onClose: () => void;
  ride_id?: string; // Optional ride ID if needed for context
};

type Ride = {
    ride_id: string;
    requested_at: string;
    user_id: string;
    status: string;
    username: string;
};

export default function Invitations({ visible, onClose, ride_id}: InvitationsProps) {
    
    const [invitations, setInvitations] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const getInvitations = async (ride_Id?: string) => {
        try {
            const response = await fetch(`http://192.168.1.9:8001/rides/ridejoinrequests/${ride_Id}`);
            const data = await response.json();
            setInvitations(data);
            console.log("Fetched invitations:", data);
        } catch (error) {
            console.error("Error fetching invitations:", error);
        } finally {
            setLoading(false); // set after fetch finishes
        }
    };

    const handleAcceptInvitation = async (rideId: string, userId: string) => {
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
        }
    };

    const handleDeclineInvitation = async (rideId: string, userId: string) => {
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
        }
    }

    useEffect(() => {
        getInvitations(ride_id)
    }, [ride_id]);

    const renderRideInvitations = ({item}: {item: Ride}) => {

        const formattedDate = new Date(item.requested_at).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        return(
        <View key={item.ride_id} style={styles.rideContainer}>
            <View>
            <Text style={styles.rideTitle}>{item.username}</Text>
            <Text style={styles.rideDescription}>Requested at: {formattedDate}</Text>
            <Text style={styles.rideStatus}>Status: {item.status}</Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={{ flex: 1, alignItems: "center" }}>
                <TouchableOpacity onPress={() => handleAcceptInvitation(item.ride_id, item.user_id)}>
                <MaterialCommunityIcons name="check-bold" size={24} color="#C62828" />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
                <TouchableOpacity onPress={() => handleDeclineInvitation(item.ride_id, item.user_id)}>
                <MaterialCommunityIcons name="close-thick" size={24} color="#C62828" />
                </TouchableOpacity>
            </View>
            </View>

        </View>
        );
    };
     
    


    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={styles.container}>
            <View style={styles.modalView}>
            <FlatList 
                data={invitations}
                renderItem={renderRideInvitations}
                keyExtractor={(item) => item.ride_id}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                loading ? (
                    <Text style={{ color: '#000', textAlign: 'center' }}>Loading Invites...</Text>
                ) : (
                    <Text style={{ color: '#000', textAlign: 'center' }}>No Invitations</Text>
                )
                }
            />
            <Text style={styles.closeButton} onPress={onClose}>
                Close
            </Text>
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
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
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