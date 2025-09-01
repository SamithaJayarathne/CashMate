import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    TouchableOpacity,
    ScrollView,
    Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { PUBLIC_URL } from "../../App";

export function TransactionScreen() {
    const [getAmount, setAmount] = useState("");
    const [getNote, setNote] = useState("");
    const [getType, setType] = useState<string>('');
    const [getCategory, setCategory] = useState<number>(); // category id
    const [getCategories, setCategories] = useState<{ id: number; name: string }[]>([]);

    const [getUserAccount, setUserAccount] = useState<any>(null);

    useEffect(() => {
        const loadUserAccount = async () => {
            const stored = await AsyncStorage.getItem("selected_account");
            if (stored) {
                setUserAccount(JSON.parse(stored))
            };
        };
        loadUserAccount();
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch(`${PUBLIC_URL}/CashMate_API/CategoryController`);
                if (response.ok) {
                    const responseJson = await response.json();
                    if (responseJson.status && responseJson.categoryList) {
                        setCategories(responseJson.categoryList);
                        setCategory(responseJson.categoryList[0]?.id);
                    } else {
                        Toast.show({
                            type: ALERT_TYPE.WARNING,
                            title: "Categories",
                            textBody: responseJson.message
                        });
                    }
                } else {
                    Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: "Error",
                        textBody: "Network response was not ok"
                    });
                }
            } catch (error) {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Error",
                    textBody: "Error fetching categories"
                });
                console.log("Error fetching categories:", error);
            }
        };

        loadCategories();
    }, []);

    const handleSave = async () => {
        
        let typeValue = getType === "Income" ? 1 : 2;

        const data = {
            amount: getAmount,
            note: getNote,
            categoryId: getCategory,
            userId: getUserAccount?.id,
            type: typeValue
        };

        try {
            const response = await fetch(
                `${PUBLIC_URL}/CashMate_API/TransactionController`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            if (response.ok) {
                const responseJson = await response.json();
                if (responseJson.status) {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: "Success",
                        textBody: responseJson.message
                    });
                    setAmount("");
                    setNote("");
                } else {
                    Toast.show({
                        type: ALERT_TYPE.WARNING,
                        title: "Warning",
                        textBody: responseJson.message
                    });
                }
            } else {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Error",
                    textBody: "Request failed"
                });
            }
        } catch (error) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Error",
                textBody: "Something went wrong"
            });
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>

            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Image
                            source={require("../img/dollar.png")}
                            style={{ width: 100, height: 100 }}
                        />
                        <Text style={styles.headerTitle}>Add Transaction</Text>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Amount"
                        keyboardType="numeric"
                        value={getAmount}
                        onChangeText={setAmount}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Note"
                        value={getNote}
                        onChangeText={setNote}
                    />


                    <View style={{ flexDirection: "row", marginVertical: 10 }}>
                        {["Income", "Expense"].map((t) => (
                            <TouchableOpacity
                                key={t}
                                style={[
                                    styles.radioButton,
                                    getType === t && styles.radioButtonSelected
                                ]}
                                onPress={() => setType(t)}
                            >
                                <Text
                                    style={[
                                        styles.radioText,
                                        getType === t && styles.radioTextSelected
                                    ]}
                                >
                                    {t}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>


                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={getCategory}
                            onValueChange={(value) => setCategory(value)}
                            style={styles.picker}
                        >
                            {getCategories.map((cat) => (
                                <Picker.Item
                                    key={cat.id}
                                    label={cat.name}
                                    value={cat.id}
                                />
                            ))}
                        </Picker>
                    </View>
                </ScrollView>


                <View style={styles.footer}>
                    <Pressable style={styles.createButton} onPress={handleSave}>
                        <Text style={styles.createButtonText}>Save Transaction</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F9FAFB"
    },
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    scrollContent: {
        padding: 20
    },
    header: {
        justifyContent: "center",
        alignItems: "center"
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#1E293B",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 20
    },
    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#F59E0B",
        borderRadius: 12,
        paddingHorizontal: 10,
        marginVertical: 10,
        fontSize: 16,
        backgroundColor: "#FFFFFF"
    },
    radioButton: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#F59E0B",
        borderRadius: 10,
        alignItems: "center"
    },
    radioButtonSelected: {
        backgroundColor: "#F59E0B"
    },
    radioText: {
        color: "#F59E0B",
        fontWeight: "600"
    },
    radioTextSelected: {
        color: "#FFFFFF"
    },
    pickerWrapper: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#F59E0B",
        borderRadius: 12,
        marginVertical: 10,
        backgroundColor: "#FFFFFF"
    },
    picker: {
        width: "100%",
        height: 50
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        backgroundColor: "#F9FAFB"
    },
    createButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#3B82F6",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5
    },
    createButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600"
    }
});
