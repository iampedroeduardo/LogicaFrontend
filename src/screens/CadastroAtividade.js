import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  Divider,
  Icon,
  Menu,
  Portal,
  Snackbar,
} from "react-native-paper";
import instance from "../axios.js";
import Logo from "../components/Logo.js";
import Window from "../components/Window.js";

const imagensPerfil = {
  preto_none: require("../../assets/images/perfil_preto_none.png"),
  preto_coroa: require("../../assets/images/perfil_preto_coroa.png"),
  preto_tiara: require("../../assets/images/perfil_preto_tiara.png"),
  preto_cartola: require("../../assets/images/perfil_preto_cartola.png"),
  preto_oculos: require("../../assets/images/perfil_preto_oculos.png"),
  preto_squirtle: require("../../assets/images/perfil_preto_squirtle.png"),
  preto_palhaco: require("../../assets/images/perfil_preto_palhaco.png"),
  amarelo_none: require("../../assets/images/perfil_amarelo_none.png"),
  amarelo_coroa: require("../../assets/images/perfil_amarelo_coroa.png"),
  amarelo_tiara: require("../../assets/images/perfil_amarelo_tiara.png"),
  amarelo_cartola: require("../../assets/images/perfil_amarelo_cartola.png"),
  amarelo_oculos: require("../../assets/images/perfil_amarelo_oculos.png"),
  amarelo_squirtle: require("../../assets/images/perfil_amarelo_squirtle.png"),
  amarelo_palhaco: require("../../assets/images/perfil_amarelo_palhaco.png"),
  azul_none: require("../../assets/images/perfil_azul_none.png"),
  azul_coroa: require("../../assets/images/perfil_azul_coroa.png"),
  azul_tiara: require("../../assets/images/perfil_azul_tiara.png"),
  azul_cartola: require("../../assets/images/perfil_azul_cartola.png"),
  azul_oculos: require("../../assets/images/perfil_azul_oculos.png"),
  azul_squirtle: require("../../assets/images/perfil_azul_squirtle.png"),
  azul_palhaco: require("../../assets/images/perfil_azul_palhaco.png"),
  rosa_none: require("../../assets/images/perfil_rosa_none.png"),
  rosa_coroa: require("../../assets/images/perfil_rosa_coroa.png"),
  rosa_tiara: require("../../assets/images/perfil_rosa_tiara.png"),
  rosa_cartola: require("../../assets/images/perfil_rosa_cartola.png"),
  rosa_oculos: require("../../assets/images/perfil_rosa_oculos.png"),
  rosa_squirtle: require("../../assets/images/perfil_rosa_squirtle.png"),
  rosa_palhaco: require("../../assets/images/perfil_rosa_palhaco.png"),
};

