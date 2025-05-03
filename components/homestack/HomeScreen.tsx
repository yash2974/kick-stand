import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function HomeScreen() {
    const getCurrentUser = async () => {
        const currentUser = GoogleSignin.getCurrentUser();
        if (!currentUser) {
            console.log("No user is currently signed in.");
            return null;
        }
        console.log("Current user:", currentUser);
    };
    console.log("HomeScreen rendered");
    try {
        getCurrentUser();
        const token = AsyncStorage.getItem("userToken");
        if (token) {
            console.log("Token found:", token);
        }
        else {
            console.log("No token found.");
        }
    }
    catch (error) {
        console.error("Error retrieving token:", error);
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Home Screen!</Text>
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

function setState(currentUser: User | null) {
    throw new Error("Function not implemented.");
}
