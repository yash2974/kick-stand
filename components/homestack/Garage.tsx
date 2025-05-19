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
        const response = await fetch(`http://192.168.1.5:8001/users/${user_id}`, {
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
        const response = await fetch("http://192.168.1.5:8001/vehicles/", {
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
            const response = await fetch(`http://192.168.1.5:8001/vehicles/${user_id}`);
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
        <View style={{ flex: 1, flexDirection:"column", backgroundColor: "#121212", padding: 10 }}>
            <View>
                <Text style={{ color: "#C62828" ,fontFamily:"Inter_18pt-Bold",fontSize: 20 }}>Hello</Text>
                <Text style={{ fontSize: 20 ,color: "#C62828"}}>Default Font</Text>
            </View>
        </View>
    );
    }