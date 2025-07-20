import { View, Text, Modal, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { DateTimePickerComponent } from './DateTimePickerComponent';
import { AuthContext } from '../authstack/AuthContext';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getValidAccessToken } from '../../Auth/checkToken';
import { handleLogout } from '../../Auth/handleLogout';
import { useNavigation } from '@react-navigation/native';
import type { RootNavigationProp } from '../../App';

const CreateRide = () => {

    const [startTime, setStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [startLocation, setStartLocation] = React.useState("");
    const [endLocation, setEndLocation] = React.useState("");
    const { userInfo, setUserInfo } = useContext(AuthContext)
    const rootNavigation = useNavigation<RootNavigationProp>();

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
                        image_url: image_url
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
        <View>
            <Text>MyComponent</Text>
        </View>
    )
};

export default CreateRide;



