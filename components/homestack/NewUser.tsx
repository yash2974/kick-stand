import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { AuthContext, AuthProvider } from '../authstack/AuthContext';
import { useNavigation } from "@react-navigation/native";

export default function NewUser() {
    const navigation = useNavigation()
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const { userInfo } = React.useContext(AuthContext);
    
    const user_id = userInfo?.user.id
    
    console.log(user_id)

    const userDetails = async () => {
        
        const userData = {name, email, phone, user_id}
        try{
            const response = await fetch('http://192.168.1.6:8001/users/',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify(userData)
            });
            console.log(JSON.stringify(userData))
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' as never }] 
            });
        
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                
            }
            else{
                alert(result.message);
            }
        }
        catch (error){
            alert("Failed to send data");
        }

    };

    

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
            <Text style={styles.title}>Complete Your Profile</Text>

            <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#000"
            />

            <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#000"
            />

            <TextInput
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
            placeholderTextColor="#000"
            />

            <Button title="Submit" onPress={userDetails}></Button>
        </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    
  },
});

function alert(message: any) {
    throw new Error("Function not implemented.");
}
