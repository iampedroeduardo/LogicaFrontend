import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from 'react-native-paper';

export default function Opcoes({
  opcoes,
  opcaoCerta,
  opcaoSelecionada,
  setOpcaoSelecionada,
  respondida,
}) {
  const styles = StyleSheet.create({
    opcoes: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      height: !opcaoSelecionada ? "40%" : "30%",
      marginTop: 10,
    },
    opcao: {
      width: "100%",
      height: 60,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 10
    },
    letter: {
        width: 60,
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    opcaoText: {
      fontSize: 18,
    },
  });
  return (
    <View style={styles.opcoes}>
      {opcoes.map((opcao, index) => {
        return (
          <LinearGradient
            colors={
              opcaoSelecionada && !respondida && opcaoSelecionada === index
                ? ["#BFECFF", "#6446DB"]
                : opcaoSelecionada && respondida && opcaoCerta === index
                ? ["#37FF0066", "#37FF0066"]
                : opcaoSelecionada &&
                  respondida &&
                  opcaoSelecionada === index &&
                  opcaoCerta !== index
                ? ["#FF000066", "#FF000066"]
                : ["#FFFFFF", "#FFFFFF"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.opcao}
            onPress={() => {
              setOpcaoSelecionada(index);
            }}
            key={index}
          >
            <LinearGradient colors={["#BFECFF", "#6446DB"]} start={{ x: 0, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.letter}>
            <Icon source={`alpha-${['a', 'b', 'c', 'd'][index]}`} size={30} color="black"/>
            </LinearGradient>
            <Text style={styles.opcaoText}>{opcao}</Text>
          </LinearGradient>
        );
      })}
    </View>
  );
}
