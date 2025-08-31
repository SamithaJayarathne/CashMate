import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ProfileScreen() {
    const [profileImage, setProfileImage] = useState(
        "https://via.placeholder.com/100" // default placeholder image
    );

    const handleSaveImage = () => {
        // Add your image saving logic here (e.g., upload to server)
        alert("Profile image saved!");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Profile Image */}
                <View style={styles.profileImageContainer}>
                    <Image source={require("../img/user2.png")} style={styles.profileImage} />
                    <Pressable style={styles.saveButton} onPress={handleSaveImage}>
                        <Text style={styles.saveButtonText}>Save Profile Image</Text>
                    </Pressable>
                </View>

                {/* Profile Information */}
                <View style={styles.card}>
                    <Text style={styles.heading}>Profile Information</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>First Name:</Text>
                        <Text style={styles.value}>Samitha</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Last Name:</Text>
                        <Text style={styles.value}>Jayarathne</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>User Name:</Text>
                        <Text style={styles.value}>samitha123</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Password:</Text>
                        <Text style={styles.value}>********</Text>
                    </View>
                </View>

                {/* Account Summary */}
                <View style={styles.card}>
                    <Text style={styles.heading}>Account Summary</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total Expenses:</Text>
                        <Text style={styles.value}>$1,200</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total Income:</Text>
                        <Text style={styles.value}>$3,500</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Balance:</Text>
                        <Text style={styles.value}>$2,300</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total Transactions:</Text>
                        <Text style={styles.value}>45</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Account Created:</Text>
                        <Text style={styles.value}>2024-08-15</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    container: {
        padding: 15,
        backgroundColor: "#F9FAFB",
    },
    profileImageContainer: {
        alignItems: "center",
        marginBottom: 20,
        borderRadius: 50,
        borderColor: "#F59E0B"
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,        
        borderColor: "#F59E0B",
        marginBottom:20
    },
    saveButton: {
        backgroundColor: "#3B82F6",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    card: {
        backgroundColor: "#f7eee9",
        padding: 20,
        borderRadius: 12,
        marginVertical: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    heading: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
        color: "#3B82F6",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: "#1E293B",
    },
    value: {
        fontSize: 16,
        fontWeight: "500",
        color: "#111827",
    },
});
