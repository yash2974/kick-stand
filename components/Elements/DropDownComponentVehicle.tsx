import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { AuthContext } from '../authstack/AuthContext';
import { getValidAccessToken } from '../../Auth/checkToken';
import { handleLogout } from '../../Auth/handleLogout';
import { useNavigation } from '@react-navigation/native';
 

        
  
type Props = {
  vehicleValue: string | null;
  setVehicleValue: (val: string) => void;
};

const DropdownComponent: React.FC<Props> = ({ vehicleValue, setVehicleValue}) => {
    const [isFocus, setIsFocus] = useState(false);
    const [formattedData, setFormattedData] = React.useState([])
    const { userInfo, setUserInfo } = useContext(AuthContext);
    const user_id = userInfo?.user.id
    const navigation = useNavigation();
    



    const get_vehicle_user = async () => {
      const accessToken = await getValidAccessToken();
            if (!accessToken){
              handleLogout(navigation, setUserInfo)
          }
      try {
        const response = await fetch(`https://kick-stand.onrender.com/vehicles/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!response.ok){
          console.log("error");
        }
        const data = await response.json();
        const dataFormatted = data.map((vehicle: { model_name: any; vehicle_id: any; }) => ({
            label: vehicle.model_name,
            value: vehicle.vehicle_id
        }));
        setFormattedData(dataFormatted)
      } 
      catch (error){
        console.log("error")
      }
          
    }
    

    useEffect(()=>{
        get_vehicle_user();
    },[]);

    return (
      <View style={styles.container}>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: '#C62828' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={formattedData}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Vehicle' : '...'}
          value={vehicleValue}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => setVehicleValue(item.value)}
          containerStyle={styles.dropdownContainer}
          itemContainerStyle={styles.itemContainer}
          itemTextStyle={styles.itemText}
          activeColor="#C62828"
        />
      </View>
    );
  };

  export default DropdownComponent;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#424242',
      padding: 0,
      borderRadius:10
    },
    dropdown: {
      height: 40,
      width:120,
      borderColor: '#C62828',
      borderWidth: 0.5,
      borderRadius: 10,
      paddingHorizontal: 8,
      backgroundColor:"#424242"
    },
    label: {
      position: 'absolute',
      backgroundColor: '#C62828',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
      fontFamily:"Inter_18pt-Bold"
    },
    placeholderStyle: {
      fontSize: 12,
      fontFamily:"Inter_18pt-SemiBold",
      color:"#ECEFF1",
      
    },
    selectedTextStyle: {
      fontSize: 12,
      fontFamily:"Inter_18pt-SemiBold",
      color:"#ECEFF1",
    },
      dropdownContainer: {
      backgroundColor: '#424242',
      borderRadius: 10,
      borderColor: '#C62828',
      borderWidth: 0.5,
    },
    itemContainer: {
      backgroundColor: '#424242',
      borderBottomColor: '#666666',
      borderBottomWidth: 0.5,
      borderRadius:10
    },
    itemText: {
      color: '#ECEFF1',
      fontSize: 12,
      fontFamily: "Inter_18pt-SemiBold",
    },
    
  });