import React, { use, useEffect } from "react";
import { View,Image, FlatList, TextInput, Button, Modal} from "react-native";
import { Text } from "react-native-gesture-handler";
import { AuthContext } from "../authstack/AuthContext";
import { useContext } from "react";

type UserDetails = {
    name: string;
    phone: string;
    email: string;
};

export default function Garage() {
    const { userInfo } = useContext(AuthContext);
    const image_url = (userInfo?.user.photo);
    const [userDetails, setUserDetails] = React.useState<UserDetails | null>(null);
    const [userVehicles, setUserVehicles] = React.useState<any[]>([]);
    const [add_vehicle, setAddVehicle] = React.useState<string>("")
    const [model_name, setModelName] = React.useState<string>("");
    const [modalVisible, setModalVisible] = React.useState(false);

    const user_id = userInfo?.user.id;

    const get_user_details = async () => {
        const response = await fetch(`http://192.168.1.6:8001/users/${user_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        setUserDetails(data);
        console.log("User details", data);
    }

    const add_user_vehicles = async () => {
        const response = await fetch("http://192.168.1.6:8001/vehicles/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user_id,
                vehicle_id: add_vehicle,
                model_name: model_name

            }),
        });
    }

    const get_user_vehicles = async () => {
        try {
            const response = await fetch(`http://192.168.1.6:8001/vehicles/${user_id}`);
            const data = await response.json();
            setUserVehicles(data);
        } catch (error) {
            console.error("Failed to fetch vehicles:", error);
        }
    };
    useEffect(() => {
        get_user_details();
        get_user_vehicles();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "#000000", padding: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
                <Image
                    source={image_url ? { uri: image_url } : undefined}
                    style={{ width: 100, height: 100, borderRadius: 50, borderColor: "#0F9FE1", borderWidth: 5 }}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ color: "#ffffff" }}>{userDetails?.name}</Text>
                    <Text style={{ color: "#ffffff" }}>{userDetails?.phone}</Text>
                    <Text style={{ color: "#ffffff" }}>{userDetails?.email}</Text>
                </View>
            </View>

            <View style={{ padding: 20 }}>
                <Text style={{ color: "#0F9FE1", fontSize: 18, marginBottom: 10 }}>Your Vehicles:</Text>
                <FlatList
                    data={userVehicles}
                    keyExtractor={(item) => item.vehicle_id}
                    renderItem={({ item }) => (
                        <View style={{ backgroundColor: "#1a1a1a", padding: 10, marginBottom: 10, borderRadius: 10 }}>
                            <Text style={{ color: "#ffffff" }}>Model: {item.model_name}</Text>
                            <Text style={{ color: "#aaaaaa" }}>Vehicle ID: {item.vehicle_id}</Text>
                        </View>
                    )}
                />
                <View style={{ backgroundColor: "#1a1a1a", padding: 10, marginBottom: 10, borderRadius: 10 }}>
                    <Button title="Add Vehicle" onPress={()=> setModalVisible(true)} />
                </View>
                <Modal
                    visible={modalVisible} 
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                        <View style={{ width: "80%", backgroundColor: "#1a1a1a", padding: 20, borderRadius: 10 }}>
                            <Text style={{ color: "#0F9FE1", fontSize: 18, marginBottom: 10 }}>Add Vehicle</Text>
                            <TextInput
                                placeholder="Model Name"
                                placeholderTextColor="#aaaaaa"
                                value={model_name}
                                onChangeText={setModelName}
                                style={{ backgroundColor: "#2a2a2a", color: "#ffffff", padding: 10, borderRadius: 5, marginBottom: 10 }}
                            />
                            <TextInput
                                placeholder="Vehicle ID"
                                placeholderTextColor="#aaaaaa"
                                value={add_vehicle}
                                onChangeText={setAddVehicle}
                                style={{ backgroundColor: "#2a2a2a", color: "#ffffff", padding: 10, borderRadius: 5, marginBottom: 10 }}
                            />
                            <Button title="Add" onPress={add_user_vehicles} />
                            <Button title="Close" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </Modal> 
            </View>
        </View>
    );
    }