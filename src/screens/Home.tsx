import React, { useState, useEffect, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PUBLIC_URL, RootParamList } from "../../App";
import { useIsFocused, useNavigation } from "@react-navigation/native";

interface Transaction {
    id: number;
    type: string; // "income" or "expense"
    amount: number;
    note: string;
    created_at: string; // ISO string
}

type HomeNavigationProps = NativeStackNavigationProp<RootParamList, 'Home'>;

export function HomeScreen() {

    const navigation = useNavigation<HomeNavigationProps>();
    const isFocused = useIsFocused();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [getUserAccount, setUserAccount] = useState<any>(null);

    useEffect(() => {
        const loadUserAccount = async () => {
            const stored = await AsyncStorage.getItem("selected_account");
            if (stored) setUserAccount(JSON.parse(stored));
        };
        loadUserAccount();
    }, []);

    const loadTransactions = async () => {
        try {
            const response = await fetch(`${PUBLIC_URL}/CashMate_API/TransactionController?userId=${getUserAccount.id}`);
            console.log("Fetching transactions for user ID: " + getUserAccount.id);

            if (response.ok) {
                const responseJson = await response.json();
                if (responseJson.status && responseJson.transactionList) {
                    setTransactions(responseJson.transactionList);
                }
            } else {
                console.warn("Failed to fetch transactions");
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        if (getUserAccount && isFocused) {
            loadTransactions();
        }
    }, [getUserAccount, isFocused]);


    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    };

    const { totalIncome, totalExpense, balance } = useMemo(() => {
        let income = 0;
        let expense = 0;
        transactions.forEach((t) => {
            if (t.type === "income") {
                income += t.amount;
            } else if (t.type === "expense") {
                expense += t.amount;
            }
        });
        return {
            totalIncome: income,
            totalExpense: expense,
            balance: income + expense
        };
    }, [transactions]);

    const renderTransaction = ({ item }: { item: Transaction }) => (
        <View style={[styles.transactionCard, item.type === "income" ? styles.income : styles.expense]}>
            <Text style={styles.transactionDesc}>{item.note}</Text>
            <Text style={styles.transactionAmount}>{formatNumber(item.amount)}</Text>
        </View>
    );

    const handleAddTransaction = () => {
        navigation.navigate('Transaction');
    };



    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                <View style={styles.topHeaderBox}>
                    <Pressable
                        onPress={() => navigation.navigate('Profile')}
                        style={({ pressed }) => [
                            styles.topHeaderText,
                            pressed && { opacity: 0.7 }
                        ]}
                    >
                        <Text style={styles.greetingText}>👋 Hello, {getUserAccount?.user_name}</Text>
                    </Pressable>
                    <Text style={styles.subText}>Welcome back to your dashboard!</Text>
                </View>



                <View style={styles.headerBox}>

                    <View style={styles.headerRow}>
                        <Text style={styles.headerLabel}>Income:</Text>
                        <Text style={styles.headerValue}>{formatNumber(totalIncome)}</Text>
                    </View>

                    <View style={styles.headerRow}>
                        <Text style={styles.headerLabel}>Expense:</Text>
                        <Text style={styles.headerValue}>{formatNumber(totalExpense)}</Text>
                    </View>

                    <View style={styles.headerRow}>
                        <Text style={styles.headerLabel}>Balance:</Text>
                        <Text style={styles.headerValue}>{formatNumber(balance)}</Text>
                    </View>
                </View>


                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderTransaction}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />

                <TouchableOpacity style={styles.fab} onPress={handleAddTransaction}>
                    <Ionicons name="add" size={30} color="#fff" />
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
    },
    topHeaderBox: {
        backgroundColor: '#3B82F6',
        padding: 20,
        borderRadius: 12,
        marginVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center'
    },
    topHeaderText: {
        marginBottom: 5,
        cursor: 'pointer'
    },
    greetingText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    subText: {
        fontSize: 14,
        color: '#E0F2FE',
    },
    headerBox: {
        padding: 16,
        backgroundColor: "#f7eee9",
        borderRadius: 12,
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4,
    },
    headerLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1e293b",
    },
    headerValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#0f172a",
    },
    transactionCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginVertical: 5
    },
    income: {
        backgroundColor: "#D1FAE5",
    },
    expense: {
        backgroundColor: "#FEE2E2",
    },
    transactionDesc: {
        fontSize: 16,
        fontWeight: "500",
        color: "#1E293B",
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: "600",
    },
    fab: {
        position: "absolute",
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#3B82F6",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});
