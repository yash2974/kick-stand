import { View, Text, Modal, Button, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../authstack/AuthContext'

type RideJoinRequest = {
    visible: boolean,
    onClose : () => void,
    description: String,
    title: String,
    ride_id: number,
    created_by: String
}




const RideJoinRequest = ({visible, onClose, description, title, ride_id, created_by}: RideJoinRequest) => {

    const { userInfo } = useContext(AuthContext)
    const user_id = userInfo?.user.id
    const sendRideJoinRequest = async () => {
        const response = await fetch('http://192.168.1.9:8001/rides/ridejoinrequests/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user_id,
                ride_id: ride_id
            })
        });
        if (response.ok){
            alert("request succesfully sent")
        }
        else{
            alert("you have already sent the request")
        }
        onClose()


    }   
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose} animationType='fade'>
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
            <View style={{backgroundColor: "#1F1F1F", padding: 20, width: "70%", alignItems: "center", justifyContent: "center", borderRadius: 10}}>
                <Text style={{color: "#ECEFF1", fontFamily: "Inter_18pt-Bold", fontSize: 15}}>Request saddle space for {title}</Text>
                <Text style={{color: "#9E9E9E", fontFamily: "Inter_18pt-Bold", fontSize: 10, marginBottom: 10}}>{description}</Text>
                <TouchableOpacity onPress={()=>sendRideJoinRequest()}>
                    <View style={{backgroundColor: "#C62828", justifyContent: "center", alignItems: "center", borderRadius: 4, padding: 5}}>
                        <Text style={{color: "#ECEFF1", fontFamily: "Inter_18pt-Bold", fontSize: 15}}>
                            Send Request
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
  )
}

export default RideJoinRequest