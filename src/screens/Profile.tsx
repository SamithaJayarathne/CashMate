import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { PUBLIC_URL } from "../../App";
import { useIsFocused } from "@react-navigation/native";

export function ProfileScreen() {

    const [getUserAccount, setUserAccount] = useState<any>(null);
    const [getIncome, setIncome] = useState<number>(0);
    const [getExpense, setExpense] = useState<number>(0);
    const [getBalance, setBalance] = useState<number>(0);
    const [getCount, setCount] = useState<number>(0);
    const [getProfileImg, setProfileImg] = useState<string>("");

    const isFocused = useIsFocused();

    const imageUrl = getUserAccount?.img_path
        ? `${PUBLIC_URL}/profile_image/${getUserAccount.img_path}`
        : null;


    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    };

    const setImage = async () => {
        let img = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!img.canceled) {
            setProfileImg(img.assets[0].uri);
        }
    };

    const saveImage = async () => {
        if (!getProfileImg) return;

        let formData = new FormData();
        formData.append("userId", String(getUserAccount?.id));
        formData.append(
            "profileImg",
            {
                uri: getProfileImg,
                type: "image/jpeg",
                name: "profileImage.jpg",
            } as any
        );

        try {
            const response = await fetch(PUBLIC_URL + "/CashMate_API/ProfileController", {
                method: "POST",
                body: formData,
                headers: {}, // let RN set correct headers with boundary
            });



            if (response.ok) {
                const responseJson = await response.json();

                if (responseJson.status) {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: "Success",
                        textBody: "Image saved successfully",
                    });

                    setUserAccount(responseJson.user);
                    AsyncStorage.setItem("selected_account", JSON.stringify(responseJson.user));

                } else {
                    Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: "Upload Error",
                        textBody: responseJson.message,
                    });
                }


            } else {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Upload Error",
                    textBody: "Something went wrong",
                });
            }
        } catch (error) {
            console.error(error);
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Network Error",
                textBody: "Please check your internet connection and try again.",
            });
        }
    };

    const loadProfileDetails = async () => {
        const stored = await AsyncStorage.getItem("selected_account");

        if (stored) {
            const account = JSON.parse(stored);
            setUserAccount(account);
            loadTransactionDetails(account.id);
        }
    };

    const loadTransactionDetails = async (id: number) => {
        const response = await fetch(
            PUBLIC_URL + "/CashMate_API/ProfileController?userId=" + id
        );

        if (response.ok) {
            const responseJson = await response.json();

            if (responseJson.status) {
                const data = responseJson.account_summary;

                setIncome(data.total_income);
                setExpense(data.total_expense);
                setBalance(data.balance);
                setCount(data.transaction_count);
            } else {
                console.warn(responseJson.message);
            }
        } else {
            console.error("Failed to fetch data");
        }
    };


    useEffect(() => {

        if (isFocused) {
            loadProfileDetails();
        }
        
    }, [isFocused]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Profile Image */}
                <View style={styles.profileImageContainer}>
                    <Pressable onPress={setImage} style={styles.imageUploader}>
                        {imageUrl ? (
                            <Image source={{ uri: imageUrl }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.imageContainer}>
                                <Text style={styles.imageText}>+</Text>
                                <Text style={styles.imageLabel}>Add Image</Text>
                            </View>
                        )}
                    </Pressable>
                    <Pressable style={styles.saveButton} onPress={saveImage}>
                        <Text style={styles.saveButtonText}>Save profile image</Text>
                    </Pressable>
                </View>

                {/* Profile Info */}
                <View style={styles.card}>
                    <Text style={styles.heading}>Profile Information</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>First Name:</Text>
                        <Text style={styles.value}>{getUserAccount?.first_name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Last Name:</Text>
                        <Text style={styles.value}>{getUserAccount?.last_name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>User Name:</Text>
                        <Text style={styles.value}>{getUserAccount?.user_name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Password:</Text>
                        <Text style={styles.value}>{getUserAccount?.password}</Text>
                    </View>
                </View>

                {/* Account Summary */}
                <View style={styles.card}>
                    <Text style={styles.heading}>Account Summary</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total Expenses:</Text>
                        <Text style={styles.expenseValue}>{formatNumber(getExpense)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total Income:</Text>
                        <Text style={styles.incomeValue}>{formatNumber(getIncome)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Balance:</Text>
                        <Text style={styles.value}>{formatNumber(getBalance)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total Transactions:</Text>
                        <Text style={styles.value}>{getCount}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Account Created:</Text>
                        <Text style={styles.value}>{getUserAccount?.created_at}</Text>
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
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#F59E0B",
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: "#3B82F6",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 10,
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    card: {
        backgroundColor: "#fcefde",
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
    expenseValue: {
        fontSize: 18,
        fontWeight: "600",
        color: "#eb4034",
    },
    incomeValue: {
        fontSize: 18,
        fontWeight: "600",
        color: "#0eab0e",
    },
    imageUploader: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#3f3e3e",
    },
    imageContainer: {
        alignItems: "center",
    },
    imageText: {
        fontSize: 36,
        color: "#999999",
        marginBottom: 5,
    },
    imageLabel: {
        fontSize: 14,
        color: "#555",
    },
});
