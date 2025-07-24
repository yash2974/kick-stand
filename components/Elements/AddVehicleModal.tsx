import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'

type AddVehicleModalProps = {
  visible: boolean;
  onClose: () => void;
};

const brand = [
  { label: 'Royal Enfield', value: 'Royal Enfield' },
  { label: 'Honda', value: 'Honda' },
  { label: 'TVS', value: 'TVS' },
  { label: 'Yamaha', value: 'Yamaha' },
  { label: 'Hero', value: 'Hero' },
  { label: 'Bajaj', value: 'Bajaj' },
  { label: 'Suzuki', value: 'Suzuki' },
  { label: 'KTM', value: 'KTM' },
  { label: 'Jawa', value: 'Jawa' },
  { label: 'Benelli', value: 'Benelli' },
  { label: 'Harley-Davidson', value: 'Harley-Davidson' },
  { label: 'BMW', value: 'BMW' },
  { label: 'Triumph', value: 'Triumph' },
  { label: 'Kawasaki', value: 'Kawasaki' },
  { label: 'Aprilia', value: 'Aprilia' },
  { label: 'Mahindra', value: 'Mahindra' },
  { label: 'LML', value: 'LML' },
  { label: 'Moto Guzzi', value: 'Moto Guzzi' },
  { label: 'Husqvarna', value: 'Husqvarna' }
];


const AddVehicleModal = ({visible, onClose}: AddVehicleModalProps) => {
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
            </View>
        </TouchableOpacity>
    </Modal>
  )
}

export default AddVehicleModal