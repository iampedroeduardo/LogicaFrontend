import { StyleSheet, Text, View } from "react-native";
import { Button, Icon } from "react-native-paper";

export default function ValidacaoEmailErro ({ navigation }) {
  return (
    <View style={styles.container}>
      <Icon source="close-circle-outline" size={100} color="#EF5350" />
      <Text style={styles.title}>Não foi possível validar o seu email!</Text>
      <Text style={styles.subtitle}>
        O link de validação pode ter expirado ou ser inválido. Por favor, tente
        se cadastrar novamente.
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