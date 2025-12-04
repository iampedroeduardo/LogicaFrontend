import { StyleSheet, Text, View } from "react-native";
import { Button, Icon } from "react-native-paper";

export default function ValidacaoEmailSucesso ({ navigation }) {
  return (
    <View style={styles.container}>
      <Icon source="check-circle-outline" size={100} color="#4CAF50" />
      <Text style={styles.title}>Email Validado com Sucesso!</Text>
      <Text style={styles.subtitle}>
        Sua conta foi ativada. Agora você já pode fazer o login no aplicativo.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#EEEEEE",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 30,
  },
});