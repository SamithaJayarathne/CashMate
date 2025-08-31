import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { RootParamList } from "../../App";

type CreateAccNavigationProps = NativeStackNavigationProp<
  RootParamList,
  "Create_Account"
>;

export function Create_AccountScreen() {
  const PUBLIC_URL = "https://1d929bd5796d.ngrok-free.app";

  const navigation = useNavigation<CreateAccNavigationProps>();

  const [getFirstName, setFirstName] = React.useState("");
  const [getLastName, setLastName] = React.useState("");
  const [getUserName, setUserName] = React.useState("");
  const [getPassword, setPassword] = React.useState("");

  const handleCreateAccount = async () => {
    console.log("Create Account Pressed");

    const data = {
      first_name: getFirstName.trim(),
      last_name: getLastName.trim(),
      user_name: getUserName.trim(),
      password: getPassword,
    };

    try {
      const response = await fetch(PUBLIC_URL + "/CashMate_API/UserController", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("Request sent");

      if (response.ok) {
        const responseJson = await response.json();
        console.log(responseJson);

        const type = responseJson.status
          ? ALERT_TYPE.SUCCESS
          : ALERT_TYPE.DANGER;

        Toast.show({
          type,
          title: responseJson.status ? "Success" : "Error",
          textBody:
            responseJson.message ||
            (responseJson.status
              ? "Account created successfully!"
              : "Something went wrong."),
        });

        if (responseJson.status) {
          setTimeout(() => navigation.goBack(), 1000);
        }
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Server Error",
          textBody: `HTTP ${response.status} - please try again later.`,
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topContent}>
          <View style={styles.header}>
            <Image
              source={require("../img/dollar.png")}
              style={{ width: 100, height: 100 }}
            />
            <Text style={styles.headerTitle}>Create a new User Account</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="First name"
              onChangeText={setFirstName}
              value={getFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Last name"
              onChangeText={setLastName}
              value={getLastName}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={setUserName}
              value={getUserName}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={setPassword}
              value={getPassword}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          activeOpacity={0.8}
          onPress={handleCreateAccount}
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
    alignItems: "center",
  },
  topContent: {
    width: "100%",
    alignItems: "center",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
    marginTop: 10,
  },
  form: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: "#F59E0B",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  createButton: {
    width: "90%",
    height: 50,
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
