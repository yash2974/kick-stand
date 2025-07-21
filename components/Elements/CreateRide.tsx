import { View, Text, Modal, StyleSheet, TextInput, Button, TouchableOpacity, Image, Linking } from 'react-native'
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
    const [privateRide, setPrivateRide] = useState(false);
    const [map_url, setMap_url] = useState("");
    const [loading, setLoading] = useState(false);

    const user_id = userInfo?.user.id
    const image_url = userInfo?.user.photo

    const createRide = async () => {
        setLoading(true)
        const accessToken = await getValidAccessToken();
            if (!accessToken){
                handleLogout(rootNavigation, setUserInfo);
                return;
            }

            if (!title || !description || !startLocation || !endLocation || !startTime || !endTime){
                alert("fill all fields");
                setLoading(false);
                return;
            }
            const start_time = startTime
            const localDateStart = new Date(start_time)
            const utcTimeStart = localDateStart.toISOString();
            const end_time = startTime
            const localDateEnd = new Date(end_time)
            const utcTimeEnd = localDateEnd.toISOString();
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
                        start_time: utcTimeStart,
                        end_time: utcTimeEnd,
                        current_riders: 1,
                        image_url: image_url,
                        private: privateRide,
                        map_url: map_url
                    }),
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                console.log("Ride created successfully:", data);
                resetFields();
                hostnavigation.reset({
                    index: 0,
                    routes: [{ name: 'HostContent' }],
                });
            } catch (error) {
                console.error("Error creating ride:", error);
            }
            finally{
                setLoading(false)
            }
    }

    const openGoogleMaps= ()=> {
        const url = "https://www.google.com/maps"
        Linking.openURL(url);
    }
    
    const resetFields = () => {
        setTitle("");
        setDescription("");
        setStartLocation("");
        setEndLocation("");
        setStartTime("");
        setEndTime("");
        setMap_url("")
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
                onPress={()=>createRide()}
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
            <View style={{ flex: 1, paddingHorizontal: 15 }}>
                <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                multiline
                numberOfLines={1} 
                maxLength={100}
                style={{
                    color: "#ECEFF1",
                    fontSize: 20,
                    marginVertical: 8,
                    textAlignVertical: "top",
                    fontFamily: "Inter_18pt-SemiBold"
                }}
                />
                <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4} 
                maxLength={200}
                style={{
                    color: "#ECEFF1",
                    fontSize: 15,
                    marginVertical: 8,
                    textAlignVertical: "top",
                    fontFamily: "Inter_18pt-Regular"
                }}
                />
                <View style={{height: 1, backgroundColor: "#1F1F1F"}}/>
                <View style={{justifyContent: "space-evenly", flexDirection: "row"}}>
                    <TextInput
                    placeholder='Start Point'
                    value={startLocation}
                    onChangeText={setStartLocation}
                    maxLength={100}
                    numberOfLines={1}
                    style={{
                        color: "#ECEFF1",
                        fontSize: 15,
                        marginVertical: 8,
                        textAlignVertical: "top",
                        flex: 1,
                        fontFamily: "Inter_18pt-Regular"
                    }}
                    />
                    <View style={{width: 1, backgroundColor: "#1F1F1F"}}/>
                    <TextInput
                    placeholder='End Point'
                    value={endLocation}
                    onChangeText={setEndLocation}
                    maxLength={100}
                    numberOfLines={1}
                    style={{
                        color: "#ECEFF1",
                        fontSize: 15,
                        marginVertical: 8,
                        textAlignVertical: "top",
                        flex: 1,
                        fontFamily: "Inter_18pt-Regular"
                    }}
                    />
                </View>
                <View style={{height: 1, backgroundColor: "#1F1F1F"}}/>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <TouchableOpacity style={{marginVertical: 10}} onPress={openGoogleMaps}>
                        <Image source={require('../../assets/photos/logo.png')} style={{ width: 30, height: 30 }}/>
                    </TouchableOpacity>
                    <TextInput
                    placeholder='Google Maps Link'
                    placeholderTextColor="#66BB6A"
                    value={map_url}
                    onChangeText={setMap_url}
                    maxLength={100}
                    numberOfLines={1}
                    style={{
                        marginHorizontal: 6,
                        color: "#66BB6A",
                        fontSize: 12,
                        marginVertical: 8,
                        textAlignVertical: "top",
                        flex: 1,
                        fontFamily: "Inter_18pt-Regular"
                    }}
                    />
                    <TouchableOpacity>
                        <MaterialCommunityIcons name="help-circle" size={20} style={{color: "#66BB6A", margin: 8}}/>
                    </TouchableOpacity>
                </View>
                <DateTimePickerComponent
                onStartChange={(val) => setStartTime(val)}
                onEndChange={(val) => setEndTime(val)}
                />

                <Text style={{ marginTop: 20, color: "white" }}>
                Start: {startTime}
                </Text>
                <Text style={{ color: "white" }}>
                End: {endTime}
                </Text>
                <Button title="private" onPress={()=>setPrivateRide(!privateRide)}></Button>
            </View>   
        </SafeScreenWrapper>
    </View>
    )
};

export default CreateRide;



