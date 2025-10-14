import { useRef, useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Animated,
} from "react-native";
import { Icon, Dialog, Portal } from "react-native-paper";
import Button from "../components/Button";
import DescricaoQuestao from "../components/DescricaoQuestao";
import Logo from "../components/Logo";
import Opcoes from "../components/Opcoes";
import instance from "../axios";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Questao({ navigation, route }) {
  const { usuario } = route.params;
  const [usuarioState, setUsuario] = useState(usuario);
  const animatedXp = useRef(new Animated.Value(0)).current;
  const [modo, setModo] = useState("questao");
  const [respondida, setRespondida] = useState(false);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [questao, setQuestao] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [subiuRank, setSubiuRank] = useState(false);
  const [subiuNivel, setSubiuNivel] = useState(false);
  const [subiuXp, setSubiuXp] = useState(false);
  const [desceuXp, setDesceuXp] = useState(false);
  const [xpDiferenca, setXpDiferenca] = useState(0);
  async function trilha(isPrimeiraQuestao, isUltimaQuestao) {
    try {
      const response = await instance.post(
        "/atividades/trilha",
        {
          isPrimeiraQuestao,
          isUltimaQuestao,
          questao: !isPrimeiraQuestao
            ? {
                id: questao.id,
                opcao: questao.opcoes[opcaoSelecionada],
                rankId: questao.rankId,
                nivel: questao.nivel,
                tipo: questao.tipo,
                opcaoCerta: questao.opcoes[questao.opcaoCerta],
              }
            : null,
        },
        {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
          },
        }
      );
      if (!isUltimaQuestao) {
        setQuestao(response.data);
      }
      setOpcaoSelecionada(null);
      setRespondida(false);
    } catch (error) {
      console.log(error);
    }
  }
  async function atualizarDados() {
    try {
      const response = await instance.get("/atualizar-dados", {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
        },
      });
      console.log(response);
      console.log(usuario)
      if (response.rankId !== usuario.rankId) {
        setSubiuRank(true);
        setSubiuNivel(false);
        setSubiuXp(false);
        setDesceuXp(false);
        setXpDiferenca(response.xp);
      } else if (response.nivel !== usuario.nivel) {
        setSubiuRank(false);
        setSubiuNivel(true);
        setSubiuXp(false);
        setDesceuXp(false);
        setXpDiferenca(response.xp);
      } else if (response.xp !== usuario.xp) {
        setSubiuRank(false);
        setSubiuNivel(false);
        setSubiuXp(response.xp > usuario.xp);
        setDesceuXp(response.xp <= usuario.xp);
        setXpDiferenca(
          response.xp > usuario.xp
            ? response.xp - usuario.xp
            : usuario.xp - response.xp
        );
      }
      setDialogVisible(true);
      await AsyncStorage.setItem("usuario", JSON.stringify(response));
      setUsuario(response);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    trilha(true, false, null);
  }, []);
  useEffect(() => {
    if (dialogVisible) {
      Animated.timing(animatedXp, {
        toValue: usuario.xp + xpDiferenca,
        duration: 1000, // 1 segundo
        useNativeDriver: false, // não pode ser true porque estamos animando "width"
      }).start();
    }
  }, [dialogVisible]);
  if (!questao) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6446db" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo />
        <Pressable
          style={styles.xButton}
          onPress={async () => {
            if (respondida) {
              await trilha(false, true);
            }
            await atualizarDados();
          }}
        >
          <View style={styles.xInsideButton}>
            <Icon source="close" size={24} color="black" />
          </View>
        </Pressable>
      </View>
      <DescricaoQuestao questao={questao} modo={modo} />
      {questao.tipo === "multiplaEscolha" && (
        <Opcoes
          opcoes={questao.opcoes}
          opcaoCerta={questao.opcaoCerta}
          opcaoSelecionada={opcaoSelecionada}
          setOpcaoSelecionada={setOpcaoSelecionada}
          respondida={respondida}
        />
      )}
      {opcaoSelecionada !== null &&
        (respondida ? (
          <View style={styles.buttons}>
            <Button
              texto={modo === "gabarito" ? "Questão" : "Gabarito"}
              onPress={() => {
                setModo(modo === "gabarito" ? "questao" : "gabarito");
              }}
            />
            <Button
              texto="Próxima"
              onPress={() => {
                trilha(false, false);
              }}
            />
          </View>
        ) : (
          <View style={styles.buttons}>
            <Button
              texto="Verificar"
              onPress={() => {
                setRespondida(true);
              }}
            />
          </View>
        ))}
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={styles.dialog}
        >
          <View style={styles.dialogContent}>
            {subiuRank ? (
              <Text style={styles.dialogText}>
                Parabéns! Você subiu de Rank! 🎉
              </Text>
            ) : subiuNivel ? (
              <Text style={styles.dialogText}>
                Parabéns! Você subiu de nível 🎉
              </Text>
            ) : subiuXp ? (
              <Text style={styles.dialogText}>
                Olha só! Você ganhou {xpDiferenca} 📈 de xp{" "}
              </Text>
            ) : (
              desceuXp && (
                <Text style={styles.dialogText}>
                  Oops! Você perdeu {xpDiferenca} de xp 📉
                </Text>
              )
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
              }}
            >
              <View style={{ width: 80, height: 80 }}>
                <View style={{ position: "absolute", left: 0, top: 0 }}>
                  <Icon source="shield" size={80} color={usuario.rank.cor} />
                </View>
                <View style={{ position: "absolute", left: 0, top: 0 }}>
                  <Icon source="shield-outline" size={80} color="black" />
                </View>
                <Text
                  style={{ fontSize: 15, textAlign: "center", marginTop: 15 }}
                >
                  {"+".repeat(usuario.nivel)}
                </Text>
              </View>
              <Icon source="arrow-right" size={25} color="black" />
              <View style={{ width: 80, height: 80 }}>
                <View style={{ position: "absolute", left: 0, top: 0 }}>
                  <Icon
                    source="shield"
                    size={80}
                    color={
                      usuario.nivel == 2
                        ? usuario.proximoRank.cor
                        : usuario.rank.cor
                    }
                  />
                </View>
                <View style={{ position: "absolute", left: 0, top: 0 }}>
                  <Icon source="shield-outline" size={80} color="black" />
                </View>
                <Text
                  style={{ fontSize: 20, textAlign: "center", marginTop: 15 }}
                >
                  {"+".repeat(usuario.nivel == 2 ? 0 : usuario.nivel + 1)}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "90%",
                height: 20,
                backgroundColor: "#eee",
                borderRadius: 50,
                padding: 5,
              }}
            >
              <Animated.View
                style={{
                  width: animatedXp.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                  height: 10,
                  borderRadius: 50,
                  overflow: "hidden",
                }}
              >
                <LinearGradient
                  colors={["#BFECFF", "#6446DB"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={{ flex: 1 }}
                />
              </Animated.View>
            </View>
          </View>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
    backgroundColor: "#EEEEEE",
    display: "flex",
    gap: 15,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  xButton: {
    width: 50,
    height: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 15,
    padding: 5,
    backgroundColor: "#bfecff",
  },
  xInsideButton: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: 25,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    backgroundColor: "#6446DB",
    alignSelf: "center",
    justifyContent: "center",
    // alignItems: "center",
    borderRadius: 15,
    width: 280,
    height: 280,
    paddingHorizontal: 10,
    paddingBottom: 25,
  },
  dialogContent: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    borderRadius: 15,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dialogText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});
