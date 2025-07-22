import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { getValidAccessToken } from '../../Auth/checkToken';
import { handleLogout } from '../../Auth/handleLogout';
import { AuthContext } from '../authstack/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { HomeNavigationProp } from '../homestack/Forums';
import type { RootNavigationProp } from '../../App';


type ReportRideProps = {
  visible: boolean;
  onClose: () => void;
  ride_id: number; 
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  user_id: string | undefined;
  ride_owner_user_id: string;
};

const DeletePost = ({ visible, onClose, ride_id, loading, setLoading, user_id, ride_owner_user_id}: ReportRideProps) => {
  const { setUserInfo } = useContext(AuthContext)
  const rootnavigation = useNavigation<RootNavigationProp>();
  

  const reportRide = async () => {
          const access_token = await getValidAccessToken();
          if (!access_token) {
              await handleLogout(rootnavigation, setUserInfo);
              return;
          }
          if (loading) return;
          setLoading(true);
          try {
              const response = await fetch (`https://kick-stand.onrender.com/report-ride/`,{
                  method: "POST",
                  headers: {
                  "Content-Type": "application/json",
                  // Authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({
                      post_id: ride_id,
                      user_id: ride_owner_user_id,
                      reported_by: user_id
                  })
              });
              if (!response.ok){
                  console.log("error");
                  return;
              }
              const data = await response.json();
              alert(data.message)

          }
          catch (error){
              console.log("error");
          }
          finally{
                onClose();
                setLoading(false);
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
          <Text style={styles.modalText}>Do you want to report the Ride? </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={()=>{reportRide()}} style={[styles.buttonCancel, {backgroundColor: loading ? "#9E9E9E" : "#C62828"}]}>
              <Text style={{ color: '#fff' }}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}style={[styles.buttonCancel, {backgroundColor: loading ? "#9E9E9E" : "#C62828"}]} disabled={loading}>
              <Text style={{ color: '#fff' }}>Cancel</Text>
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
    fontSize: 15,
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Inter_18pt-Regular"
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

export default DeletePost;
