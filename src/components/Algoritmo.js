import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Draggable from "./Draggable";

export default function Algoritmo({
  questao,
  setOpcaoSelecionada,
  opcaoSelecionada,
  respondida,
  setEspacos,
  espacos,
}) {
  const [state, setState] = useState({
    position: { x: 0, y: 0, width: 0, height: 0 },
  });
  const [espacoLacunasState, setEspacoLacunasState] = useState({
    position: { x: 0, y: 0, width: 0, height: 0 },
  });
  
  const [opcoesLacuna, setOpcoesLacuna] = useState([]);

  // Ref para o container principal do editor
  const editorRef = useRef(null);
  // Ref para coletar as medições de layout antes de atualizar o estado
  const layoutDataRef = useRef(new Map());

  useEffect(() => {
    // Gera as opções apenas quando a questão for do tipo Lacuna e as dimensões do container forem conhecidas
    if (questao.tipoErroLacuna === "Lacuna" && espacoLacunasState.width > 0) {
      setOpcoesLacuna(gerarOpcoesLacunas());
    }
  }, [questao, espacoLacunasState]); // Re-executa se a questão ou o layout mudarem

  const algoritmoParts = useMemo(() => {
    const linhas = [];

    let pedacos = [];
    if (espacos.length === 0) {
      return <Text style={styles.texto}>{questao.script}</Text>;
    }

    if (
      questao.script.substring(0, espacos[0].posicaoInicial).indexOf("\n") !==
      -1
    ) {
      const lines = questao.script
        .substring(0, espacos[0].posicaoInicial)
        .split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        pedacos.push(
          <Text key={`inicio-${i}`} style={styles.texto}>
            {line}
          </Text>
        );
        if (i < lines.length - 1) {
          linhas.push(pedacos);
          pedacos = [];
        }
      }
    } else {
      pedacos.push(
        <Text key="inicio" style={styles.texto}>
          {questao.script.substring(0, espacos[0].posicaoInicial)}
        </Text>
      );
    }

    for (let i = 0; i < espacos.length; i++) {
      const espaco = espacos[i];

      // Parte clicável
      pedacos.push(
        questao.tipoErroLacuna === "Erro" ? (
          <Pressable
            key={`espaco-${i}`}
            onPress={() => {
              if (!respondida) setOpcaoSelecionada(espaco);
            }}
          >
            <Text
              style={[
                styles.texto,
                respondida && espaco.id === questao.espacoErrado.id // Se respondida e este é o erro correto
                  ? styles.highlightRight
                  : opcaoSelecionada != null && // Se há uma opção selecionada...
                    !respondida && // ...e ainda não foi respondida...
                    opcaoSelecionada.id === espaco.id // ...e é a opção atual
                  ? styles.highlightSelect // -> Estilo de seleção
                  : opcaoSelecionada != null && // Se há uma opção selecionada...
                    respondida && // ...e já foi respondida...
                    opcaoSelecionada.id === espaco.id && // ...e é a opção atual...
                    opcaoSelecionada.id !== questao.espacoErrado.id // ...mas não é o erro correto
                  ? styles.highlightWrong // -> Estilo de erro (selecionado, mas errado)
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
          <Pressable
            key={`espaco-${espaco.id}`}
            style={
              !espaco.chute
                ? styles.lacunaVazia
                : !respondida
                ? styles.highlightSelect
                : espaco.chute.id === espaco.id
                ? styles.highlightRight
                : styles.highlightWrong
            }
            onPress={() => {
              if (espaco.chute && !respondida) {
                updateLacuna({ ...espaco.chute, visible: true });
                updateEspaco({ ...espaco, chute: null });
              }
            }}
            onLayout={(event) => {
              // Mede a posição da lacuna em relação ao container 'editor'
              event.target.measureLayout(
                editorRef.current,
                (x, y, width, height) => {
                  // Armazena os dados de layout na ref
                  layoutDataRef.current.set(espaco.id, { x, y, width, height });

                  // Verifica se já coletamos o layout de todas as lacunas
                  if (layoutDataRef.current.size === espacos.length) {
                    setEspacos((prevEspacos) =>
                      prevEspacos.map((e) => ({
                        ...e,
                        ...(layoutDataRef.current.get(e.id) || {}),
                      }))
                    );
                  }
                },
                () => {} // Função de erro (onFail)
              );
            }}
          >
            {espaco.chute && <Text style={styles.lacunaTexto}>{espaco.chute.text}</Text>}
          </Pressable>
        )
      );

      if (i < espacos.length - 1) {
        if (
          questao.script
            .substring(espaco.posicaoFinal, espacos[i + 1].posicaoInicial)
            .indexOf("\n") !== -1
        ) {
          const lines = questao.script
            .substring(espaco.posicaoFinal, espacos[i + 1].posicaoInicial)
            .split("\n");
          for (let j = 0; j < lines.length; j++) {
            const line = lines[j];
            pedacos.push(
              <Text key={`meio-${i}-${j}`} style={styles.texto}>
                {line}
              </Text>
            );
            if (j < lines.length - 1) {
              linhas.push(pedacos);
              pedacos = [];
            }
          }
        } else {
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
    }

    // Último pedaço
    if (
      questao.script
        .substring(espacos[espacos.length - 1].posicaoFinal)
        .indexOf("\n") !== -1
    ) {
      const lines = questao.script
        .substring(espacos[espacos.length - 1].posicaoFinal)
        .split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        pedacos.push(
          <Text key={`fim-${i}`} style={styles.texto}>
            {line + (i < lines.length - 1 ? '\n' : '')}
          </Text>
        );
        linhas.push(pedacos);
        pedacos = [];
      }
    } else {
      pedacos.push(
        <Text key="fim" style={styles.texto}>
          {questao.script.substring(espacos[espacos.length - 1].posicaoFinal)}
        </Text>
      );
      linhas.push(pedacos);
      pedacos = [];
    }
    return linhas.flat().map((linha, index) => (
      <View key={`linha-${index}`} style={styles.linha}>
        {linha}
      </View>
    ));
  }, [questao, opcaoSelecionada, respondida, espacos]); // Adicionado `espacos` às dependências

  useEffect(() => {
    let newEspacos = [];
    if (questao.tipoErroLacuna === "Lacuna") {
      newEspacos = [...questao.lacunas].sort(
        (a, b) => a.posicaoInicial - b.posicaoInicial
      );
      newEspacos.forEach((lacuna) => {
        lacuna.chute = null;
      });
    } else if (questao.tipoErroLacuna === "Erro") {
      // Popula espacos também para questões do tipo "Erro"
      newEspacos = [...questao.espacosCertos, questao.espacoErrado].sort(
        (a, b) => a.posicaoInicial - b.posicaoInicial
      );
    }
    // Limpa os dados de layout antigos ao carregar uma nova questão
    layoutDataRef.current.clear();
    setEspacos(newEspacos);
  }, [questao]); // A dependência `questao` está correta

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
      opcoesDoBackend.push({
        id: distratores[sorteio].id,
        text: distratores[sorteio].descricao,
      });
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
        visible: true,
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
  function updateEspaco(updatedEspaco) {
    setEspacos((prevEspacos) =>
      prevEspacos.map((w) =>
        w.id === updatedEspaco.id ? { ...w, ...updatedEspaco } : w
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
        ref={editorRef} // Atribui a ref ao container do editor
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          setState({ x, y, width, height });
        }}
      >
        <View style={styles.textoContainer}>{algoritmoParts}</View>
        {/* Área de referência para as opções, mas não as contém mais */}
        {questao.tipoErroLacuna === "Lacuna" && (
          <View
            style={styles.opcoesLacunaContainer}
            onLayout={(event) => {
              const { x, y, width, height } = event.nativeEvent.layout;
              setEspacoLacunasState({ x, y, width, height });
            }}
          />
        )}

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
                espacos={espacos}
                updateEspaco={updateEspaco}
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
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  linha: {
    display: "flex",
    flexDirection: "row",
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
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  highlightWrong: {
    borderWidth: 2,
    borderColor: "#f06161ff",
    color: "white",
    backgroundColor: "#f06161ff",
    borderRadius: 10,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  highlightRight: {
    borderWidth: 2,
    borderColor: "#8def72ff",
    color: "white",
    backgroundColor: "#8def72ff",
    borderRadius: 10,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
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
    width: 50,
    height: 30,
  },
  lacunaTexto: {
    color: "white",
    fontSize: 18,
    fontFamily: "monospace",
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
