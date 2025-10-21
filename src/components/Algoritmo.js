import { StyleSheet, View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Draggable from "react-draggable";
import { useEffect, useState } from "react";

export default function Algoritmo({
  questao,
  setOpcaoSelecionada,
  opcaoSelecionada,
  respondida,
}) {
  const [opcoesLacuna, setOpcoesLacuna] = useState([]);
  useEffect(() => {
    if (questao.tipoErroLacuna === "Lacuna") {
      setOpcoesLacuna(gerarOpcoesLacunas());
    }
  }, [questao]); //muda cada vez que a questão mudar e não toda vez que renderizar

  function geraAlgoritmo() {
    const pedacos = [];
    let espacos = [];
    if (questao.tipoErroLacuna === "Erro") {
      espacos = [...questao.espacosCertos, questao.espacoErrado].sort(
        (a, b) => a.posicaoInicial - b.posicaoInicial
      );
    } else if (questao.tipoErroLacuna === "Lacuna") {
      espacos = [...questao.lacunas].sort(
        (a, b) => a.posicaoInicial - b.posicaoInicial
      );
    }

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
        questao.tipoErroLacuna === "Erro" ? (
          <Pressable
            key={`espaco-${i}`}
            style={styles.texto}
            onPress={() => setOpcaoSelecionada(espaco)}
          >
            <Text
              style={[
                styles.texto,
                opcaoSelecionada != null &&
                !respondida &&
                opcaoSelecionada.id === espaco.id
                  ? styles.highlightSelect
                  : opcaoSelecionada != null &&
                    respondida &&
                    opcaoSelecionada.id === espaco.id &&
                    opcaoSelecionada.id === questao.espacoErrado.id
                  ? styles.highlightRight
                  : opcaoSelecionada != null &&
                    respondida &&
                    opcaoSelecionada.id === espaco.id &&
                    opcaoSelecionada.id !== questao.espacoErrado.id
                  ? styles.highlightWrong
                  : styles.highlight,
              ]}
            >
              {espaco.id === questao.espacoErrado.id
                ? questao.espacoErrado.distrator.descricao
                : questao.script.substring(
                    espaco.posicaoInicial,
                    espaco.posicaoFinal
                  )}
            </Text>
          </Pressable>
        ) : (
          <Pressable key={`espaco-${i}`} style={styles.lacunaVazia}>
            <Text style={{ color: "transparent" }}>
              {questao.script.substring(
                espaco.posicaoInicial,
                espaco.posicaoFinal
              )}
            </Text>
          </Pressable>
        )
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

function gerarOpcoesLacunas() {
  const todasOpcoes = [];
  questao.lacunas.forEach((lacuna) => {
    const opcaoCorreta = questao.script.substring(
      lacuna.posicaoInicial,
      lacuna.posicaoFinal
    );
    todasOpcoes.push({id: lacuna.id, text: opcaoCorreta});

    lacuna.distratores.forEach((distrator) => {
      todasOpcoes.push({id: distrator.id, text: distrator.descricao});
    })
  })
  return todasOpcoes.sort(() => Math.random() - 0.5);
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
        {questao.tipoErroLacuna === "Lacuna" && (
          <Draggable>
            <View style={styles.opcoesLacunaContainer}>
            {opcoesLacuna.map((opcao) => (
              <Text key={opcao.id} style={styles.opcaoLacuna}>{opcao.text}</Text>
            ))}
          </View>
          </Draggable>
          
        )}
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  textoContainer: {
    fontSize: 18,
    color: "#000",
    fontFamily: "monospace", // para parecer código
    lineHeight: 22,
    flex: 1,
  },
  texto: {
    fontSize: 18,
    color: "#000",
    fontFamily: "monospace",
  },
  highlight: {
    borderWidth: 2,
    borderColor: "#6446DB",
    color: "#6446DB",
    borderRadius: 10,
    paddingHorizontal: 2,
  },
  highlightSelect: {
    borderWidth: 2,
    borderColor: "#6446DB",
    color: "white",
    backgroundColor: "#6446DB",
    borderRadius: 10,
  },
  highlightWrong: {
    borderWidth: 2,
    borderColor: "#f06161ff",
    color: "white",
    backgroundColor: "#f06161ff",
    borderRadius: 10,
  },
  highlightRight: {
    borderWidth: 2,
    borderColor: "#8def72ff",
    color: "white",
    backgroundColor: "#8def72ff",
    borderRadius: 10,
  },
  lacunaVazia: {
    borderWidth: 2,
    borderColor: "#6446DB",
    borderStyle: "dashed",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderRadius: 10
  }, 
  opcaoLacuna: {
    fontSize: 17,
    color: "white",
    borderRadius: 10,
    padding: 5,
    backgroundColor: "#6446DB",
  },
  opcoesLacunaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1.6,
    borderColor: "#b0a8d0ff",
  }
});
