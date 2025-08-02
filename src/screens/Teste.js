import React, { useRef } from "react";
import { View, PanResponder, Animated, StyleSheet } from "react-native";

const Teste = () => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
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

        // Definindo os limites do movimento
        const MIN_X = 0;
        const MAX_X = 300;
        const MIN_Y = 0;
        const MAX_Y = 500;

        // Limitando os valores dentro da faixa
        newX = Math.max(MIN_X, Math.min(newX, MAX_X));
        newY = Math.max(MIN_Y, Math.min(newY, MAX_Y));

        // Atualiza manualmente os valores animados
        pan.setValue({
          x: newX - pan.x._offset,
          y: newY - pan.y._offset,
        });
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.box, pan.getLayout()]}
      {...panResponder.panHandlers}
    />
  );
};

const styles = StyleSheet.create({
  box: {
    width: 100,
    height: 100,
    backgroundColor: "tomato",
    position: "absolute",
    borderRadius: 10,
  },
});

export default Teste;
