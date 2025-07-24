import { View, Text, Modal, Touchable, TouchableOpacity, Linking, Image } from 'react-native'
import React from 'react'
import type { Ride } from '../homestack/Rides';
import LottieView from 'lottie-react-native';

type RideJoinByCodeModalProp = {
  visible: boolean;
  onClose: () => void;
  ride: Ride;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  
}
const RideModal = ({visible, onClose, ride}: RideJoinByCodeModalProp ) => {
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
        <LottieView source={require('../../assets/loading/RideJoinCode.json')} autoPlay loop style={{ width: 100, height: 100 }} />
        <View>
          <Text style={{color:"#C62828", fontFamily: "Inter_18pt-Bold", fontSize: 15, marginVertical: 8}}>Ride Details</Text>
          <View style={{flexDirection: "row"}}>
            <Text style={{ color:"#ECEFF1", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>Title: </Text>
            <Text style={{ color:"#9c908f", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>{ride.title}</Text>
          </View>
          <View style={{flexDirection: "row"}}>
            <Text style={{ color:"#ECEFF1", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>Description: </Text>
            <Text style={{ color:"#9c908f", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>{ride.description}</Text>
          </View>
          <View style={{flexDirection: "row"}}>
            <Text style={{ color:"#ECEFF1", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>From: </Text>
            <Text style={{ color:"#9c908f", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>{ride.start_location}</Text>
          </View>
          <View style={{flexDirection: "row"}}>
            <Text style={{ color:"#ECEFF1", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>To: </Text>
            <Text style={{ color:"#9c908f", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>{ride.end_location}</Text>
          </View>
          <View style={{flexDirection: "row"}}>
            <Text style={{ color:"#ECEFF1", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>Time: </Text>
            <Text style={{ color:"#9c908f", fontFamily: "Inter_18pt-Regular", fontSize: 12, marginVertical: 2}}>{ride.start_time}</Text>
          </View>
          <View style={{flexDirection: "row"}}>
            <TouchableOpacity onPress={()=>Linking.openURL(ride.map_url)}>
              <Image source={require('../../assets/photos/logo.png')} style={{ width: 25, height: 25, marginTop: 8 }}/> 
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

export default RideModal