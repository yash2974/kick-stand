 import React, { useState } from 'react';
  import { StyleSheet, Text, View } from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';
 

  const data = [
    { label: 'Fuel', value: 'Fuel' },
    { label: 'Service', value: 'Service' },
    { label: 'Documents', value: 'Documents' },
    { label: 'Accessories', value: 'Accessories' },
    { label: 'Tyres', value: 'Tyres' },
    { label: 'Other', value: 'Other' },
  ];

  type Props = {
  categoryValue: string | null;
  setCategoryValue: (val: string) => void;
};

const DropdownComponent: React.FC<Props> = ({ categoryValue, setCategoryValue}) => {
    const [isFocus, setIsFocus] = useState(false);
  

    return (
      <View style={styles.container}>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: '#C62828' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={data}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Category' : '...'}
          value={categoryValue}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => setCategoryValue(item.value)}
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