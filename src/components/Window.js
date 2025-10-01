import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Icon } from "react-native-paper";
//editorrr web teste
import { javascript } from "@codemirror/lang-javascript";
import { Decoration, EditorView, WidgetType } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";

export default function Window({
  window,
  updateWindow,
  deleteWindow,
  ranks,
  usuario,
}) {
  // Referências e Estados existentes...
  const pan = useRef(
    new Animated.ValueXY({ x: window.x || 20, y: window.y || 20 })
  ).current;
  const { width, height } = useWindowDimensions();
  const [closed, setClosed] = useState(false);
  const [abertoDesc, setAbertoDesc] = useState(false);
  const [abertoLacuna, setAbertoLacuna] = useState(false);
  const [abertoErro, setAbertoErro] = useState(false);
  const [abertoA, setAbertoA] = useState(false);
  const [abertoB, setAbertoB] = useState(false);
  const [abertoC, setAbertoC] = useState(false);
  const [abertoD, setAbertoD] = useState(false);
  const [abertoConfig, setAbertoConfig] = useState(false);
  const [switchQuestionTemplate, setSwitchQuestionTemplate] = useState(
    window.type === "codigo" ? "error" : "question"
  );
  const [openRank, setOpenRank] = useState(false);
  const [rank, setRank] = useState(false);
  const [rankItens, setRankItens] = useState(
    ranks.map((rank) => ({
      label: rank.nome,
      value: rank.id,
    }))
  );
  const [openNivel, setOpenNivel] = useState(false);
  const [nivel, setNivel] = useState(false);
  const [nivelItens, setNiveis] = useState([
    { label: "+", value: 0 },
    { label: "++", value: 1 },
    { label: "+++", value: 2 },
  ]);
  const [openTipo, setOpenTipo] = useState(false);
  const [tipo, setTipo] = useState(false);
  const [tipos, setTipos] = useState([
    { label: "Raciocínio Lógico", value: "RaciocinioLogico" },
    { label: "Programação", value: "Programacao" },
  ]);
  const [openCategoria, setOpenCategoria] = useState(false);
  const [categoria, setCategoria] = useState(false);
  const [categorias, setCategorias] = useState([
    { label: "Laços de Repetição", value: "LacosDeRepeticao" },
  ]);
  const [startSelection, setStartSelection] = useState(0);
  const [endSelection, setEndSelection] = useState(0);
  const [openedError, setOpenedError] = useState(0);
  const [openedGap, setOpenedGap] = useState(0); // Estado para a lacuna aberta
  const [isDragging, setIsDragging] = useState(false);

  const [inputText, setInputText] = useState(""); //inputText

  // Função para lidar com o clique no widget do editor
  const handleHighlightClick = (item) => {
    if (item.type === "error") {
      setOpenedError(item.id);
      setAbertoErro(true);
      setAbertoLacuna(false);
      setAbertoDesc(false);
    } else if (item.type === "gap") {
      setOpenedGap(item.id);
      setAbertoLacuna(true);
      setAbertoErro(false);
      setAbertoDesc(false);
    }
  };

  // Função para lidar com a exclusão do widget do editor
  const handleHighlightDelete = (idToDelete) => {
    // Fecha os popups se o item excluído for o que está aberto
    const itemToDelete = window.errosLacuna.find(
      (item) => item.id === idToDelete
    );
    if (itemToDelete) {
      if (itemToDelete.type === "error" && openedError === idToDelete) {
        setAbertoErro(false);
      }
      if (itemToDelete.type === "gap" && openedGap === idToDelete) {
        setAbertoLacuna(false);
      }
    }
    // Atualiza o estado removendo o item
    updateWindow({
      ...window,
      errosLacuna: window.errosLacuna.filter((item) => item.id !== idToDelete),
    });
  };

  // 1. Plugin para destacar erros e lacunas
  const highlightPlugin = useMemo(() => {
    // Classe para o nosso widget de botão customizado
    class ButtonWidget extends WidgetType {
      constructor(text, type, item, onClick, onDelete) {
        super();
        this.text = text;
        this.type = type;
        this.item = item;
        this.onClick = onClick;
        this.onDelete = onDelete;
      }

      toDOM() {
        const span = document.createElement("span"); // Usa <span> para ser inline
        const buttonText = document.createElement("button");
        const buttonX = document.createElement("button");
        buttonX.className = "cm-widget-buttons cm-widget-button-delete";
        buttonX.textContent = "x";
        buttonText.className = "cm-widget-buttons";
        buttonText.textContent = this.text;
        span.className = `cm-widget-button ${
          this.type === "error"
            ? "cm-widget-button-error"
            : "cm-widget-button-gap"
        }${
          openedError === this.item.id || openedGap === this.item.id
            ? " active"
            : ""
        }`;
        buttonText.onclick = () => this.onClick(this.item);
        buttonX.onclick = (e) => {
          e.stopPropagation(); // Impede que o clique no 'x' acione o clique principal
          this.onDelete(this.item.id);
        };
        span.appendChild(buttonText);
        span.appendChild(buttonX);
        return span;
      }

      ignoreEvent() {
        return false; // Permite que o clique seja processado
      }
    }

    return EditorView.decorations.compute(["doc"], (state) => {
      const decorations = [];
      // Filtra os itens para mostrar apenas os do tipo selecionado (erro ou lacuna)
      const itemsToShow = window.errosLacuna.filter(
        (item) => item.type === switchQuestionTemplate
      );
      itemsToShow.sort((a, b) => a.start - b.start);
      // Itera sobre os itens filtrados
      for (const item of itemsToShow) {
        if (item.start < item.end && item.end <= state.doc.length) {
          const text = state.doc.sliceString(item.start, item.end);
          // Substitui o texto pelo nosso widget de botão
          decorations.push(
            Decoration.replace({
              widget: new ButtonWidget(
                text,
                item.type,
                item,
                handleHighlightClick,
                handleHighlightDelete
              ),
            }).range(item.start, item.end)
          );
        }
      }
      return Decoration.set(decorations);
    });
  }, [window.errosLacuna, openedError, openedGap, switchQuestionTemplate]);

  // 2. Injeta os estilos para as decorações no documento
  useEffect(() => {
    const styleId = "codemirror-custom-highlights";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        .cm-widget-button {
          border: none;
          border-radius: 5px;
          padding: 3px 3px;
          color: black;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9em;
          display: inline-flex; /* Garante alinhamento dos botões internos */
          width: fit-content;
          background-color: #B1FF9C; 
        }
        .cm-widget-button:hover {
          filter: brightness(1.2);
        }
        .cm-widget-buttons {
          border: none;
          border-radius: none;
          color: black;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9em;
          background-color: transparent
        }
        .cm-widget-button-delete {
          margin-left: 4px;
          font-weight: bold;
          padding: 0 4px;
          border-radius: 50%;
          line-height: 1;
        }
        .active{
          background-color: #78c862ff;
        }
      `;
      document.head.appendChild(style);
    }
    // Não é necessário cleanup se o estilo deve persistir
  }, []);

  const theme = EditorView.theme({
    "&.cm-focused": { outline: "none" },
    ".cm-gutters": { borderRadius: "15px 0 0 15px" },
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          setIsDragging(true);
          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value,
          });
          pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (e, gestureState) => {
          let newX = gestureState.dx + pan.x._offset;
          let newY = gestureState.dy + pan.y._offset;

          const MIN_X = 20;
          const MAX_X = width - 370;
          const MIN_Y = 20;
          let MAX_Y = closed ? height - 100 : height - 500;

          newX = Math.max(MIN_X, Math.min(newX, MAX_X));
          newY = Math.max(MIN_Y, Math.min(newY, MAX_Y));

          pan.setValue({
            x: newX - pan.x._offset,
            y: newY - pan.y._offset,
          });
        },
        onPanResponderRelease: () => {
          setIsDragging(false);
          pan.flattenOffset();
          updateWindow({
            ...window,
            x: pan.x._value,
            y: pan.y._value,
          });
        },
      }),
    [closed, width, height]
  );
  return (
    <Animated.View style={[styles.window, pan.getLayout()]}>
      <View style={styles.questionView}>
        <View style={styles.titleView}>
          {window.type === "minhasQuestoes" ? (
            <Text style={styles.titleText}>{window.nome}</Text>
          ) : (
            <TextInput
              style={styles.titleText}
              value={window.nome}
              onChangeText={(text) => updateWindow({ ...window, nome: text })}
            />
          )}
          <Pressable style={styles.deleteButton} onPress={() => deleteWindow()}>
            <Icon source="delete" size={14} color="black" />
          </Pressable>
          <Pressable
            style={styles.deleteButton}
            onPress={() => {
              setClosed(!closed);
            }}
          >
            <Icon source={closed ? "eye-off" : "eye"} size={14} color="black" />
          </Pressable>
          <Animated.View
            style={[
              styles.deleteButton,
              { cursor: isDragging ? "grabbing" : "grab" },
            ]}
            {...panResponder.panHandlers}
          >
            <Icon source="drag" size={14} color="black" />
          </Animated.View>
        </View>
        {!closed && (
          <View style={styles.questionContent}>
            {window.type === "multiplaEscolha" ? (
              <View style={styles.questionText}>
                <View style={styles.divSwitchQuestionTemplate}>
                  <Pressable
                    style={
                      switchQuestionTemplate == "question"
                        ? styles.selectedSwitchQuestionTemplate
                        : styles.notSelectedSwitchQuestionTemplate
                    }
                    onPress={() => setSwitchQuestionTemplate("question")}
                  >
                    <Text
                      style={
                        switchQuestionTemplate == "question"
                          ? { fontWeight: 500 }
                          : { color: "white" }
                      }
                    >
                      Descrição
                    </Text>
                  </Pressable>
                  <Pressable
                    style={
                      switchQuestionTemplate == "template"
                        ? styles.selectedSwitchQuestionTemplate
                        : styles.notSelectedSwitchQuestionTemplate
                    }
                    onPress={() => setSwitchQuestionTemplate("template")}
                  >
                    <Text
                      style={
                        switchQuestionTemplate == "template"
                          ? { fontWeight: 500 }
                          : { color: "white" }
                      }
                    >
                      Gabarito
                    </Text>
                  </Pressable>
                </View>
                <View>
                  <TextInput
                    multiline={true}
                    numberOfLines={30}
                    placeholder="Escreva a descrição da questão aqui..."
                    style={{
                      height: 350,
                      width: 280,
                      textAlignVertical: "top",
                      backgroundColor: "white",
                      padding: 10,
                      borderRadius: 15,
                      outlineStyle: "none",
                      display:
                        switchQuestionTemplate == "question" ? "flex" : "none",
                    }}
                    onChangeText={(text) =>
                      updateWindow({ ...window, descricao: text })
                    }
                  />

                  <TextInput
                    multiline={true}
                    numberOfLines={30}
                    placeholder="Escreva o gabarito da questão aqui..."
                    style={{
                      height: 350,
                      width: 280,
                      textAlignVertical: "top",
                      backgroundColor: "white",
                      padding: 10,
                      borderRadius: 15,
                      outlineStyle: "none",
                      display:
                        switchQuestionTemplate == "template" ? "flex" : "none",
                    }}
                    onChangeText={(text) =>
                      updateWindow({ ...window, gabarito: text })
                    }
                  />
                </View>
              </View>
            ) : window.type === "codigo" ? (
              <View style={styles.editorContainer}>
                <View style={styles.viewSelectErroLacuna}>
                  <View style={styles.divSwitchQuestionTemplate}>
                    <Pressable
                      style={
                        switchQuestionTemplate == "error"
                          ? styles.selectedSwitchQuestionTemplate
                          : styles.notSelectedSwitchQuestionTemplate
                      }
                      onPress={() => {
                        if (abertoLacuna) {
                          setAbertoLacuna(false);
                        }
                        setSwitchQuestionTemplate("error");
                      }}
                    >
                      <Text
                        style={
                          switchQuestionTemplate == "error"
                            ? { fontWeight: 500 }
                            : { color: "white" }
                        }
                      >
                        Erros
                      </Text>
                    </Pressable>
                    <Pressable
                      style={
                        switchQuestionTemplate == "gap"
                          ? styles.selectedSwitchQuestionTemplate
                          : styles.notSelectedSwitchQuestionTemplate
                      }
                      onPress={() => {
                        if (abertoErro) {
                          setAbertoErro(false);
                        }
                        setSwitchQuestionTemplate("gap");
                      }}
                    >
                      <Text
                        style={
                          switchQuestionTemplate == "gap"
                            ? { fontWeight: 500 }
                            : { color: "white" }
                        }
                      >
                        Lacunas
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <CodeMirror
                    height="100%"
                    extensions={[
                      javascript(),
                      theme,
                      EditorView.lineWrapping,
                      highlightPlugin, // 3. Adiciona o plugin aqui
                    ]}
                    onChange={(code, viewUpdate) => {
                      let newErrosLacuna = [...window.errosLacuna];
                      if (viewUpdate.docChanged) {
                        newErrosLacuna = newErrosLacuna
                          .map((item) => {
                            const newStart = viewUpdate.changes.mapPos(
                              item.start,
                              1
                            );
                            const newEnd = viewUpdate.changes.mapPos(
                              item.end,
                              -1
                            );
                            return { ...item, start: newStart, end: newEnd };
                          })
                          .filter((item) => item.start !== item.end); // Remove itens cujo texto foi totalmente deletado
                      }

                      updateWindow({
                        ...window,
                        script: code,
                        errosLacuna: newErrosLacuna,
                      });
                    }}
                    basicSetup={{ lineNumbers: true }}
                    style={{ fontSize: 16, height: "100%" }}
                    onUpdate={(viewUpdate) => {
                      // Apenas atualiza o estado da seleção se ela mudar
                      if (viewUpdate.selectionSet) {
                        const { from, to } = viewUpdate.state.selection.main;
                        // Evita re-renderizações desnecessárias se a seleção não mudou
                        if (from !== startSelection || to !== endSelection) {
                          setStartSelection(from);
                          setEndSelection(to);
                        }
                      }
                    }}
                  />
                </View>
              </View>
            ) : (
              <Text></Text>
            )}
            {window.type == "multiplaEscolha" && (
              <TextInput
                multiline={true}
                numberOfLines={30}
                placeholder="Escreva a pergunta da questão aqui..."
                style={{
                  height: 80,
                  width: 280,
                  textAlignVertical: "top",
                  backgroundColor: "#6446DB",
                  //placeholderTextColor: "rgb(0, 0, 0)",
                  padding: 10,
                  outlineStyle: "none",
                }}
                onChangeText={(text) =>
                  updateWindow({ ...window, pergunta: text })
                }
              />
            )}
          </View>
        )}
      </View>
      {window.type !== "minhasQuestoes" &&
        !closed &&
        (window.type === "codigo" ? (
          <View style={styles.questionPopups}>
            <View style={styles.popupView}>
              <Pressable
                style={styles.popupIcon}
                onPress={() => {
                  setAbertoConfig(!abertoConfig);
                }}
              >
                <Icon source="cog" size={20} color="black" />
              </Pressable>
              {abertoConfig && (
                <View style={styles.viewDesc}>
                  <Text>Configurações</Text>
                  <View
                    style={{
                      width: 230,
                      backgroundColor: "#EEEEEE",
                      padding: 10,
                      borderRadius: 15,
                    }}
                  >
                    <Text>Categoria:</Text>
                    <DropDownPicker
                      zIndex={5000}
                      style={styles.picker}
                      items={categorias}
                      value={categoria}
                      open={openCategoria}
                      setItems={setCategorias}
                      setOpen={setOpenCategoria}
                      setValue={setCategoria}
                      onOpen={() => {
                        setOpenRank(false);
                      }}
                      onSelectItem={(item) => {
                        updateWindow({
                          ...window,
                          categoria: item.value,
                        });
                      }}
                      placeholder="Selecione uma categoria..."
                      listMode="SCROLLVIEW"
                      dropDownContainerStyle={{
                        zIndex: 5000,
                        backgroundColor: "white",
                        borderWidth: 0,
                        borderRadius: 20,
                        width: 210,
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                      }}
                      // Estilo de cada item da lista
                      listItemContainerStyle={{
                        backgroundColor: "white",
                        borderWidth: 0,
                        height: 45,
                      }}
                      // Estilo do texto de cada item
                      listItemLabelStyle={{
                        color: "#333",
                        fontSize: 14,
                      }}
                      selectedItemLabelStyle={{
                        color: "#6200ee",
                        fontWeight: "bold",
                      }}
                      // Estilo do placeholder
                      placeholderStyle={{
                        color: "grey",
                      }}
                      // Estilo da seta
                      arrowIconStyle={{
                        tintColor: "#6200ee",
                      }}
                    />
                    {usuario.adm && (
                      <View>
                        <Text>Rank:</Text>
                        <DropDownPicker
                          zIndex={4000}
                          style={styles.picker}
                          items={rankItens}
                          value={rank}
                          open={openRank}
                          setItems={setRankItens}
                          setOpen={setOpenRank}
                          setValue={setRank}
                          onOpen={() => {
                            setOpenTipo(false);
                            setOpenNivel(false);
                          }}
                          onChangeValue={(value) => {
                            updateWindow({ ...window, rankId: value });
                          }}
                          placeholder="Selecione um rank..."
                          listMode="SCROLLVIEW"
                          dropDownContainerStyle={{
                            zIndex: 4000,
                            backgroundColor: "white",
                            borderWidth: 0,
                            borderRadius: 20,
                            width: 210,
                            maxHeight: 140,
                            shadowColor: "#000",
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                          }}
                          // Estilo de cada item da lista
                          listItemContainerStyle={{
                            backgroundColor: "white",
                            borderWidth: 0,
                            height: 45,
                          }}
                          // Estilo do texto de cada item
                          listItemLabelStyle={{
                            color: "#333",
                            fontSize: 14,
                          }}
                          selectedItemLabelStyle={{
                            color: "#6200ee",
                            fontWeight: "bold",
                          }}
                          // Estilo do placeholder
                          placeholderStyle={{
                            color: "grey",
                          }}
                          // Estilo da seta
                          arrowIconStyle={{
                            tintColor: "#6200ee",
                          }}
                        />
                      </View>
                    )}
                  </View>
                </View>
              )}
              {abertoConfig && <View style={{ height: 280 }}></View>}
            </View>
            {!abertoConfig && (
              <>
                <View style={styles.popupView}>
                  <Pressable
                    style={styles.popupIcon}
                    onPress={() => {
                      setAbertoDesc(!abertoDesc);
                      setAbertoLacuna(false);
                      setAbertoErro(false);
                    }}
                  >
                    <Icon source="pen" size={20} color="black" />
                  </Pressable>
                  {abertoDesc && (
                    <View style={styles.viewDesc}>
                      <Text>Descrição</Text>
                      <TextInput
                        multiline={true}
                        numberOfLines={10}
                        placeholder="Escreva aqui a descrição do algoritmo..."
                        style={{
                          height: 137.6,
                          width: 230,
                          textAlignVertical: "top",
                          backgroundColor: "#EEEEEE",
                          padding: 10,
                          borderRadius: 15,
                          outlineStyle: "none",
                        }}
                        onChange={(text) => {
                          updateWindow({ ...window, descricao: text });
                        }}
                      />
                    </View>
                  )}
                  {abertoDesc && <View style={{ height: 160 }}></View>}
                </View>
                <View style={styles.popupView}>
                  <Pressable
                    style={styles.popupIcon}
                    onPress={async () => {
                      if (
                        (switchQuestionTemplate === "error" &&
                          startSelection !== endSelection) ||
                        abertoErro
                      ) {
                        if (abertoErro) {
                          setAbertoErro(false);
                          setOpenedError(null);
                        } else {
                          const newId = Date.now();
                          await updateWindow({
                            ...window,
                            errosLacuna: [
                              ...window.errosLacuna,
                              {
                                type: "error",
                                start: startSelection,
                                end: endSelection,
                                id: newId,
                                distratores: [],
                                nivel: 0, // Inicializa o nível do erro
                              },
                            ],
                          });
                          setOpenedError(newId);
                          setAbertoErro(!abertoErro);
                          setAbertoLacuna(false);
                          setAbertoDesc(false);
                          setStartSelection(0);
                          setEndSelection(0);
                        }
                      }
                    }}
                  >
                    <Icon source="alert" size={20} color="black" />
                    {endSelection !== startSelection &&
                      switchQuestionTemplate === "error" &&
                      !abertoErro && <Text>Novo Erro</Text>}
                  </Pressable>
                  {abertoErro && (
                    <View style={styles.viewDesc}>
                      <Text>Encontre o Erro</Text>
                      <ScrollView
                        style={{
                          height: 137.6,
                          width: 230,
                          backgroundColor: "#EEEEEE",
                          padding: 10,
                          borderRadius: 15,
                        }}
                        showsVerticalScrollIndicator={false}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 5,
                            alignItems: "center",
                          }}
                        >
                          <Text style={styles.erroLacunaText}>Erro:</Text>
                          <Text style={styles.erroLacunaInput}>
                            {window.script.substring(
                              window.errosLacuna.find(
                                (x) => x.id === openedError
                              ).start,
                              window.errosLacuna.find(
                                (x) => x.id === openedError
                              ).end
                            )}
                          </Text>
                        </View>
                        {/* aqui vai a dificuldade erro */}
                        {usuario.adm && (
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 5,
                              alignItems: "center",
                              marginTop: 5,
                            }}
                          >
                            <Text style={styles.erroLacunaText}>Nível: </Text>
                            <Pressable
                              style={[
                                styles.erroLacunaNivel,
                                {
                                  backgroundColor:
                                    window.errosLacuna.find(
                                      (x) => x.id === openedError
                                    )?.nivel === 0
                                      ? "#9CEC86"
                                      : window.errosLacuna.find(
                                          (x) => x.id === openedError
                                        )?.nivel === 1
                                      ? "#ece286ff"
                                      : "#FF9999",
                                },
                              ]}
                              onPress={() => {
                                updateWindow({
                                  ...window,
                                  errosLacuna: window.errosLacuna.map(
                                    (item) => {
                                      if (item.id === openedError) {
                                        const novoNivel = (item.nivel + 1) % 3;
                                        return { ...item, nivel: novoNivel };
                                      }
                                      return item;
                                    }
                                  ),
                                });
                              }}
                            >
                              <Text>
                                {"+".repeat(
                                  (window.errosLacuna.find(
                                    (x) => x.id === openedError
                                  )?.nivel || 0) + 1
                                )}
                              </Text>
                            </Pressable>
                          </View>
                        )}
                        <View
                          style={{
                            flexDirection: "row",
                            marginTop: 10,
                            flexWrap: "wrap",
                            gap: 5,
                          }}
                        >
                          <Text style={styles.erroLacunaText}>
                            Opções Alternativas:
                          </Text>
                          <TextInput
                            style={styles.erroLacunaInput}
                            placeholder="Digite"
                            onChangeText={(text) => {
                              setInputText(text);
                            }}
                            value={inputText}
                            onKeyPress={(event) => {
                              if (event.nativeEvent.key === "Enter") {
                                event.preventDefault();
                                updateWindow({
                                  ...window,
                                  errosLacuna: window.errosLacuna.map(
                                    (item) => {
                                      if (item.id === openedError) {
                                        return {
                                          ...item,
                                          distratores: [
                                            ...item.distratores,
                                            { text: inputText, id: Date.now() },
                                          ],
                                        };
                                      }
                                      return item;
                                    }
                                  ),
                                });
                                setInputText("");
                              }
                            }}
                          ></TextInput>
                          {window.errosLacuna
                            .find((x) => x.id === openedError)
                            .distratores.map((x) => {
                              console.log(x);
                              return (
                                <View key={x.id} style={styles.erroLacunaInput}>
                                  <Text style={styles.distratorText}>
                                    {x.text}
                                  </Text>
                                  <Pressable
                                    onPress={() => {
                                      updateWindow({
                                        ...window,
                                        errosLacuna: window.errosLacuna.map(
                                          (item) => {
                                            if (item.id === openedError) {
                                              return {
                                                ...item,
                                                distratores:
                                                  item.distratores.filter(
                                                    (y) => y.id !== x.id
                                                  ),
                                              };
                                            }
                                            return item;
                                          }
                                        ),
                                      });
                                    }}
                                  >
                                    <Icon
                                      source="close"
                                      size={10}
                                      color="black"
                                    />
                                  </Pressable>
                                </View>
                              );
                            })}
                        </View>
                      </ScrollView>
                    </View>
                  )}
                  {abertoErro && <View style={{ height: 160 }}></View>}
                </View>
                <View style={styles.popupView}>
                  <Pressable
                    style={styles.popupIcon}
                    onPress={() => {
                      if (
                        (switchQuestionTemplate === "gap" &&
                          startSelection !== endSelection) ||
                        abertoLacuna
                      ) {
                        if (abertoLacuna) {
                          setAbertoLacuna(false);
                          setOpenedGap(null);
                        } else {
                          const newId = Date.now();
                          updateWindow({
                            ...window,
                            errosLacuna: [
                              ...window.errosLacuna,
                              {
                                type: "gap",
                                start: startSelection,
                                end: endSelection,
                                distratores: [],
                                id: newId,
                                nivel: 0, // Inicializa o nível da lacuna
                              },
                            ],
                          });
                          setOpenedGap(newId);
                          setAbertoLacuna(true);
                          setAbertoErro(false);
                          setAbertoDesc(false);
                          setStartSelection(0);
                          setEndSelection(0);
                        }
                      }
                    }}
                  >
                    <Icon source="format-quote-close" size={20} color="black" />
                    {endSelection !== startSelection &&
                      switchQuestionTemplate === "gap" &&
                      !abertoLacuna && <Text>Nova Lacuna</Text>}
                  </Pressable>
                  {abertoLacuna && (
                    <View style={styles.viewDesc}>
                      <Text>Complete o código</Text>
                      <ScrollView
                        style={{
                          height: 137.6,
                          width: 230,
                          backgroundColor: "#EEEEEE",
                          padding: 10,
                          borderRadius: 15,
                          gap: 10,
                        }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                      >
                        <View style={{ flexDirection: "row", gap: 5 }}>
                          <Text style={styles.erroLacunaText}>Lacuna:</Text>
                          <Text style={styles.erroLacunaInput}>
                            {window.script.substring(
                              window.errosLacuna.find((x) => x.id === openedGap)
                                .start,
                              window.errosLacuna.find((x) => x.id === openedGap)
                                .end
                            )}
                          </Text>
                        </View>
                        {usuario.adm && (
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 5,
                              alignItems: "center",
                              marginTop: 5,
                            }}
                          >
                            <Text style={styles.erroLacunaText}>Nível: </Text>
                            <Pressable
                              style={[
                                styles.erroLacunaNivel,
                                {
                                  backgroundColor:
                                    window.errosLacuna.find(
                                      (x) => x.id === openedGap
                                    )?.nivel === 0
                                      ? "#9CEC86"
                                      : window.errosLacuna.find(
                                          (x) => x.id === openedGap
                                        )?.nivel === 1
                                      ? "#ece286ff"
                                      : "#FF9999",
                                },
                              ]}
                              onPress={() => {
                                updateWindow({
                                  ...window,
                                  errosLacuna: window.errosLacuna.map(
                                    (item) => {
                                      if (item.id === openedGap) {
                                        const novoNivel = (item.nivel + 1) % 3;
                                        return { ...item, nivel: novoNivel };
                                      }
                                      return item;
                                    }
                                  ),
                                });
                              }}
                            >
                              <Text>
                                {"+".repeat(
                                  (window.errosLacuna.find(
                                    (x) => x.id === openedGap
                                  )?.nivel || 0) + 1
                                )}
                              </Text>
                            </Pressable>
                          </View>
                        )}
                        <View
                          style={{
                            flexDirection: "row",
                            marginTop: 10,
                            flexWrap: "wrap",
                            gap: 5,
                          }}
                        >
                          <Text style={styles.erroLacunaText}>
                            Distratores:
                          </Text>
                          <TextInput
                            style={styles.erroLacunaInput}
                            placeholder="Digite"
                            onChangeText={(text) => {
                              setInputText(text);
                            }}
                            value={inputText}
                            onKeyPress={(event) => {
                              if (event.nativeEvent.key === "Enter") {
                                event.preventDefault();
                                updateWindow({
                                  ...window,
                                  errosLacuna: window.errosLacuna.map(
                                    (item) => {
                                      if (item.id === openedGap) {
                                        return {
                                          ...item,
                                          distratores: [
                                            ...item.distratores,
                                            {
                                              text: inputText,
                                              id: Date.now(),
                                            },
                                          ],
                                        };
                                      }
                                      return item;
                                    }
                                  ),
                                });
                                setInputText("");
                              }
                            }}
                          ></TextInput>
                          {window.errosLacuna
                            .find((x) => x.id === openedGap)
                            .distratores.map((x) => {
                              console.log(x);
                              return (
                                <View key={x.id} style={styles.erroLacunaInput}>
                                  <Text style={styles.distratorText}>
                                    {x.text}
                                  </Text>
                                  <Pressable
                                    style={styles.erroLacunaX}
                                    onPress={() => {
                                      updateWindow({
                                        ...window,
                                        errosLacuna: window.errosLacuna.map(
                                          (item) => {
                                            if (item.id === openedGap) {
                                              return {
                                                ...item,
                                                distratores:
                                                  item.distratores.filter(
                                                    (y) => y.id !== x.id
                                                  ),
                                              };
                                            }
                                            return item;
                                          }
                                        ),
                                      });
                                    }}
                                  >
                                    <Icon
                                      source="close"
                                      size={10}
                                      color="black"
                                    />
                                  </Pressable>
                                </View>
                              );
                            })}
                        </View>
                      </ScrollView>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        ) : (
          <View style={styles.questionPopups}>
            <View style={styles.popupView}>
              <Pressable
                style={styles.popupIcon}
                onPress={() => {
                  setAbertoConfig(!abertoConfig);
                }}
              >
                <Icon source="cog" size={20} color="black" />
              </Pressable>
              {abertoConfig && (
                <View style={styles.viewDesc}>
                  <Text>Configurações</Text>
                  <View
                    style={{
                      width: 230,
                      backgroundColor: "#EEEEEE",
                      padding: 10,
                      borderRadius: 15,
                    }}
                  >
                    <Text>Categoria:</Text>
                    <DropDownPicker
                      zIndex={5000}
                      style={styles.picker}
                      items={categorias}
                      value={categoria}
                      open={openCategoria}
                      setItems={setCategorias}
                      setOpen={setOpenCategoria}
                      setValue={setCategoria}
                      onOpen={() => {
                        setOpenRank(false);
                      }}
                      onSelectItem={(item) => {
                        updateWindow({
                          ...window,
                          categoria: item.value,
                        });
                      }}
                      placeholder="Selecione uma categoria..."
                      listMode="SCROLLVIEW"
                      dropDownContainerStyle={{
                        zIndex: 5000,
                        backgroundColor: "white",
                        borderWidth: 0,
                        borderRadius: 20,
                        width: 210,
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                      }}
                      // Estilo de cada item da lista
                      listItemContainerStyle={{
                        backgroundColor: "white",
                        borderWidth: 0,
                        height: 45,
                      }}
                      // Estilo do texto de cada item
                      listItemLabelStyle={{
                        color: "#333",
                        fontSize: 14,
                      }}
                      selectedItemLabelStyle={{
                        color: "#6200ee",
                        fontWeight: "bold",
                      }}
                      // Estilo do placeholder
                      placeholderStyle={{
                        color: "grey",
                      }}
                      // Estilo da seta
                      arrowIconStyle={{
                        tintColor: "#6200ee",
                      }}
                    />
                    {usuario.adm && (
                      <View>
                        <Text>Tipo:</Text>
                        <DropDownPicker
                          zIndex={5000}
                          style={styles.picker}
                          items={tipos}
                          value={tipo}
                          open={openTipo}
                          setItems={setTipos}
                          setOpen={setOpenTipo}
                          setValue={setTipo}
                          onOpen={() => {
                            setOpenRank(false);
                            setOpenNivel(false);
                          }}
                          onSelectItem={(item) => {
                            const value = item.value; // `value` é o novo tipo selecionado
                            // Filtra a lista original de `ranks` com base no tipo
                            const newRankItems = ranks
                              .filter((r) => r.tipo === value)
                              .map((r) => ({ label: r.nome, value: r.id }));
                            setRankItens(newRankItems);
                            setRank(null); // Reseta a seleção do rank
                            updateWindow({
                              ...window,
                              tipo: value,
                              rankId: null,
                              nivel: null,
                            });
                          }}
                          placeholder="Selecione um tipo..."
                          listMode="SCROLLVIEW"
                          dropDownContainerStyle={{
                            zIndex: 5000,
                            backgroundColor: "white",
                            borderWidth: 0,
                            borderRadius: 20,
                            width: 210,
                            shadowColor: "#000",
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                          }}
                          // Estilo de cada item da lista
                          listItemContainerStyle={{
                            backgroundColor: "white",
                            borderWidth: 0,
                            height: 45,
                          }}
                          // Estilo do texto de cada item
                          listItemLabelStyle={{
                            color: "#333",
                            fontSize: 14,
                          }}
                          selectedItemLabelStyle={{
                            color: "#6200ee",
                            fontWeight: "bold",
                          }}
                          // Estilo do placeholder
                          placeholderStyle={{
                            color: "grey",
                          }}
                          // Estilo da seta
                          arrowIconStyle={{
                            tintColor: "#6200ee",
                          }}
                        />
                        <Text>Rank:</Text>
                        <DropDownPicker
                          zIndex={4000}
                          style={styles.picker}
                          items={rankItens}
                          value={rank}
                          open={openRank}
                          setItems={setRankItens}
                          setOpen={setOpenRank}
                          setValue={setRank}
                          onOpen={() => {
                            setOpenTipo(false);
                            setOpenNivel(false);
                          }}
                          onChangeValue={(value) => {
                            updateWindow({ ...window, rankId: value });
                          }}
                          placeholder="Selecione um rank..."
                          listMode="SCROLLVIEW"
                          dropDownContainerStyle={{
                            zIndex: 4000,
                            backgroundColor: "white",
                            borderWidth: 0,
                            borderRadius: 20,
                            width: 210,
                            maxHeight: 140,
                            shadowColor: "#000",
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                          }}
                          // Estilo de cada item da lista
                          listItemContainerStyle={{
                            backgroundColor: "white",
                            borderWidth: 0,
                            height: 45,
                          }}
                          // Estilo do texto de cada item
                          listItemLabelStyle={{
                            color: "#333",
                            fontSize: 14,
                          }}
                          selectedItemLabelStyle={{
                            color: "#6200ee",
                            fontWeight: "bold",
                          }}
                          // Estilo do placeholder
                          placeholderStyle={{
                            color: "grey",
                          }}
                          // Estilo da seta
                          arrowIconStyle={{
                            tintColor: "#6200ee",
                          }}
                        />
                        <Text>Nível:</Text>
                        <Pressable
                          style={[
                            styles.erroLacunaNivel,
                            {
                              backgroundColor:
                                window.nivel === 0
                                  ? "#9CEC86"
                                  : window.nivel === 1
                                  ? "#ece286ff"
                                  : "#FF9999",
                            },
                          ]}
                          onPress={() => {
                            updateWindow({
                              ...window,
                              nivel: (window.nivel + 1) % 3,
                            });
                          }}
                        >
                          <Text>
                            {"+".repeat((window.nivel || 0) + 1)}
                          </Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                </View>
              )}
              {abertoConfig && <View style={{ height: 280 }}></View>}
            </View>
            {!abertoConfig && (
              <>
                <View style={styles.popupView}>
                  <Pressable
                    style={styles.popupIcon}
                    onPress={() => setAbertoA(!abertoA)}
                  >
                    <Icon source="alpha-a" size={20} color="black" />
                  </Pressable>
                  {abertoA && (
                    <View
                      style={{
                        ...styles.viewOpcoes,
                        backgroundColor:
                          window.opcaoCorreta === ""
                            ? "white"
                            : window.opcaoCorreta === "a"
                            ? "#9CEC86"
                            : "#FF9999",
                      }}
                    >
                      <View>
                        <TextInput
                          placeholder="Escreva aqui a alternativa A..."
                          onChangeText={(text) =>
                            updateWindow({ ...window, opcao1: text })
                          }
                          style={{
                            height: 40,
                            width: 230,
                            backgroundColor:
                              window.opcaoCorreta === ""
                                ? "white"
                                : window.opcaoCorreta === "a"
                                ? "#9CEC86"
                                : "#FF9999",
                            padding: 10,
                            borderRadius: 15,
                            outlineStyle: "none",
                          }}
                        />
                      </View>
                      {window.opcaoCorreta.length === 0 ? (
                        <Pressable
                          style={styles.opcaoCorreta}
                          onPress={() =>
                            updateWindow({ ...window, opcaoCorreta: "a" })
                          }
                        >
                          <Icon source="check" size={20} color="black" />
                        </Pressable>
                      ) : window.opcaoCorreta === "a" ? (
                        <Pressable
                          style={styles.opcaoCorreta}
                          onPress={() =>
                            updateWindow({ ...window, opcaoCorreta: "" })
                          }
                        >
                          <Icon source="close" size={20} color="black" />
                        </Pressable>
                      ) : (
                        <></>
                      )}
                    </View>
                  )}
                </View>
                <View style={styles.popupView}>
                  <Pressable
                    style={styles.popupIcon}
                    onPress={() => setAbertoB(!abertoB)}
                  >
                    <Icon source="alpha-b" size={20} color="black" />
                  </Pressable>
                  {abertoB && (
                    <View
                      style={{
                        ...styles.viewOpcoes,
                        backgroundColor:
                          window.opcaoCorreta === ""
                            ? "white"
                            : window.opcaoCorreta === "b"
                            ? "#9CEC86"
                            : "#FF9999",
                      }}
                    >
                      <View>
                        <TextInput
                          placeholder="Escreva aqui a alternativa B..."
                          onChangeText={(text) =>
                            updateWindow({ ...window, opcao2: text })
                          }
                          style={{
                            height: 40,
                            width: 230,
                            backgroundColor:
                              window.opcaoCorreta === ""
                                ? "white"
                                : window.opcaoCorreta === "b"
                                ? "#9CEC86"
                                : "#FF9999",
                            padding: 10,
                            borderRadius: 15,
                            outlineStyle: "none",
                          }}
                        />
                      </View>
                      {window.opcaoCorreta.length === 0 ? (
                        <Pressable
                          style={styles.opcaoCorreta}
                          onPress={() =>
                            updateWindow({ ...window, opcaoCorreta: "b" })
                          }
                        >
                          <Icon source="check" size={20} color="black" />
                        </Pressable>
                      ) : window.opcaoCorreta === "b" ? (
                        <Pressable
                          style={styles.opcaoCorreta}
                          onPress={() =>
                            updateWindow({ ...window, opcaoCorreta: "" })
                          }
                        >
                          <Icon source="close" size={20} color="black" />
                        </Pressable>
                      ) : (
                        <></>
                      )}
                    </View>
                  )}
                </View>
                <View style={styles.popupView}>
                  <Pressable
                    style={styles.popupIcon}
                    onPress={() => setAbertoC(!abertoC)}
                  >
                    <Icon source="alpha-c" size={20} color="black" />
                  </Pressable>
                  {abertoC && (
                    <View
                      style={{
                        ...styles.viewOpcoes,
                        backgroundColor:
                          window.opcaoCorreta === ""
                            ? "white"
                            : window.opcaoCorreta === "c"
                            ? "#9CEC86"
                            : "#FF9999",
                      }}
                    >
                      <View>
                        <TextInput
                          placeholder="Escreva aqui a alternativa C..."
                          onChangeText={(text) =>
                            updateWindow({ ...window, opcao3: text })
                          }
                          style={{
                            height: 40,
                            width: 230,
                            backgroundColor:
                              window.opcaoCorreta === ""
                                ? "white"
                                : window.opcaoCorreta === "c"
                                ? "#9CEC86"
                                : "#FF9999",
                            padding: 10,
                            borderRadius: 15,
                            outlineStyle: "none",
                          }}
                        />
                      </View>
                      {window.opcaoCorreta.length === 0 ? (
                        <Pressable
                          style={styles.opcaoCorreta}
                          onPress={() =>
                            updateWindow({ ...window, opcaoCorreta: "c" })
                          }
                        >
                          <Icon source="check" size={20} color="black" />
                        </Pressable>
                      ) : window.opcaoCorreta === "c" ? (
                        <Pressable
                          style={styles.opcaoCorreta}
                          onPress={() =>
                            updateWindow({ ...window, opcaoCorreta: "" })
                          }
                        >
                          <Icon source="close" size={20} color="black" />
                        </Pressable>
                      ) : (
                        <></>
                      )}
                    </View>
                  )}
                </View>
                <View style={styles.popupView}>
                  <Pressable
                    style={styles.popupIcon}
                    onPress={() => setAbertoD(!abertoD)}
                  >
                    <Icon source="alpha-d" size={20} color="black" />
                  </Pressable>
                  {abertoD && (
                    <View
                      style={{
                        ...styles.viewOpcoes,
                        backgroundColor:
                          window.opcaoCorreta === ""
                            ? "white"
                            : window.opcaoCorreta === "d"
                            ? "#9CEC86"
                            : "#FF9999",
                      }}
                    >
                      <View>
                        <TextInput
                          placeholder="Escreva aqui a alternativa D..."
                          onChangeText={(text) =>
                            updateWindow({ ...window, opcao4: text })
                          }
                          style={{
                            height: 40,
                            width: 230,
                            backgroundColor:
                              window.opcaoCorreta === ""
                                ? "white"
                                : window.opcaoCorreta === "d"
                                ? "#9CEC86"
                                : "#FF9999",
                            padding: 10,
                            borderRadius: 15,
                            outlineStyle: "none",
                          }}
                        />
                      </View>
                      {window.opcaoCorreta.length === 0 ? (
                        <Pressable
                          style={styles.opcaoCorreta}
                          onPress={() =>
                            updateWindow({ ...window, opcaoCorreta: "d" })
                          }
                        >
                          <Icon source="check" size={20} color="black" />
                        </Pressable>
                      ) : window.opcaoCorreta === "d" ? (
                        <Pressable
                          style={styles.opcaoCorreta}
                          onPress={() =>
                            updateWindow({ ...window, opcaoCorreta: "" })
                          }
                        >
                          <Icon source="close" size={20} color="black" />
                        </Pressable>
                      ) : (
                        <></>
                      )}
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  window: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    position: "absolute",
  },
  titleView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  titleText: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#BFECFF",
    padding: 8,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    width: 180,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#6446DB",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionView: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  questionContent: {
    backgroundColor: "#6446DB",
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 300,
    height: 450,
  },
  questionText: {
    backgroundColor: "white",
    padding: 0,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
    height: "400",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  questionPopups: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    paddingTop: 50,
    alignItems: "flex-start", // Adicionado para evitar que os popups se estiquem
  },
  popupView: {
    padding: 0,
  },
  popupIcon: {
    padding: 10,
    backgroundColor: "#BFECFF",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
    height: 40,
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  viewDesc: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    width: 250,
    minHeight: 200,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  viewOpcoes: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    backgroundColor: "white",
    height: 40,
    width: 270,
    borderRadius: 15,
    paddingLeft: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  opcaoCorreta: {
    padding: 10,
    backgroundColor: "#6446DB",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
    width: 40,
    height: 40,
    zIndex: 1,
  },
  divSwitchQuestionTemplate: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#6446DB",
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    gap: 5,
  },
  selectedSwitchQuestionTemplate: {
    backgroundColor: "#BFECFF",
    paddingHorizontal: 5,
    paddingVertical: 0,
    borderRadius: 15,
    fontWeight: "bold",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notSelectedSwitchQuestionTemplate: {
    paddingHorizontal: 5,
    paddingVertical: 0,
    borderRadius: 15,
  },
  picker: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 5,
    border: "none",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 210,
  },
  editorContainer: {
    flex: 1,
    width: 280,
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    paddingTop: 10,
  },
  viewSelectErroLacuna: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  erroLacunaText: {
    color: "#6446DB",
    fontSize: 16,
  },
  erroLacunaInput: {
    backgroundColor: "#BFECFF",
    display: "flex",
    flexDirection: "row",
    padding: 5,
    outlineColor: "grey",
    borderRadius: 15,
    minWidth: 80,
    textAlign: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  distratorText: {
    color: "black",
  },
  erroLacunaNivel: {
    display: "flex",
    flexDirection: "row",
    padding: 5,
    outlineColor: "grey",
    borderRadius: 15,
    minWidth: 80,
    textAlign: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
});
