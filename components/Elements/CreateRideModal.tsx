import { View, Text, Modal, StyleSheet, TextInput, Button } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { DateTimePickerComponent } from './DateTimePickerComponent';
import { AuthContext } from '../authstack/AuthContext';

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
            try {
                const response = await fetch("http://192.168.1.9:8001/rides/", {
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

    useEffect(()=>{
          console.log(startTime)
          console.log(endTime)
        }, [startTime, endTime])

    return (
        <Modal visible={visible} onRequestClose={onClose} transparent={true} animationType='fade'>
            <View style={styles.container}>
                
                    <View>
                        <View style={{backgroundColor:"#1F1F1F", borderRadius: 20, padding: 20}}>
                            <View>
                                <Text style={{color: "#fff", fontFamily: "Inter_18pt-SemiBold", fontSize: 24}}>Host Ride</Text>
                            </View>

                            <View style={{backgroundColor: "#424242", borderRadius: 8, marginVertical: 8, paddingHorizontal: 8, height: 40}}>
                                <TextInput placeholder="Title" placeholderTextColor="#ccc" onChangeText={setTitle} />
                            </View>

                            <View style={{backgroundColor: "#424242", borderRadius: 8, marginVertical: 8, paddingHorizontal: 8, height: 40}}>
                                <TextInput placeholder="Description" placeholderTextColor="#ccc" onChangeText={setDescription} />
                            </View>

                            <View style={{flexDirection: "row", justifyContent: "space-between", gap: 12, marginVertical: 8, height: 40}}>
                                <View style={{backgroundColor: "#424242", borderRadius: 8, paddingHorizontal: 8, flex: 1}}>
                                    <TextInput placeholder="Starting Point" placeholderTextColor="#ccc" onChangeText={setStartLocation} />
                                </View>
                                <View style={{backgroundColor: "#424242", borderRadius: 8, paddingHorizontal: 8, flex: 1, height: 40}}>
                                    <TextInput placeholder="Destination" placeholderTextColor="#ccc" onChangeText={setEndLocation}/>
                                </View>
                            </View>
                            <View>
                                <DateTimePickerComponent
                                    onStartChange={(val) => setStartTime(val)}
                                    onEndChange={(val) => setEndTime(val)}
                                />
                            </View>
                            <View style={{marginVertical: 8, flexDirection: "row", width: "100%", justifyContent: "space-evenly"}}>
                                <Button title = "Submit" color="#C62828" onPress={()=>{
                                    createRide();
                                    onClose()
                                }}/>
                                <Button title = "Reset" color="#C62828" onPress={()=>console.log("submit")}/>
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