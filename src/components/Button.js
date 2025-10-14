import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text } from "react-native";

export default function Button({texto, onPress}){
    return (<Pressable onPress={onPress}>
        <LinearGradient colors={['#BFECFF66', '#6446DB66']} start={{x: 0, y: 0}} end={{x: 0.5, y: 1}} style={styles.button}>
        <Text style={styles.textButton}>{texto}</Text>
        </LinearGradient>
    </Pressable>)
}
const styles = StyleSheet.create({
    button: {
        width: 130,
        height: 40,
        borderRadius: 20, 
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    textButton: {
        fontSize: 18
    }
})