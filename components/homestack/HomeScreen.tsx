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
    const [dbUser, setDbUser] = useState(null);
    console.log(userInfo?.user.id)
    
    const getUserData = async () => {
        try {
            if (!userInfo) return; // Guard clause to prevent fetch if no userInfo
            console.log("Fetching user data for ID:", userInfo.user.id);
            const response = await fetch(`http://192.168.1.4:8001/users/${userInfo.user.id}`);
            const data = await response.json();
            setDbUser(data);
            console.log("User data:", data);
        } catch {
            console.log("No user data found:");
             navigation.reset({
                index: 0,
                routes: [{ name: 'NewUser' as never }] // Navigate to the NewUser screen
            });
        }
    }


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
    useEffect(() => {
        getUserData();
    }, [userInfo]);
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


