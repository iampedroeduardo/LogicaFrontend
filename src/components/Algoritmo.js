import { StyleSheet, View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import Draggable from "./Draggable";

export default function Algoritmo({
  questao,
  setOpcaoSelecionada,
  opcaoSelecionada,
  respondida,
}) {
  const [state, setState] = useState({
    position: { x: 0, y: 0, width: 0, height: 0 },
  });
  const [espacoLacunasState, setEspacoLacunasState] = useState({
    position: { x: 0, y: 0, width: 0, height: 0 },
  });
  const [opcoesLacuna, setOpcoesLacuna] = useState([]);
  useEffect(() => {
    // Gera as opções apenas quando a questão for do tipo Lacuna e as dimensões do container forem conhecidas
    if (questao.tipoErroLacuna === "Lacuna" && espacoLacunasState.width > 0) {
      setOpcoesLacuna(gerarOpcoesLacunas());
    }
  }, [questao, espacoLacunasState]); // Re-executa se a questão ou o layout mudarem

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

  // Função auxiliar para checar colisão entre duas opções
  function checkCollision(rect1, rect2, padding = 10) {
    return (
      rect1.x < rect2.x + rect2.width + padding &&
      rect1.x + rect1.width + padding > rect2.x &&
      rect1.y < rect2.y + rect2.height + padding &&
      rect1.y + rect1.height + padding > rect2.y
    );
  }

  function gerarOpcoesLacunas() {
    // Pega as opções do backend e embaralha
    const opcoesDoBackend = [];
    questao.lacunas.forEach((lacuna) => {
      const opcaoCorreta = questao.script.substring(
        lacuna.posicaoInicial,
        lacuna.posicaoFinal
      );
      opcoesDoBackend.push({ id: lacuna.id, text: opcaoCorreta });
    });
    const distratores = [
      ...questao.lacunas.map((lacuna) => lacuna.distratores)[0],
    ];
    while (opcoesDoBackend.length < 4 && distratores.length > 0) {
      const sorteio = Math.floor(Math.random() * distratores.length);
      opcoesDoBackend.push({ id: distratores[sorteio].id, text: distratores[sorteio].descricao });
      distratores.splice(sorteio, 1);
    }
    const opcoesEmbaralhadas = opcoesDoBackend.sort(() => Math.random() - 0.5);

    // Lógica de posicionamento
    const opcoesPosicionadas = [];
    const containerWidth = espacoLacunasState.width;
    const containerHeight = espacoLacunasState.height;
    const margin = 5;

    opcoesEmbaralhadas.forEach((opcao) => {
      // Calcula a largura da opção com base no texto, com um mínimo e um máximo.
      const paddingHorizontal = 10; // 10 de cada lado
      const charWidth = 10; // Largura média de um caractere com fonte monoespaçada
      const opcaoWidth = Math.max(
        60,
        Math.min(200, opcao.text.length * charWidth + paddingHorizontal)
      );
      const opcaoHeight = 15; // Altura estimada de uma opção
      let positionFound = false;
      let newX = margin,
        newY = espacoLacunasState.y + margin;

      while (!positionFound) {
        let hasCollision = false;
        const newRect = {
          x: newX,
          y: newY,
          width: opcaoWidth,
          height: opcaoHeight,
        };

        // Verifica colisão com as opções já posicionadas
        for (const placedOption of opcoesPosicionadas) {
          const placedRect = {
            x: placedOption.x,
            y: placedOption.y,
            width: placedOption.width, // Usa a largura calculada para a opção já posicionada
            height: placedOption.height,
          };
          if (checkCollision(newRect, placedRect)) {
            hasCollision = true;
            break;
          }
        }

        if (!hasCollision) {
          positionFound = true;
        } else {
          // Se colidiu, tenta a próxima posição
          newX += opcaoWidth + margin;
          // Se saiu da largura do container, quebra a linha
          if (newX + opcaoWidth > containerWidth) {
            newX = margin;
            newY += opcaoHeight + margin;
          }
        }
      }

      opcoesPosicionadas.push({
        ...opcao,
        x: newX,
        y: newY,
        width: opcaoWidth, // Salva a largura calculada para uso na verificação de colisão
        height: opcaoHeight,
      });
    });

    return opcoesPosicionadas;
  }
  function updateLacuna(updatedLacuna) {
    setOpcoesLacuna((prevOpcoesLacuna) =>
      prevOpcoesLacuna.map((w) =>
        w.id === updatedLacuna.id ? { ...w, ...updatedLacuna } : w
      )
    );
  }

  return (
    <LinearGradient
      colors={["#BFECFF", "#6446DB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.borderDiv}
    >
      <View
        style={styles.editor}
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          setState({ x, y, width, height });
        }}
      >
        <Text style={styles.textoContainer}>{geraAlgoritmo()}</Text>
        {/* Área de referência para as opções, mas não as contém mais */}
        {questao.tipoErroLacuna === "Lacuna" && (<View
          style={styles.opcoesLacunaContainer}
          onLayout={(event) => {
            const { x, y, width, height } = event.nativeEvent.layout;
            setEspacoLacunasState({ x, y, width, height });
          }}
        />)}

        {/* Container para os itens arrastáveis, posicionado sobre todo o editor */}
        {questao.tipoErroLacuna === "Lacuna" && (
          <View style={StyleSheet.absoluteFill}>
            {opcoesLacuna.map((opcao) => (
              <Draggable
                lacuna={opcao}
                updateLacuna={updateLacuna}
                key={opcao.id}
                width={state.width}
                height={state.height}
              />
            ))}
          </View>
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
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: "relative", // Garante que o posicionamento absoluto dos filhos seja relativo a este editor
    elevation: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
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
    borderRadius: 10,
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
    justifyContent: "center",
    gap: 10,
    paddingTop: 10,
    height: 80, // Apenas para manter um espaço no layout
    borderTopColor: "#bcaef3ff",
    borderTopWidth: 1.6,
    width: "100%",
  },
});
