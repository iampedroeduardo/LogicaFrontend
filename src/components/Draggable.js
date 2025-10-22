import React, { useRef, useState, useMemo } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,

} from "react-native";


export default function Draggable({ lacuna, updateLacuna, width, height }) {
  const pan = useRef(
    new Animated.ValueXY({ x: lacuna.x || 50, y: lacuna.y || 350 }) // Posição inicial ajustada para a parte inferior do editor
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
          updateLacuna({
            ...lacuna,
            x: pan.x._value,
            y: pan.y._value,
          });
        },
      }),
    [lacuna, width, height]
  );
  return (
    <Animated.View
      style={[styles.draggable, pan.getLayout(), isDragging && { userSelect: "none", zIndex: 1000 }]}
      {...panResponder.panHandlers}
    >
      <Text style={styles.texto}>
        {lacuna.text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  texto: {
    fontSize: 17,
    color: "white",
    fontWeight: 'bold',
  },
  draggable: {
    position: "absolute",
    backgroundColor: "#6446DB",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,

  },
});