export default function CadastroAtividade({ navigation }) {
  const [visible, setVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [windows, setWindows] = useState([]);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { width, height } = useWindowDimensions();
  const [mensagem, setMensagem] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [ranks, setRanks] = useState([]);

  useEffect(() => {
    async function getUsuario() {
      const usuarioArmazenado = await AsyncStorage.getItem("usuario");
      if (usuarioArmazenado) {
        setUsuario(JSON.parse(usuarioArmazenado));
      }
    }
    getUsuario();
  }, []);

  useEffect(() => {
    async function fetchRanks() {
      if (usuario && usuario.token) {
        try {
          const { data } = await instance.get(`/atividades/ranks`, {
            headers: {
              Authorization: `Bearer ${usuario.token}`,
            },
          });
          setRanks(data);
        } catch (error) {
          console.error("Erro ao buscar ranks:", error);
          setMensagem("Erro ao carregar os ranks. Tente novamente.");
          setSnackbarVisible(true);
        }
      }
    }
    fetchRanks();
  }, [usuario]);

  async function getQuestions(status) {
    try {
      const { data } = await instance.get(
        `/atividades/listar/${status}`,
        {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
      setMensagem("Erro ao buscar as atividades. Tente novamente.");
      setSnackbarVisible(true);
      return [];
    }
  }

  async function deslogar() {
    await AsyncStorage.removeItem("usuario");
    closeMenu();
    navigation.navigate("PaginaInicial");
  }

  if (!usuario) {
    return null; // ou um componente de loading
  }

  function newWindow(type) {
    const windowWidth = 300;
    const windowHeight = 500;
    const margin = 20;
    const maxAttempts = 100;
    let attempts = 0;

    // Gera um ID único baseado no timestamp
    const newId = Date.now();

    // Posição inicial padrão
    let newX = margin;
    let newY = margin;
    let positionFound = windows.length === 0;

    // Tenta encontrar posição vazia
    while (!positionFound && attempts < maxAttempts) {
      attempts++;
      let hasCollision = false;

      for (const existingWindow of windows) {
        const existingX = existingWindow.x || margin;
        const existingY = existingWindow.y || margin;
        const existingHeight = existingWindow.closed ? 100 : 500;

        if (
          checkCollision(
            { x: newX, y: newY, width: windowWidth, height: windowHeight },
            {
              x: existingX,
              y: existingY,
              width: windowWidth,
              height: existingHeight,
            },
            margin
          )
        ) {
          hasCollision = true;
          break;
        }
      }

      if (!hasCollision) {
        positionFound = true;
      } else {
        // Padrão de posicionamento em espiral
        newX += windowWidth / 2;
        if (newX + windowWidth > width - margin) {
          newX = margin;
          newY += windowHeight / 2;
        }
        if (newY + windowHeight > height - margin) {
          newY = margin;
        }
      }
    }

    const newWindow = {
      id: newId,
      type,
      nome: getWindowTitle(type),
      descricao: "",
      script: "",
      errosLacuna: [],
      gabarito: "",
      pergunta: "",
      opcao1: "",
      opcao2: "",
      opcao3: "",
      opcao4: "",
      opcaoCorreta: "",
      x: newX,
      y: newY,
      closed: false,
      salvar: false,
      rankId: null,
      nivel: 0,
      categoria: "",
      tipo: "",
    };

    setWindows((prev) => [...prev, newWindow]);
  }

  // Funções auxiliares
  function checkCollision(rect1, rect2, padding = 0) {
    return (
      rect1.x < rect2.x + rect2.width + padding &&
      rect1.x + rect1.width + padding > rect2.x &&
      rect1.y < rect2.y + rect2.height + padding &&
      rect1.y + rect1.height + padding > rect2.y
    );
  }

  function getWindowTitle(type) {
    const titles = {
      codigo: "Algoritmo",
      multiplaEscolha: "Múltipla Escolha",
      minhasQuestoes: "Minhas Questões",
    };
    return titles[type] || "Nova Janela";
  }

  function updateWindow(updatedWindow) {
    setWindows((prevWindows) =>
      prevWindows.map((w) =>
        w.id === updatedWindow.id ? { ...w, ...updatedWindow } : w
      )
    );
  }

  async function salvar() {
    const windowsWrong = windows
      .map((window) => {
        if (
          (window.type === "multiplaEscolha" &&
            window.salvar &&
            (window.nome.trim().length === 0 ||
              window.pergunta.trim().length === 0 ||
              window.opcao1.trim().length === 0 ||
              window.opcao2.trim().length === 0 ||
              window.opcao3.trim().length === 0 ||
              window.opcao4.trim().length === 0 ||
              window.opcaoCorreta.length === 0 ||
              window.gabarito.trim().length === 0 ||
              window.descricao.trim().length === 0 ||
              window.categoria.trim().length === 0 ||
              ((window.tipo.trim().length === 0 ||
                window.rankId === null ||
                window.nivel === null) &&
                usuario.adm))) ||
          (window.type === "codigo" &&
            window.salvar &&
            (window.nome.trim().length === 0 ||
              window.descricao.trim().length === 0 ||
              window.script.trim().length === 0 ||
              window.errosLacuna.some(
                (x) => x.type === "error" && x.distratores.length === 0
              ) ||
              !(
                window.errosLacuna.filter((x) => x.type === "error").length >=
                  2 ||
                window.errosLacuna.filter((x) => x.type === "gap").length >= 2
              ) ||
              (window.rankId === null && usuario.adm)))
        ) {
          return window;
        }
      })
      .filter((x) => x !== undefined);
    if (windowsWrong.length > 0) {
      setSnackbarVisible(true);
      setMensagem(
        "Preencha todos os campos das questões: " +
          windowsWrong.map((x) => x.nome).join(", ") +
          "."
      );
      return;
    }
    instance
      .post(
        "/atividades/cadastro",
        { questoes: windows },
        {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
          },
        }
      )
      .then(async (response) => {
        setSnackbarVisible(true);
        setMensagem("Questões salvas com sucesso!");
        setWindows([]);
      })
      .catch((error) => {
        kjnkjxsnjkbmnbnmjkknjknkj;
        console.log(error);
        setSnackbarVisible(true);
        setMensagem("Erro ao salvar questões. Tente novamente.");
      });
  }

  const imagemKey = `${usuario.cor.toLowerCase()}_${usuario.acessorio.toLowerCase()}`;
  const imagemSource = imagensPerfil[imagemKey] || imagensPerfil["preto_none"];

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Logo
          ImagemEstilo={{ width: 40, height: 32 }}
          textoEstilo={{ fontSize: 22, color: "white" }}
        />
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          style={styles.menu}
          anchor={
            <Appbar.Action
              icon="account-circle"
              size={35}
              color="white"
              onPress={openMenu}
            />
          }
        >
          <Menu.Item
            contentStyle={{ justifyContent: "center" }}
            titleStyle={{ fontSize: 21 }}
            title="Perfil"
          />
          <Divider />
          <View style={styles.content}>
            <LinearGradient
              style={styles.caminho}
              colors={["#BFECFF", "#6446DB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            >
              {/* informações básicas do perfil */}
              <View style={{ width: 100, height: 105 }}>
                <Image source={imagemSource} style={styles.perfil} />
                <View style={{ position: "absolute", left: 35, top: 75 }}>
                  <Icon source="shield" size={30} color={usuario.rank.cor} />
                </View>
                <View style={{ position: "absolute", left: 35, top: 75 }}>
                  <Icon source="shield-outline" size={30} color="black" />
                </View>
                <Text
                  style={{ fontSize: 10, textAlign: "center", marginTop: -10 }}
                >
                  {"+".repeat(usuario.nivel)}
                </Text>
              </View>
              <View style={styles.caminhotext}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <Text style={styles.titulo}>{usuario.usuario}</Text>
                </View>
                <Text
                  style={{
                    ...styles.rankTexto,
                    backgroundColor: usuario.rank.cor,
                  }}
                >
                  {usuario.rank.nome + " " + "+".repeat(usuario.nivel)}
                </Text>
              </View>
            </LinearGradient>
          </View>
          <Button
            mode="elevated"
            textColor="black"
            buttonColor="#6446db"
            style={{ width: 100, alignSelf: "center", margin: 10 }}
            onPress={deslogar}
          >
            Sair
          </Button>
        </Menu>
      </Appbar.Header>
      <View style={styles.area}>
        {/* mascote e texto incial */}
        {windows.length === 0 ? (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/images/axolote_png.png")}
              style={styles.axolote}
            ></Image>
            <Text style={styles.bemvindoText}>
              {usuario.genero === "Feminino" ? "Bem vinda!" : "Bem vindo!"}
            </Text>
            <Text style={styles.bemvindoText}>
              Toda grande jornada começa com a primeira questão!
            </Text>
          </View>
        ) : (
          windows.map((window, index) => (
            <Window
              key={window.id}
              window={window}
              ranks={ranks}
              usuario={usuario}
              updateWindow={updateWindow}
              deleteWindow={() => {
                setWindows((prev) => prev.filter((w) => w.id !== window.id));
              }}
              getQuestions={getQuestions}
            />
          ))
        )}

        {/* botões de navegação */}
        <View style={styles.buttons}>
          <Pressable
            style={styles.button}
            onPress={() => {
              newWindow("codigo");
            }}
          >
            <View style={styles.iconButton}>
              <Icon source="code-braces" size={20} color="black" />
            </View>
            <Text>Novo Código</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              newWindow("multiplaEscolha");
            }}
          >
            <View style={styles.iconButton}>
              <Icon source="alphabetical" size={20} color="black" />
            </View>
            <Text>Múltipla Escolha</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              newWindow("minhasQuestoes");
            }}
          >
            <View style={styles.iconButton}>
              <Icon
                source="format-list-bulleted-square"
                size={20}
                color="black"
              />
            </View>
            <Text>Minhas Questões</Text>
          </Pressable>
          {windows.filter((x) => x.type !== "minhasQuestoes").length > 0 && (
            <Pressable
              style={styles.button}
              onPress={() => {
                setDialogVisible(true);
              }}
            >
              <View style={styles.iconButton}>
                <Icon source="check" size={20} color="black" />
              </View>
              <Text>Salvar</Text>
            </Pressable>
          )}
        </View>
      </View>
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={styles.dialog}
        >
          <View style={styles.dialogContent}>
            <View style={styles.dialogTitle}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Finalização
              </Text>
            </View>
            <View style={styles.dialogDescription}>
              <Text style={{ fontSize: 14 }}>
                Selecione as questões para enviar para avaliação, as demais
                serão salvas como rascunhos.
              </Text>
            </View>

            {/* Adicione ScrollView aqui */}
            <ScrollView
              style={styles.dialogQuestionsScroll}
              contentContainerStyle={styles.dialogQuestionsContent}
            >
              {windows
                .filter((x) => x.type !== "minhasQuestoes")
                .map((question) => (
                  <Pressable
                    key={question.id} // IMPORTANTE: Adicione key aqui
                    onPress={() => {
                      setWindows((prevWindows) =>
                        prevWindows.map((w) =>
                          w.id === question.id ? { ...w, salvar: !w.salvar } : w
                        )
                      );
                    }}
                    style={styles.dialogQuestion}
                  >
                    <Text style={{ fontSize: 14, marginRight: 10, flex: 1 }}>
                      {question.nome}
                    </Text>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderWidth: 2,
                        borderColor: "#6446db",
                        backgroundColor: question.salvar
                          ? "#6446db"
                          : "transparent",
                        borderRadius: 4,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {question.salvar && (
                        <Icon source="check" size={16} color="white" />
                      )}
                    </View>
                  </Pressable>
                ))}
            </ScrollView>

            <View style={styles.dialogButtons}>
              <Button
                mode="elevated"
                textColor="black"
                buttonColor="#BFECFF"
                style={{ minWidth: 100 }}
                onPress={() => setDialogVisible(false)}
              >
                Cancelar
              </Button>
              <Button
                mode="elevated"
                textColor="black"
                buttonColor="#6446db"
                style={{ minWidth: 100 }}
                onPress={() => {
                  setDialogVisible(false);
                  salvar();
                }}
              >
                Salvar
              </Button>
            </View>
          </View>
        </Dialog>
      </Portal>
      <Snackbar
        visible={snackbarVisible}
        duration={3000}
        onDismiss={() => {
          setSnackbarVisible(false);
        }}
      >
        {mensagem}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEEEE",
  },
  header: {
    backgroundColor: "#6446db",
    justifyContent: "space-between",
  },
  content: {
    padding: 20,
    alignItems: "center",
    width: 340,
  },
  area: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  caminho: {
    paddingLeft: 15,
    paddingRight: 12,
    flexDirection: "row",
    borderRadius: 15,
    width: "100%",
    height: 130,
    alignItems: "center",
    gap: 20,
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  caminhotext: {
    flexDirection: "column",
    gap: 8,
    flex: 1,
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 19,
  },
  perfil: {
    width: 90,
    height: 90,
  },
  rankTexto: {
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 3,
    width: "fit-content",
    fontSize: 15,
  },
  axolote: {
    width: 130,
    height: 108,
    marginBottom: 24,
  },
  bemvindoText: {
    fontSize: 16,
    color: "#4E4E4E",
    textAlign: "center",
    paddingHorizontal: 30,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    position: "fixed",
    bottom: 50,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconButton: {
    padding: 8,
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
  dialog: {
    backgroundColor: "#6446DB",
    alignSelf: "center",
    borderRadius: 15,
    width: "90%",
    maxWidth: 500,
    margin: 0, // Remove margens padrão
    padding: 0, // Remove padding padrão
  },
  dialogContent: {
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10, // Mantém a borda roxa visível
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dialogTitle: {
    padding: 8,
    backgroundColor: "#BFECFF",
    width: 100,
    alignItems: "center",
    margin: 8,
    borderRadius: 15,
    alignSelf: "flex-start", // Para não ocupar largura total
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dialogDescription: {
    padding: 15,
    paddingTop: 0, // Reduz padding superior
  },
  dialogQuestionsScroll: {
    maxHeight: 300, // Altura máxima para o scroll
  },
  dialogQuestionsContent: {
    paddingBottom: 10, // Espaço extra no final
  },
  dialogQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  dialogButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
    padding: 15,
    paddingTop: 10,
  },
});
