import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
  PanResponder,
  useWindowDimensions,
} from "react-native";
import React, { useRef, useState, useMemo } from "react";
import { Icon } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor';

export default function Window({
  window,
  updateWindow,
  deleteWindow,
  ranks,
  usuario,
}) {
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
  const [switchQuestionTemplate, setSwitchQuestionTemplate] =
    useState("question");
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

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
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
    <Animated.View
      style={[styles.window, pan.getLayout()]}
      {...panResponder.panHandlers}
    >
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
              console.log("Botão pressionado, estado atual:", closed);
              setClosed(!closed);
            }}
          >
            <Icon source={closed ? "eye-off" : "eye"} size={14} color="black" />
          </Pressable>
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
              <CodeEditor
            style={{
                fontSize: 20,
                inputLineHeight: 26,
                highlighterLineHeight: 26,
            }}
            language="javascript"
            syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
            showLineNumbers
        />
            ) : (
              <Text></Text>
            )}
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
                  />
                </View>
              )}
              {abertoDesc && <View style={{ height: 160 }}></View>}
            </View>
            <View style={styles.popupView}>
              <Pressable
                style={styles.popupIcon}
                onPress={() => {
                  setAbertoErro(!abertoErro);
                  setAbertoLacuna(false);
                  setAbertoDesc(false);
                }}
              >
                <Icon source="alert" size={20} color="black" />
              </Pressable>
              {abertoErro && (
                <View style={styles.viewDesc}>
                  <Text>Encontre o Erro</Text>
                  <View
                    style={{
                      height: 137.6,
                      width: 230,
                      backgroundColor: "#EEEEEE",
                      padding: 10,
                      borderRadius: 15,
                    }}
                  ></View>
                </View>
              )}
              {abertoErro && <View style={{ height: 160 }}></View>}
            </View>
            <View style={styles.popupView}>
              <Pressable
                style={styles.popupIcon}
                onPress={() => {
                  setAbertoLacuna(!abertoLacuna);
                  setAbertoErro(false);
                  setAbertoDesc(false);
                }}
              >
                <Icon source="format-quote-close" size={20} color="black" />
              </Pressable>
              {abertoLacuna && (
                <View style={styles.viewDesc}>
                  <Text>Complete o código</Text>
                  <View
                    style={{
                      height: 137.6,
                      width: 230,
                      backgroundColor: "#EEEEEE",
                      padding: 10,
                      borderRadius: 15,
                    }}
                  ></View>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.questionPopups}>
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
            {usuario.adm && (
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
                        onChangeValue={(value) => { // `value` é o novo tipo selecionado
                          // Filtra a lista original de `ranks` com base no tipo
                          const newRankItems = ranks
                            .filter((r) => r.tipo === value)
                            .map((r) => ({ label: r.nome, value: r.id }));
                          setRankItens(newRankItems);
                          setRank(null); // Reseta a seleção do rank
                          updateWindow({ ...window, tipo: value, rankId: null });
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
                      <DropDownPicker
                        zIndex={3000}
                        style={styles.picker}
                        items={nivelItens}
                        value={nivel}
                        open={openNivel}
                        setItems={setNiveis}
                        setOpen={setOpenNivel}
                        setValue={setNivel}
                        onOpen={() => {
                          setOpenTipo(false);
                          setOpenRank(false);
                        }}
                        onChangeValue={(value) => {
                          updateWindow({ ...window, nivel: value });
                        }}
                        placeholder="Selecione um nível..."
                        listMode="SCROLLVIEW"
                        dropDownContainerStyle={{
                          zIndex: 3000,
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
                    </View>
                  </View>
                )}
                {abertoErro && <View style={{ height: 160 }}></View>}
              </View>
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
    width: 40,
    height: 40,
    zIndex: 1,
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
});
