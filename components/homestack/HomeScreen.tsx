import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { IOS_CLIENT_ID, WEB_CLIENT_ID } from "../../Auth/key"; // Adjust the path to your key file
import { useNavigation } from "@react-navigation/native";
import { AuthProvider, AuthContext } from "../authstack/AuthContext";

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID, // Required for getting the ID token
  iosClientId: IOS_CLIENT_ID, // For iOS apps (optional but recommended)
  offlineAccess: true, // Enables server-side API calls
});


export default function HomeScreen() {
    const navigation = useNavigation(); // Use the navigation prop to navigate
    const { userInfo, setUserInfo } = React.useContext(AuthContext); // Use the context to get user info
    const [dbUser, setDbUser] = useState<User | null>(null); // State to hold the user object
    console.log(userInfo)
    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
            console.log("User signed out successfully.");
            setUserInfo(null); // Clear user info in context
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' as never }] // Navigate to the Login screen
            });
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Home Screen!</Text>
            <Button title={"Log Out"} onPress={signOut}></Button>
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
});


