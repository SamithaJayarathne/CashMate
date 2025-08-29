import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { use } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootParamList } from "../../App";

type RootNavigationProps = NativeStackNavigationProp<RootParamList, 'Root'>;

export default function RootScreen() {

    const navigation = useNavigation<RootNavigationProps>();

    const [getAccounts, setAccounts] = React.useState([
        { id: 1, name: "Samitha" },
        { id: 2, name: "Kasun" },
        { id: 3, name: "Nimal" },
        { id: 4, name: "Kamal" },

    ]);

    return (
        <SafeAreaView style={styles.safeArea}>

            <View style={styles.container}>

                <View style={styles.branding}>

                    <Image
                        source={require('../img/dollar.png')}
                        style={{ width: 100, height: 100 }}

                    />
                    <Text style={styles.brandingTitle}>CashMate</Text>
                    <Text style={styles.brandingText}>Your friendly money tracker</Text>

                </View>


                <View style={styles.accountSelection}>
                    <Text style={styles.accountSelectionTitle}>Select an Account</Text>

                    <FlatList
                        data={getAccounts}
                        keyExtractor={(account) => account.id.toString()}
                        contentContainerStyle={styles.accountsContainer}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.accountCard} activeOpacity={0.7}>
                                <Text style={styles.accountName}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />

                </View>


                <TouchableOpacity
                    style={styles.createButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Create_Account')}
                >
                    <Text style={styles.createButtonText}>+ Create New Account</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "space-between",
    },
    branding: {
        alignItems: "center",
    },
    brandingTitle: {
        fontSize: 34,
        fontWeight: "bold",
        color: "#1E293B",
    },
    brandingText: {
        fontSize: 16,
        color: "#4B5563",
        marginTop: 6,
    },
    accountSelection: {
        flex: 1,
        marginTop: 30,
        alignItems: "center",
        marginBottom: 30,
        borderRadius: 12,
    },
    accountSelectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#1E293B",
        marginBottom: 20,
    },
    accountsContainer: {
        width: "100%",
        alignItems: "center",
        backgroundColor: "#f7eee9",
        padding: 20,
        borderRadius: 12,

    },
    accountCard: {
        width: 300,
        height: 50,
        paddingVertical: 12,
        marginVertical: 8,
        backgroundColor: "#F59E0B",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // for Android shadow
        alignItems: "center",
    },
    accountName: {
        fontSize: 18,
        fontWeight: "500",
        color: "#FFFFFF",
    },
    createButton: {
        paddingVertical: 12,
        height: 50,
        backgroundColor: "#3B82F6",
        borderRadius: 12,
        alignItems: "center",
        width: 300,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    createButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
    },
});
