import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Icon } from "react-native-paper";

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
      height: "35%",
      marginTop: 10,
    },
    opcaoContainer: {
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
      marginBottom: 10,
    },
    opcao: {
      width: "100%",
      height: "100%",
      borderRadius: 20,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
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
      width: "80%"
    },
  });

  return (
    <View style={styles.opcoes}>
      {opcoes.map((opcao, index) => {
        const isSelecionada = opcaoSelecionada === index;
        const isCerta = opcaoCerta === index;

        return (
          <View style={styles.opcaoContainer} key={index}>
            <Pressable
              onPress={() => {
                if (respondida) return;
                setOpcaoSelecionada(index);
              }}
              style={styles.opcao}
            >
              <LinearGradient
                colors={
                  opcaoSelecionada != null && !respondida && isSelecionada
                    ? ["#cbeaf7ff", "#9d86faff"]
                    : opcaoSelecionada != null &&
                      respondida &&
                      isCerta
                    ? ["#8def72ff", "#8def72ff"]
                    : opcaoSelecionada != null &&
                      respondida &&
                      isSelecionada &&
                      !isCerta
                    ? ["#f06161ff", "#f06161ff"]
                    : ["#FFFFFF", "#FFFFFF"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.opcao}
              >
                <LinearGradient
                  colors={["#BFECFF", "#6446DB"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.letter}
                >
                  <Icon
                    source={`alpha-${["a", "b", "c", "d"][index]}`}
                    size={30}
                    color="black"
                  />
                </LinearGradient>
                <Text style={styles.opcaoText}>{opcao}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}