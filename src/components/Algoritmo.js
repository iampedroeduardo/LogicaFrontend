import { StyleSheet, View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Algoritmo({ questao }) {
  function geraAlgoritmo() {
    const pedacos = [];
    const espacos = [...questao.espacosCertos, questao.espacoErrado].sort(
      (a, b) => a.posicaoInicial - b.posicaoInicial
    );

    // Primeiro pedaço antes do primeiro espaço
    pedacos.push(
      <Text key="inicio" style={styles.texto}>
        {questao.script.substring(0, espacos[0].posicaoInicial)}
      </Text>
    );

    for (let i = 0; i < espacos.length; i++) {
      const espaco = espacos[i];

      // Parte clicável
      pedacos.push(
        <Pressable key={`espaco-${i}`} style={styles.texto} onPress={() => console.log("clicou no espaço")}>
          <Text style={[styles.texto, styles.highlight]}>
            {questao.script.substring(espaco.posicaoInicial, espaco.posicaoFinal)}
          </Text>
        </Pressable>
      );

      // Texto entre este e o próximo espaço
      if (i < espacos.length - 1) {
        pedacos.push(
          <Text key={`meio-${i}`} style={styles.texto}>
            {questao.script.substring(
              espaco.posicaoFinal,
              espacos[i + 1].posicaoInicial
            )}
          </Text>
        );
      }
    }

    // Último pedaço
    pedacos.push(
      <Text key="fim" style={styles.texto}>
        {questao.script.substring(espacos[espacos.length - 1].posicaoFinal)}
      </Text>
    );

    return pedacos;
  }

  return (
    <LinearGradient
      colors={["#BFECFF", "#6446DB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.borderDiv}
    >
      <View style={styles.editor}>
        <Text style={styles.textoContainer}>{geraAlgoritmo()}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  borderDiv: {
    width: "100%",
    height: "55%",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 12,
  },
  editor: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textoContainer: {
    flexWrap: "wrap",
    fontFamily: "monospace", // para parecer código
    lineHeight: 22,
  },
  texto: {
    fontSize: 16,
    color: "#000",
    fontFamily: "monospace",
  },
  highlight: {
    backgroundColor: "#D9C8FF",
    borderRadius: 4,
    paddingHorizontal: 2,
  },
});
