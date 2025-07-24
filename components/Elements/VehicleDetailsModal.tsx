import { View, Text, Modal, Touchable, TouchableOpacity, Linking, Image } from 'react-native'
import React, {useContext, useEffect, useState} from 'react'
import LottieView from 'lottie-react-native';
import { getValidAccessToken } from '../../Auth/checkToken';
import { handleLogout } from '../../Auth/handleLogout';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../../App';
import { AuthContext } from '../authstack/AuthContext';

type VehicleDetailsModalProp = {
  visible: boolean;
  onClose: () => void;
  vehicle: string;
  
}

type VehicleDetails = {
    Brand: string,
    Price: string,
    "Engine Capacity": string;
    model_name: string;
}


const VehicleDetailsModal = ({visible, onClose, vehicle}: VehicleDetailsModalProp ) => {

    const [loading, setLoading] = useState(false);
    const rootnavigation = useNavigation<RootNavigationProp>();
    const {setUserInfo} = useContext(AuthContext);
    const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(null);
    const getVehicleDetails = async () => {
        setLoading(true);
            const accessToken = await getValidAccessToken();
            if (!accessToken) {
                handleLogout(rootnavigation, setUserInfo);
            }
            try {
                const response = await fetch(`https://kick-stand.onrender.com/vehicles_details/${vehicle}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                }
                });
                if (!response.ok){
                console.log("error fetching");
                setLoading(false);
                return;
                }
                const data = await response.json();
                setVehicleDetails(data);
            }
            catch (error) {
                console.log("error");
            } finally {
                setLoading(false);
            }    
    }

    useEffect(()=>{
    if (vehicle && visible) { // Only fetch when modal is visible and vehicle is set
        getVehicleDetails();
    }
}, [vehicle, visible]);
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
      animationType="fade">
      <TouchableOpacity
        onPress={onClose}
        style={{flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",}}>
        <View style={{
          padding: 30,
          borderWidth: 1,
          borderColor: "#C62828",
          backgroundColor: "#1F1F1F",
          borderRadius: 10,
          alignItems: 'center',
          width: 250,
          height: 300}}>
        <LottieView source={require('../../assets/loading/MotorcycleDetails.json')} autoPlay loop style={{ width: 200, height: 100 }} />
        <View>
          <Text style={{color:"#C62828", fontFamily: "Inter_18pt-Bold", fontSize: 15, marginVertical: 8}}>Motorcycle Details</Text>
          <View style={{flexDirection: "row", flexWrap: "wrap", maxWidth: "100%"}}>
            <Text style={{ color:"#ECEFF1", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2, flexShrink: 1 }}>Model: </Text>
            <Text style={{ color:"#9c908f", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>{vehicleDetails?.model_name}</Text>
          </View>
          <View style={{flexDirection: "row", flexWrap: "wrap", maxWidth: "100%"}}>
            <Text style={{ color:"#ECEFF1", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>Brand: </Text>
            <Text style={{ color:"#9c908f", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>{vehicleDetails?.Brand}</Text>
          </View>
          <View style={{flexDirection: "row", flexWrap: "wrap", maxWidth: "100%"}}>
            <Text style={{ color:"#ECEFF1", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>CC: </Text>
            <Text style={{ color:"#9c908f", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>{vehicleDetails?.['Engine Capacity']}</Text>
          </View>
          <View style={{flexDirection: "row", flexWrap: "wrap", maxWidth: "100%"}}>
            <Text style={{ color:"#ECEFF1", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>Price: </Text>
            <Text style={{ color:"#9c908f", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>{vehicleDetails?.Price}</Text>
          </View>
        </View>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

export default VehicleDetailsModal