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

export default function Window({ window, updateWindow, deleteWindow }) {
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
            <View style={styles.questionText}></View>
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
                onPress={() => {setAbertoDesc(!abertoDesc) ; setAbertoLacuna(false) ; setAbertoErro(false)}}
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
                        height: 200,
                        width: 230,
                        textAlignVertical: 'top',
                        backgroundColor: "#EEEEEE",
                        padding: 10,
                        borderRadius: 15,
                        // outlineStyle: 'none',
                    }}
                  />
                </View>
              )}
              {abertoDesc && (<View style={{height: 160}}></View>)}
            </View>
            <View style={styles.popupView}>
              <Pressable style={styles.popupIcon} onPress={() => {setAbertoErro(!abertoErro) ; setAbertoLacuna(false) ; setAbertoDesc(false)}}>
                <Icon source="alert" size={20} color="black" />
              </Pressable>
              {abertoErro &&(
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
              {abertoErro && (<View style={{height: 160}}></View>)}
            </View>
            <View style={styles.popupView}>
              <Pressable style={styles.popupIcon} onPress={() => {setAbertoLacuna(!abertoLacuna) ; setAbertoErro(false) ; setAbertoDesc(false)}}>
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
              <Pressable style={styles.popupIcon} onPress={() => setAbertoA(!abertoA)}>
                <Icon source="alpha-a" size={20} color="black" />
              </Pressable>
              {abertoA && (
                <View style={styles.viewOpcoes}>
                  <View>
                      <TextInput
                      placeholder="Escreva aqui a alternativa A..."
                      style={{ 
                          height: 40,
                          width: 230,
                          backgroundColor: "white",
                          padding: 10,
                          borderRadius: 15,
                          // outlineStyle: 'none',
                      }}
                    />
                  </View>
                <Pressable style={styles.opcaoCorreta}>
                  <Icon source="check" size={20} color="black" />
                </Pressable>
                </View>
              )}
            </View>
            <View style={styles.popupView}>
              <Pressable style={styles.popupIcon} onPress={() => setAbertoB(!abertoB)}>
                <Icon source="alpha-b" size={20} color="black" />
              </Pressable>
              {abertoB && (
                <View style={styles.viewOpcoes}>
                  <View>
                      <TextInput
                      placeholder="Escreva aqui a alternativa B..."
                      style={{ 
                          height: 40,
                          width: 230,
                          backgroundColor: "white",
                          padding: 10,
                          borderRadius: 15,
                          // outlineStyle: 'none',
                      }}
                    />
                  </View>
                <Pressable style={styles.opcaoCorreta}>
                  <Icon source="check" size={20} color="black" />
                </Pressable>
                </View>
              )}
            </View>
            <View style={styles.popupView}>
              <Pressable style={styles.popupIcon} onPress={() => setAbertoC(!abertoC)}>
                <Icon source="alpha-c" size={20} color="black" />
              </Pressable>
              {abertoC && (
                <View style={styles.viewOpcoes}>
                  <View>
                      <TextInput
                      placeholder="Escreva aqui a alternativa C..."
                      style={{ 
                          height: 40,
                          width: 230,
                          backgroundColor: "white",
                          padding: 10,
                          borderRadius: 15,
                          // outlineStyle: 'none',
                      }}
                    />
                  </View>
                <Pressable style={styles.opcaoCorreta}>
                  <Icon source="check" size={20} color="black" />
                </Pressable>
                </View>
              )}
            </View>
            <View style={styles.popupView}>
              <Pressable style={styles.popupIcon} onPress={() => setAbertoD(!abertoD)}>
                <Icon source="alpha-d" size={20} color="black" />
              </Pressable>
              {abertoD && (
                <View style={styles.viewOpcoes}>
                  <View>
                      <TextInput
                      placeholder="Escreva aqui a alternativa D..."
                      style={{ 
                          height: 40,
                          width: 230,
                          backgroundColor: "white",
                          padding: 10,
                          borderRadius: 15,
                          // outlineStyle: 'none',
                      }}
                    />
                  </View>
                <Pressable style={styles.opcaoCorreta}>
                  <Icon source="check" size={20} color="black" />
                </Pressable>
                </View>
              )}
            </View>
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
    height: 400,
  },
  questionText: {
    backgroundColor: "white",
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
    width: "100%",
    height: "100%",
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
    height: 200,
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
  }
});
