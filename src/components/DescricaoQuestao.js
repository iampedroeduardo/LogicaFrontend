import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

export default function DescricaoQuestao({ questao, modo }) {
  const styles = StyleSheet.create({
    borderDiv: {
      width: "100%",
      height: questao.tipo === "multiplaEscolha" ? "40%" : "30%",
      display: "flex",
      justifyContent: "space-between",
      borderRadius: 15,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      padding: 12,
    },
    div: {
      width: "100%",
      height: "85%",
      borderRadius: 15,
      backgroundColor: "white",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 15,
      gap: 10,
    },
    pergunta: {
      width: "100%",
      height: "12%",
      display: "flex",
      justifyContent: "center",
      paddingHorizontal: 10,
    },
    perguntaText: {
      fontSize: 20,
      fontWeight: "bold",
    },
    descricaoText: {
      fontSize: 18,
      textAlign: "justify"
    },
  });
  return (
    <LinearGradient
      colors={["#BFECFF", "#6446DB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.borderDiv}
    >
      <View style={styles.div}>
        <Text style={styles.perguntaText}>{questao.nome}</Text>
        <Text style={styles.descricaoText}>
          {modo === "descricao" ? questao.descricao : questao.gabarito}
        </Text>
      </View>
      <View style={styles.pergunta}>
        <Text style={styles.perguntaText}>{questao.pergunta}</Text>
      </View>
    </LinearGradient>
  );
}
