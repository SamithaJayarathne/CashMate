import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function TransactionScreen() {
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [type, setType] = useState<"income" | "expense">("income");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const PUBLIC_URL = "https://485dc755617b.ngrok-free.app";

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch(`${PUBLIC_URL}/CashMate_API/CategoryController`);
                if (response.ok) {
                    const responseJson = await response.json();
                    if (responseJson.status && responseJson.categoryList) {
                        setCategories(responseJson.categoryList);
                        setCategory(responseJson.categoryList[0]); // default first category
                    } else {
                        console.log("Failed to load categories from API");
                    }
                } else {
                    console.log("Network response was not ok");
                }
            } catch (error) {
                console.log("Error fetching categories:", error);
            }
        };

        loadCategories();
    }, []);

    const handleSave = () => {
        console.log({ amount, note, type, category, user_id: 1 });
        // TODO: send data to API
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Add Transaction</Text>
                </View>

                {/* Amount */}
                <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />

                {/* Note */}
                <TextInput
                    style={styles.input}
                    placeholder="Note"
                    value={note}
                    onChangeText={setNote}
                />

                {/* Type */}
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    {["income", "expense"].map((t) => (
                        <TouchableOpacity
                            key={t}
                            style={[styles.radioButton, type === t && styles.radioButtonSelected]}
                            onPress={() => setType(t as "income" | "expense")}
                        >
                            <Text style={[styles.radioText, type === t && styles.radioTextSelected]}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Category */}
                <View style={styles.dropdown}>
                    {categories.map((cat) => (
                        <Pressable
                            key={cat}
                            style={[styles.dropdownItem, category === cat && styles.dropdownItemSelected]}
                            onPress={() => setCategory(cat)}
                        >
                            <Text style={[styles.dropdownText, category === cat && styles.dropdownTextSelected]}>
                                {cat}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Save Button */}
                <Pressable style={styles.createButton} onPress={handleSave}>
                    <Text style={styles.createButtonText}>Save Transaction</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

// Styles remain the same as your last code
const styles = StyleSheet.create({
    safeArea:
    {

        flex: 1,
        backgroundColor: "#F9FAFB"
    },
    container:
    {
        flexGrow: 1,
        padding: 20,
        alignItems: "center"
    },
    header:
    {
        justifyContent: "center",
        alignItems: "center"
    },
    headerTitle:
    {
        fontSize: 30,
        fontWeight: "bold",
        color: "#1E293B",
        textAlign: "center",
        marginTop: 10
    },
    input:
    {
        width: 300,
        height: 50,
        borderWidth: 1,
        borderColor: "#F59E0B",
        borderRadius: 12,
        paddingHorizontal: 15,
        marginVertical: 10,
        fontSize: 16,
        backgroundColor: "#FFFFFF"
    },
    radioButton: {
        flex: 1, marginHorizontal: 5, paddingVertical: 12,
        borderWidth: 1, borderColor: "#F59E0B", borderRadius: 10, alignItems: "center"
    },
    radioButtonSelected: { backgroundColor: "#F59E0B" },
    radioText: { color: "#F59E0B", fontWeight: "600" },
    radioTextSelected: { color: "#FFFFFF" },
    dropdown: {
        width: "100%", marginVertical: 10, borderWidth: 1, borderColor: "#F59E0B",
        borderRadius: 12, backgroundColor: "#FFFFFF"
    },
    dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
    dropdownItemSelected: { backgroundColor: "#F59E0B" },
    dropdownText: { fontSize: 16, color: "#1E293B" },
    dropdownTextSelected: { color: "#FFFFFF", fontWeight: "600" },
    createButton: {
        width: "90%", height: 50, backgroundColor: "#3B82F6",
        borderRadius: 12, alignItems: "center", justifyContent: "center",
        shadowColor: "#000", shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2, shadowRadius: 4, elevation: 5, marginTop: 20
    },
    createButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
