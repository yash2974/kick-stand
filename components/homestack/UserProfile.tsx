import React, { use, useEffect } from "react";
import { View,Image, FlatList, TextInput, Button, Modal} from "react-native";
import { Text } from "react-native-gesture-handler";
import { AuthContext } from "../authstack/AuthContext";
import { useContext } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

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
    const rating = 4

    const user_id = userInfo?.user.id;

    const get_user_details = async () => {
        const response = await fetch(`http://192.168.1.9:8001/users/${user_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        setUserDetails(data);
        console.log("User details", data);
    }

    const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
        return (
            <View style={{ flexDirection: 'row' }}>
            {[...Array(5)].map((_, index) => (
                <Ionicons
                key={index}
                name={index < rating ? 'star' : 'star-outline'}
                size={20}
                color="#ffffff"
                />
            ))}
            </View>
        );
    };
    const RankRating: React.FC<{ rating: number }> = ({ rating }) => {
        let rank = "Club Boss"; // default

        if (rating === 1) {
            rank = "Prospect";
        } else if (rating === 2) {
            rank = "Rogue Rider";
        } else if (rating === 3) {
            rank = "Street Nomad";
        } else if (rating === 4) {
            rank = "Chrome Captain";
        }

        return <Text style={{ color: "white", marginLeft: 10 }}>{rank}</Text>;
    };



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
                    <StarRating rating={rating} />
                    <RankRating rating={rating} />
                    
                </View>
            </View>
        </View>
    );
    }