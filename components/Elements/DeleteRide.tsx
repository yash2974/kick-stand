import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { getValidAccessToken } from '../../Auth/checkToken';
import { handleLogout } from '../../Auth/handleLogout';
import { AuthContext } from '../authstack/AuthContext';
import { useNavigation } from '@react-navigation/native';

type DeleteRideProps = {
  visible: boolean;
  onClose: () => void;
  ride_id: number; 
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteRide = ({ visible, onClose, ride_id, loading, setLoading }: DeleteRideProps) => {
  const { setUserInfo } = useContext(AuthContext)
  const navigation = useNavigation()

  const deleteRides = async (ride_id: number) => {
    setLoading(true)
    const accessToken = await getValidAccessToken();
      if (!accessToken){
        onClose();
        handleLogout(navigation, setUserInfo);
        return;
      }
      try{
        const response = await fetch(`https://kick-stand.onrender.com/rides/deleteride/${ride_id}`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok){
          alert("rideDeleteted")
        }
        else{
          alert("failed")
        }
        onClose()
      }
      catch (error){
        console.log("error")
      }
      finally{
        setLoading(false)
      }
  }


  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Do you want to delete Ride?</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={()=>{deleteRides(ride_id)}} style={[styles.buttonCancel,{backgroundColor: loading ? "#9E9E9E" :"#C62828",}]}>
              <Text style={{ color: '#ECEFF1', fontFamily: "Inter_18pt-Regular" }}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={[styles.buttonCancel,{backgroundColor: loading ? "#9E9E9E" :"#C62828",}]}>
              <Text style={{ color: '#ECEFF1', fontFamily: "Inter_18pt-Regular" }}>Cancel</Text>
            </TouchableOpacity>
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
  },
  modalView: {
    width: "80%",
    padding: 20,
    backgroundColor: "#1F1F1F",
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Inter_18pt-SemiBold"
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  buttonCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  }
});

export default DeleteRide;
