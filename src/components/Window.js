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
  const [aberto, setAberto] = useState(false);

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
            x: pan.x._value + (window.x || 0),
            y: pan.y._value + (window.y || 0),
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
                onPress={
                  aberto
                    ? () => {
                        setAberto(aberto);
                      }
                    : () => {
                        setAberto(!aberto);
                      }
                }
              >
                <Icon source="pen" size={20} color="black" />
              </Pressable>
              {aberto && (
                <View style={styles.viewDesc}>
                  <TextInput style={{ width: 100 }}></TextInput>
                </View>
              )}
            </View>
            <View style={styles.popupView}>
              <View style={styles.popupIcon}>
                <Icon source="alert" size={20} color="black" />
              </View>
            </View>
            <View style={styles.popupView}>
              <View style={styles.popupIcon}>
                <Icon source="format-quote-close" size={20} color="black" />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.questionPopups}>
            <View style={styles.popupView}>
              <View style={styles.popupIcon}>
                <Icon source="alpha-a" size={20} color="black" />
              </View>
            </View>
            <View style={styles.popupView}>
              <View style={styles.popupIcon}>
                <Icon source="alpha-b" size={20} color="black" />
              </View>
            </View>
            <View style={styles.popupView}>
              <View style={styles.popupIcon}>
                <Icon source="alpha-c" size={20} color="black" />
              </View>
            </View>
            <View style={styles.popupView}>
              <View style={styles.popupIcon}>
                <Icon source="alpha-d" size={20} color="black" />
              </View>
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
    elevation: 5,
  },
  viewDesc: {
    backgroundColor: "black"
  }
});
