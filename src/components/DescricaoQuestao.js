import Constants from 'expo-constants';
import { LinearGradient } from "expo-linear-gradient";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function DescricaoQuestao({ questao, modo }) {
  const styles = StyleSheet.create({
    borderDiv: {
      width: "100%",
      height: questao.tipo === "multiplaEscolha" ? "40%" : "25%",
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
    divContent: {
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 15,
      gap: 10,
    },
    div: {
      width: "100%",
      height: "89%",
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
    },
    pergunta: {
      width: "100%",
      height: "17%",
      display: "flex",
      paddingTop: 5,
      paddingHorizontal: 10,
    },
    perguntaText: {
      fontSize: 20,
      fontWeight: "bold",
    },
    descricaoText: {
      fontSize: 18,
      textAlign: "justify",
      width: "100%",
    },
  });
  return (
    <LinearGradient
      colors={["#BFECFF", "#6446DB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.borderDiv}
    >
      <ScrollView
        style={styles.div}
        contentContainerStyle={styles.divContent}
      >
        <Text style={styles.perguntaText}>{questao.nome}</Text>
        
        {questao.tipo === "multiplaEscolha" ? (modo === "questao" ? (questao.descricao.length === 0 ? (<Image source={{uri: `${Constants.expoConfig?.extra?.apiUrl}/${questao.foto.replaceAll("\\","/")}`}} style={{width: "100%", aspectRatio: 1, borderRadius: 15}}/>) : (<Text style={styles.descricaoText}>
          {questao.descricao}
        </Text>)) : (<Text style={styles.descricaoText}>
          {questao.gabarito}
        </Text>)) : (<Text style={styles.descricaoText}>
          {questao.descricao}
        </Text>)}
        
      </ScrollView>
      <View style={styles.pergunta}>
        <Text style={styles.perguntaText}>{questao.tipo === "multiplaEscolha" ? questao.pergunta : questao.tipoErroLacuna === "Erro" ? "Encontre o erro" : "Complete as lacunas"}</Text>
      </View>
    </LinearGradient>
  );
}
