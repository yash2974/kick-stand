import { View, Text, Modal, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { DateTimePickerComponent } from './DateTimePickerComponent';
import { AuthContext } from '../authstack/AuthContext';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
type CreateRideModalProps = {
    visible: boolean;
    onClose: ()=> void
}
const CreateRideModal = ({visible, onClose}: CreateRideModalProps) => {

    const [startTime, setStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [startLocation, setStartLocation] = React.useState("");
    const [endLocation, setEndLocation] = React.useState("");
    const { userInfo } = useContext(AuthContext)

    const user_id = userInfo?.user.id
    const image_url = userInfo?.user.photo

    const createRide = async () => {

            if (!title || !description || !startLocation || !endLocation || !startTime || !endTime){
                alert("fill all fields");
                return;
            }
            try {
                const response = await fetch("https://kick-stand.onrender.com/rides/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
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

    return (
        <Modal visible={visible} onRequestClose={onClose} transparent={true} animationType='fade'>
            <View style={styles.container}>
                
                    <View>
                        <View style={{backgroundColor:"#1F1F1F", borderRadius: 20, padding: 20, width: "90%", maxWidth: "90%", minWidth: "90%" }}>
                            <View style={{flexDirection: "row", alignItems: "baseline", justifyContent: "space-between"}}>
                                <Text style={{color: "#fff", fontFamily: "Inter_18pt-SemiBold", fontSize: 24}}>Host Ride</Text>
                                <TouchableOpacity onPress={()=>{onClose()}}>
                                    <MaterialCommunityIcons name="close" size={20} color="#C62828" />
                                </TouchableOpacity>
                            </View>

                            <View style={{backgroundColor: "#424242", borderRadius: 8, marginVertical: 8, paddingHorizontal: 8}}>
                                <TextInput placeholder="Title" placeholderTextColor="#ccc" onChangeText={setTitle} value={title} multiline={true} />
                            </View>

                            <View style={{backgroundColor: "#424242", borderRadius: 8, marginVertical: 8, paddingHorizontal: 8}}>
                                <TextInput placeholder="Description" placeholderTextColor="#ccc" onChangeText={setDescription} value={description} multiline={true} textAlignVertical="top" />
                            </View>

                            <View style={{flexDirection: "row", justifyContent: "space-between", gap: 12, marginVertical: 8}}>
                                <View style={{backgroundColor: "#424242", borderRadius: 8, paddingHorizontal: 8, flex: 1}}>
                                    <TextInput placeholder="Starting Point" placeholderTextColor="#ccc" onChangeText={setStartLocation} value={startLocation} multiline={true} />
                                </View>
                                <View style={{backgroundColor: "#424242", borderRadius: 8, paddingHorizontal: 8, flex: 1}}>
                                    <TextInput placeholder="Destination" placeholderTextColor="#ccc" onChangeText={setEndLocation} value={endLocation} multiline={true}/>
                                </View>
                            </View>
                            <View>
                                <DateTimePickerComponent
                                    onStartChange={(val) => setStartTime(val)}
                                    onEndChange={(val) => setEndTime(val)}
                                />
                            </View>
                            <View style={{ marginVertical: 8, flexDirection: "row", width: "100%", justifyContent: "space-evenly" }}>
                                <TouchableOpacity
                                    style={{ backgroundColor: "#C62828", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }}
                                    onPress={() => {
                                    createRide();
                                    onClose();
                                    }}
                                >
                                    <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Submit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ backgroundColor: "#C62828", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }}
                                    onPress={() => resetFields()}
                                >
                                    <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Reset</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </View>
            
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    }
})

export default CreateRideModal







/*  */