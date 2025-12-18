import { useMemo, useRef, useState } from "react";
import { Animated, PanResponder, StyleSheet, Text } from "react-native";

export default function Draggable({
  lacuna,
  updateLacuna,
  width,
  height,
  espacos,
  updateEspaco,
  setEspacoEmFoco,
}) {
  // Posição inicial (salva para voltar depois se necessário)
  const startPosition = useRef({
    x: lacuna.x || 50,
    y: lacuna.y || 350,
  }).current;

  const pan = useRef(
    new Animated.ValueXY({ x: startPosition.x, y: startPosition.y })
  ).current;

  const [isDragging, setIsDragging] = useState(false);

  // Função para verificar a interseção de dois retângulos com uma margem
  const checkProximity = (rect1, rect2, proximity = 20) => {
    // rect1: draggable, rect2: espaco
    return (
      rect1.x < rect2.x + rect2.width + proximity &&
      rect1.x + rect1.width > rect2.x - proximity &&
      rect1.y < rect2.y + rect2.height + proximity &&
      rect1.y + rect1.height > rect2.y - proximity
    );
  };

  const draggableWidth = lacuna.width || 100;
  const draggableHeight = lacuna.height || 30;

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
          // Atualiza a posição do draggable
          pan.setValue({ x: gestureState.dx, y: gestureState.dy });

          // Posição atual do draggable
          const currentDraggableRect = {
            x: pan.x._value + pan.x._offset,
            y: pan.y._value + pan.y._offset,
            width: draggableWidth,
            height: draggableHeight,
          };

          // Verifica proximidade com os espaços
          let espacoProximo = null;
          for (const espaco of espacos) {
            if (checkProximity(currentDraggableRect, espaco)) {
              espacoProximo = espaco;
              break;
            }
          }
          setEspacoEmFoco(espacoProximo ? espacoProximo.id : null);
        },

        onPanResponderRelease: () => {
          setIsDragging(false);
          pan.flattenOffset();
          setEspacoEmFoco(null); // Limpa o foco ao soltar

          // Posição final do draggable
          const finalDraggableRect = {
            x: pan.x._value,
            y: pan.y._value,
            width: draggableWidth,
            height: draggableHeight,
          };

          // Verifica se soltou próximo a algum espaço
          let espacoEncontrado = null;
          for (const espaco of espacos) {
            if (checkProximity(finalDraggableRect, espaco)) {
              espacoEncontrado = espaco;
              break;
            }
          }

          if (espacoEncontrado) {
            // Salva o chute no espaço
            updateEspaco({ ...espacoEncontrado, chute: lacuna });
            // Esconde o draggable
            updateLacuna({
              ...lacuna,
              visible: false,
            });
          } else { //volta pra opsição inicial 
            Animated.spring(pan, {
              toValue: { x: startPosition.x, y: startPosition.y },
              useNativeDriver: false,
            }).start();
          }
        },
      }),
    [lacuna, espacos] // Dependências otimizadas
  );

  return (
    <Animated.View
      style={[
        styles.draggable,
        pan.getLayout(),
        {
          width: draggableWidth,
          height: draggableHeight,
        },
        isDragging && styles.dragging,
        { display: lacuna.visible ? "flex" : "none" },
      ]}
      {...panResponder.panHandlers}
    >
      <Text style={styles.texto}>{lacuna.text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  texto: {
    fontSize: 17,
    color: "white",
    fontWeight: "bold",
  },
  draggable: {
    position: "absolute",
    backgroundColor: "#6446DB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  dragging: {
    zIndex: 1000,
    elevation: 10,
    opacity: 0.8,
    transform: [{ scale: 1.1 }],
  },
});
