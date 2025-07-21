import { View, Text, Modal, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { DateTimePickerComponent } from './DateTimePickerComponent';
import { AuthContext } from '../authstack/AuthContext';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getValidAccessToken } from '../../Auth/checkToken';
import { handleLogout } from '../../Auth/handleLogout';
import { useNavigation } from '@react-navigation/native';
import type { RootNavigationProp } from '../../App';
import type { HostNavigationProp } from '../homestack/Host';
import SafeScreenWrapper from '../homestack/SafeScreenWrapper';

const CreateRide = () => {

    const [startTime, setStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [startLocation, setStartLocation] = React.useState("");
    const [endLocation, setEndLocation] = React.useState("");
    const { userInfo, setUserInfo } = useContext(AuthContext)
    const rootNavigation = useNavigation<RootNavigationProp>();
    const hostnavigation = useNavigation<HostNavigationProp>();
    const [privateRide, setPrivateRide] = useState(false)
    const [loading, setLoading] = useState(false)

    const user_id = userInfo?.user.id
    const image_url = userInfo?.user.photo

    const createRide = async () => {
        const accessToken = await getValidAccessToken();
            if (!accessToken){
                handleLogout(rootNavigation, setUserInfo);
                return;
            }

            if (!title || !description || !startLocation || !endLocation || !startTime || !endTime){
                alert("fill all fields");
                return;
            }
            try {
                const response = await fetch("https://kick-stand.onrender.com/rides/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        created_by : user_id,
                        title: title,
                        description: description,
                        start_location: startLocation,
                        end_location: endLocation,
                        start_time: startTime,
                        end_time: endTime,
                        current_riders: 1,
                        image_url: image_url,
                        private: privateRide
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
    
    const resetFields = () => {
        setTitle("");
        setDescription("");
        setStartLocation("");
        setEndLocation("");
        setStartTime("");
        setEndTime("");
    }

    useEffect(()=>{
          console.log(startTime)
          console.log(endTime)
        }, [startTime, endTime])

    return(
        <View style={{ flex: 1, backgroundColor: "#121212" }}>
            <SafeScreenWrapper>
            <View
                style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 15,
                paddingTop: 15,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => hostnavigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={20} color="#C62828" />
                </TouchableOpacity>
                <Text
                    style={{
                    fontFamily: "Inter_18pt-SemiBold",
                    fontSize: 20,
                    color: "#ECEFF1",
                    marginHorizontal: 6,
                    }}
                >
                    Host Ride
                </Text>
                </View>
                <TouchableOpacity
                style={{
                    backgroundColor: loading ? "#9E9E9E":"#C62828",
                    alignItems: "center",
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    borderRadius: 20,
                    flexDirection: "row",
                    justifyContent: "center"
                }}
                onPress={()=>console.log("host")}
                disabled = {loading}
                >
                <Text
                    style={{
                    fontFamily: "Inter_18pt-Bold",
                    fontSize: 12,
                    color: "#ECEFF1",
                    marginRight: 4
                    }}
                >
                    Post
                </Text>
                <MaterialCommunityIcons name="send" size={12} style={{color: "#ECEFF1"}}/>
                </TouchableOpacity>
            </View>
            
        </SafeScreenWrapper>
    </View>
    )
};

export default CreateRide;



