
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { RootParamList } from '../../App';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CreateAccNavigationProps = NativeStackNavigationProp<RootParamList, 'Create_Account'>;

export function Create_AccountScreen() {

    const navigation = useNavigation<CreateAccNavigationProps>();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                <View style={styles.topContent}>
                    <View style={styles.header}>
                        <Image
                            source={require('../img/dollar.png')}
                            style={{ width: 100, height: 100 }}
                        />
                        <Text style={styles.headerTitle}>Create a new User Account</Text>
                    </View>

                    <View style={styles.form}>
                        <TextInput style={styles.input} placeholder='First name' />
                        <TextInput style={styles.input} placeholder='Last name' />
                        <TextInput style={styles.input} placeholder='Username' />
                        <TextInput style={styles.input} placeholder='Password' secureTextEntry />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.createButton}
                    activeOpacity={0.8}
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
