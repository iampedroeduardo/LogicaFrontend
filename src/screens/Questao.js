import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Dialog, Icon, Portal } from "react-native-paper";
import instance from "../axios";
import Algoritmo from "../components/Algoritmo";
import Button from "../components/Button";
import DescricaoQuestao from "../components/DescricaoQuestao";
import Logo from "../components/Logo";
import Opcoes from "../components/Opcoes";

export default function Questao({ navigation, route }) {
  const { usuario, categoria } = route.params;
  const [usuarioAtual, setUsuarioAtual] = useState(usuario);
  const animatedXp = useRef(new Animated.Value(usuarioAtual.xp)).current;
  const [modo, setModo] = useState("questao");
  const [respondida, setRespondida] = useState(false);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [questao, setQuestao] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [subiuRank, setSubiuRank] = useState(false);
  const [subiuNivel, setSubiuNivel] = useState(false);
  const [subiuXp, setSubiuXp] = useState(false);
  const [desceuXp, setDesceuXp] = useState(false);
  const [naoTemQuestao, setNaoTemQuestao] = useState(false);
  const [espacos, setEspacos] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);
  async function trilha(isPrimeiraQuestao, isUltimaQuestao) {
    try {
      const response = await instance.post(
        "/atividades/trilha",
        {
          isPrimeiraQuestao,
          isUltimaQuestao,
          categoria,
          questao: !isPrimeiraQuestao
            ? questao.tipo === "multiplaEscolha"
              ? {
                  id: questao.id,
                  opcao: questao.opcoes[opcaoSelecionada],
                  rankId: questao.rankId,
                  nivel: questao.nivel,
                  tipo: questao.tipo,
                  opcaoCerta: questao.opcoes[questao.opcaoCerta],
                }
              : {
                  id: questao.id,
                  tipo: questao.tipo,
                  tipoErroLacuna: questao.tipoErroLacuna,
                  acertou:
                    questao.tipoErroLacuna === "Erro" 
                      ? opcaoSelecionada.id === questao.espacoErrado.id
                      : espacos.every((lacuna) => lacuna.chute && lacuna.chute.id === lacuna.id),
                  espacoErrado:
                    questao.tipoErroLacuna === "Erro"
                      ? questao.espacoErrado
                      : null,
                  lacunas:
                    questao.tipoErroLacuna === "Lacuna"
                      ? questao.lacunas
                      : null,
                  nivel: questao.nivel,
                  rankId: questao.rankId,
                }
            : null,
        },
        {
          headers: {
            Authorization: `Bearer ${usuarioAtual.token}`,
          },
        }
      );
      if (!isUltimaQuestao) {
        if (response.data === null) {
          setNaoTemQuestao(true);
          if (!isPrimeiraQuestao) {
            const [subiuRank, subiuNivel, subiuXp, desceuXp, diferencaXp] =
              await atualizarDados(true);
            setMensagem(
              (subiuRank
                ? "Parabéns! Você subiu de Rank! 🎉"
                : subiuNivel
                ? "Parabéns! Você subiu de nível! 🎉"
                : subiuXp
                ? "Olha só! Você ganhou " + diferencaXp + " de xp. 📈"
                : "Oops! Você perdeu " + diferencaXp + " de xp. 📉") +
                "\n\n Infelizmente não existem questões disponíveis no momento. 😪"
            );
          } else {
            setMensagem(
              "Infelizmente não existem questões disponíveis no momento. 😪"
            );
          }
          setLoading(false);
          return;
        }
        setQuestao(response.data);
        setOpcaoSelecionada(null);
        setRespondida(false);
      }
      setLoading(false);
      return;
    } catch (error) {
      console.log(error);
    }
  }
  async function atualizarDados(semQuestoes) {
    try {
      const response = await instance.get("/atualizar-dados", {
        headers: {
          Authorization: `Bearer ${usuarioAtual.token}`,
        },
      });

      let mudouRank = false,
        mudouNivel = false,
        ganhouXp = false,
        perdeuXp = false;
      if (response.data.rank.id !== usuarioAtual.rank.id) {
        mudouRank = true;
        setSubiuRank(mudouRank);
        setSubiuNivel(false);
        setSubiuXp(false);
        setDesceuXp(false);
        animatedXp.setValue(0); // Reseta a barra de XP para o início
      } else if (response.data.nivel !== usuarioAtual.nivel) {
        mudouNivel = true;
        setSubiuRank(false);
        setSubiuNivel(mudouNivel);
        setSubiuXp(false);
        setDesceuXp(false);
        animatedXp.setValue(0); // Reseta a barra de XP para o início
      } else if (response.data.xp !== usuarioAtual.xp) {
        ganhouXp = response.data.xp > usuarioAtual.xp;
        perdeuXp = !ganhouXp;
        setSubiuRank(false);
        setSubiuNivel(false);
        setSubiuXp(ganhouXp);
        setDesceuXp(perdeuXp);
      }
      await AsyncStorage.setItem("usuario", JSON.stringify(response.data));
      if (mudouRank || mudouNivel || ganhouXp || perdeuXp) {
        setUsuarioAtual(response.data);
        if (semQuestoes) {
          return [
            mudouRank,
            mudouNivel,
            ganhouXp,
            perdeuXp,
            response.data.xp - usuario.xp,
          ];
        }
        setDialogVisible(true);
      } else {
        navigation.goBack();
      }
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
        toValue: usuarioAtual.xp,
        duration: 1000, // 1 segundo
        useNativeDriver: false, // não pode ser true porque estamos animando "width"
      }).start();
    }
  }, [dialogVisible]);
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6446db" />
      </View>
    );
  } else if (naoTemQuestao) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Logo cor="#6446db"/>
          <Pressable
            style={styles.xButton}
            onPress={async () => {
              navigation.goBack();
            }}
          >
            <View style={styles.xInsideButton}>
              <Icon source="close" size={24} color="black" />
            </View>
          </Pressable>
        </View>
        <View style={styles.viewSemQuestoes}>
          <Image
            source={require("../../assets/images/axolote_png.png")}
            style={styles.axolote}
          ></Image>
          <Text style={styles.semQuestaoText}>{mensagem}</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo cor="#6446db"/>
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
      {questao.tipo === "multiplaEscolha" ? (
        <Opcoes
          opcoes={questao.opcoes}
          opcaoCerta={questao.opcaoCerta}
          opcaoSelecionada={opcaoSelecionada}
          setOpcaoSelecionada={setOpcaoSelecionada}
          respondida={respondida}
        />
      ) : (
        <Algoritmo
          questao={questao}
          opcaoSelecionada={opcaoSelecionada}
          setOpcaoSelecionada={setOpcaoSelecionada}
          respondida={respondida}
          setEspacos={setEspacos}
          espacos={espacos}
        />
      )}
      {(opcaoSelecionada !== null ||
        (espacos.filter((x) => x.chute === null).length === 0 &&
          questao.tipoErroLacuna === "Lacuna")) &&
        (respondida ? (
          <View style={styles.buttons}>
            {(questao.tipo === "multiplaEscolha" || // Para múltipla escolha, sempre mostra
              (questao.tipoErroLacuna === "Lacuna" &&
                espacos.some((x) => x.chute.id !== x.id))) && ( // Para lacuna, sempre mostra
              <Button
                key="gabarito-btn"
                texto={modo === "gabarito" ? "Questão" : "Gabarito"}
                onPress={() => {
                  setModo(modo === "gabarito" ? "questao" : "gabarito");
                }}
              />
            )}
            <Button
              key="proxima-btn"
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
          onDismiss={() => {
            setDialogVisible(false);
            navigation.goBack();
          }}
          style={styles.dialog}
        >
          <View style={styles.dialogContent}>
            {subiuRank ? (
              <Text style={styles.dialogText}>
                Parabéns! Você subiu de Rank e ganhou {usuarioAtual.rank.id === 2 ? "novas cores para seu avatar" : "novos acessórios para seu avatar"}! 🎉
              </Text>
            ) : subiuNivel ? (
              <Text style={styles.dialogText}>
                Parabéns! Você subiu de nível 🎉
              </Text>
            ) : subiuXp ? (
              <Text style={styles.dialogText}>
                Olha só! Você ganhou {usuarioAtual.xp - usuario.xp} 📈 de xp{" "}
              </Text>
            ) : (
              desceuXp && (
                <Text style={styles.dialogText}>
                  Oops! Você perdeu {usuario.xp - usuarioAtual.xp} de xp 📉
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
                  <Icon
                    source="shield"
                    size={80}
                    color={usuarioAtual.rank.cor}
                  />
                </View>
                <View style={{ position: "absolute", left: 0, top: 0 }}>
                  <Icon source="shield-outline" size={80} color="black" />
                </View>
                <Text
                  style={{ fontSize: 15, textAlign: "center", marginTop: 15 }}
                >
                  {"+".repeat(usuarioAtual.nivel)}
                </Text>
              </View>
              <Icon source="arrow-right" size={25} color="black" />
              <View style={{ width: 80, height: 80 }}>
                <View style={{ position: "absolute", left: 0, top: 0 }}>
                  <Icon
                    source="shield"
                    size={80}
                    color={
                      usuarioAtual.nivel == 2
                        ? usuarioAtual.proximoRank.cor
                        : usuarioAtual.rank.cor
                    }
                  />
                </View>
                <View style={{ position: "absolute", left: 0, top: 0 }}>
                  <Icon source="shield-outline" size={80} color="black" />
                </View>
                <Text
                  style={{ fontSize: 20, textAlign: "center", marginTop: 15 }}
                >
                  {"+".repeat(
                    usuarioAtual.nivel == 2 ? 0 : usuarioAtual.nivel + 1
                  )}
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
  viewSemQuestoes: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    height: "80%",
    gap: 8,
  },
  axolote: {
    width: 100,
    height: 78,
  },
  semQuestaoText: {
    fontSize: 16,
    color: "#4E4E4E",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
