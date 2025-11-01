import { useMemo, useRef, useState } from "react";
import { Animated, PanResponder, StyleSheet, Text } from "react-native";

export default function Draggable({
  lacuna,
  updateLacuna,
  width,
  height,
  espacos,
  updateEspaco,
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

          const MIN_X = 10;
          const MAX_X = width - 100;
          const MIN_Y = 10;
          const MAX_Y = height - 30;

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

          // Verifica se soltou dentro de algum espaço
          let espacoEncontrado = null;
          for (const espaco of espacos) {
            if (
              pan.x._value >= espaco.x &&
              pan.x._value <= espaco.x + espaco.width &&
              pan.y._value >= espaco.y &&
              pan.y._value <= espaco.y + espaco.height
            ) {
              espacoEncontrado = espaco;
              break;
            }
          }

          if (espacoEncontrado) {
            //salva o chute
            updateEspaco({ ...espacoEncontrado, chute: lacuna });
            // esconde
            updateLacuna({
              ...lacuna,
              x: startPosition.x,
              y: startPosition.y,
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
    [lacuna, width, height, espacos]
  );

  return (
    <Animated.View
      style={[
        styles.draggable,
        pan.getLayout(),
        isDragging && { zIndex: 1000 },
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
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
