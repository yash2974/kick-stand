// import { User } from "@react-native-google-signin/google-signin";
// import React from "react";

// const [db_user, setDbUser] = React.useState<User | null>(null); // State to hold the user object
    
//     const userDetails = async () => {
//         try {
//             const response = await fetch("http://192.168.1.5:8001/users/{id}");
//             const data = await response.json();
//             setDbUser(data); // Set the user data in state
//         }
//         catch (error) {
//             console.error("Error fetching user details:", error);
//         }
//     };

import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function NewUser() {
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome, New User!</Text>
            <Text style={styles.subtitle}>Please complete your profile.</Text>
            
        </View>
    );
}   

const styles = StyleSheet.create({  
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
    },
});