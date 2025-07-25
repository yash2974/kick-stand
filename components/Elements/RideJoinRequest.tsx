import { View, Text, Modal, Button, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../authstack/AuthContext'
import { getValidAccessToken } from '../../Auth/checkToken'
import { handleLogout } from '../../Auth/handleLogout'
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native'

type RideJoinRequest = {
    visible: boolean,
    onClose : () => void,
    description: String,
    title: String,
    ride_id: number,
    created_by: String,
    
    
}

const RideJoinRequest = ({visible, onClose, description, title, ride_id, created_by}: RideJoinRequest) => {
    const navigation = useNavigation()
    const { userInfo, setUserInfo } = useContext(AuthContext)
    const user_id = userInfo?.user.id
    const sendRideJoinRequest = async () => {
        const accessToken = await getValidAccessToken();
            if (!accessToken){
                onClose();
                handleLogout(navigation, setUserInfo);
                return;
            }
        try{
            const response = await fetch('https://kick-stand.onrender.com/rides/ridejoinrequests/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
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
        catch(error){
            console.log("error")
        }


    }   
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose} animationType='fade'>
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
            <View style={{backgroundColor: "#1F1F1F", padding: 20, width: "70%", alignItems: "center", justifyContent: "center", borderRadius: 10}}>
                <Text style={{color: "#ECEFF1", fontFamily: "Inter_18pt-Bold", fontSize: 15}}>Request saddle space for {title}</Text>
                <Text style={{color: "#9E9E9E", fontFamily: "Inter_18pt-Bold", fontSize: 10, marginBottom: 10}}>{description}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                    <TouchableOpacity onPress={()=>sendRideJoinRequest() } style={{ flex: 1, marginRight: 5 }}>
                        <View style={{backgroundColor: "#C62828", justifyContent: "center", alignItems: "center", borderRadius: 4, padding: 5}}>
                            <Text style={{color: "#ECEFF1", fontFamily: "Inter_18pt-Regular", fontSize: 12}}>
                                Send Request
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>onClose()} style={{ flex: 1, marginLeft: 5 }}>
                        <View style={{backgroundColor: "#C62828", justifyContent: "center", alignItems: "center", borderRadius: 4, padding: 5}}>
                            <Text style={{color: "#ECEFF1", fontFamily: "Inter_18pt-Regular", fontSize: 12}}>
                                Cancel
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
  )
}

export default RideJoinRequest