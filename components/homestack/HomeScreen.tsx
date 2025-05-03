import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
    console.log("HomeScreen rendered");
    try {
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