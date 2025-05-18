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

    useEffect(() => {
        get_user_details();
    }, [user_id]);

    return (
        <View style={{ flex: 1, backgroundColor: "#000000", padding: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
                <Image
                    source={image_url ? { uri: image_url } : undefined}
                    style={{ width: 80, height: 80, borderRadius: 50 }}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Image src=/>
                </View>
            </View>
        </View>
    );
    }