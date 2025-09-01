import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { use, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PUBLIC_URL, RootParamList } from "../../App";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

type RootNavigationProps = NativeStackNavigationProp<RootParamList, 'Root'>;

type Account = {
    id: number;
    user_name: string;
    first_name: string;
    last_name: string;
    password: string;
    created_at: Date;
    img_path: string
};


export default function RootScreen() {

    const navigation = useNavigation<RootNavigationProps>();
    const isFocused = useIsFocused();

    async function hanleSelectedUserAccount(Account: Account) {

        await AsyncStorage.setItem("selected_account", JSON.stringify(Account));

        navigation.navigate('Home');
        console.log("Selected Account: " + Account.user_name);
        console.log("Selected Account Id: " + Account.id);

    }

    const [getAccounts, setAccounts] = React.useState<Account[]>([]);

    const loadAccounts = async () => {

        const response = await fetch(PUBLIC_URL + "/CashMate_API/UserController");

        if (response.ok) {
            const responseJson = await response.json();
            console.log(responseJson);
            setAccounts(responseJson.userList);
        } else {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Network Error",
                textBody: "Please check your internet connection and try again.",
            });
        }
    };

    React.useEffect(() => {
        if (isFocused) {
            loadAccounts(); 
        }
    }, [isFocused]);

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

                    <FlatList
                        data={getAccounts}
                        keyExtractor={(account) => account.id.toString()}
                        contentContainerStyle={styles.accountsContainer}
                        renderItem={({ item }: { item: Account }) => (
                            <TouchableOpacity
                                style={styles.accountCard}
                                activeOpacity={0.7}
                                onPress={() => {

                                    hanleSelectedUserAccount(item);
                                }}
                            >
                                <Text style={styles.accountName}>{item.user_name}</Text>
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
        marginBottom: 20
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
