import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Animated,
  Pressable,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button, HelperText, Icon, Portal, Dialog } from "react-native-paper";
import instance from "../axios.js";
import Logo from "../components/Logo.js";

const imagensPerfil = {
  preto_none: require("../../assets/images/perfil_preto_none.png"),
  preto_bone: require("../../assets/images/perfil_preto_bone.png"),
  preto_coroa: require("../../assets/images/perfil_preto_coroa.png"),
  preto_tiara: require("../../assets/images/perfil_preto_tiara.png"),
  preto_cartola: require("../../assets/images/perfil_preto_cartola.png"),
  preto_oculos: require("../../assets/images/perfil_preto_oculos.png"),
  preto_squirtle: require("../../assets/images/perfil_preto_squirtle.png"),
  preto_palhaco: require("../../assets/images/perfil_preto_palhaco.png"),
  amarelo_none: require("../../assets/images/perfil_amarelo_none.png"),
  amarelo_bone: require("../../assets/images/perfil_amarelo_bone.png"),
  amarelo_coroa: require("../../assets/images/perfil_amarelo_coroa.png"),
  amarelo_tiara: require("../../assets/images/perfil_amarelo_tiara.png"),
  amarelo_cartola: require("../../assets/images/perfil_amarelo_cartola.png"),
  amarelo_oculos: require("../../assets/images/perfil_amarelo_oculos.png"),
  amarelo_squirtle: require("../../assets/images/perfil_amarelo_squirtle.png"),
  amarelo_palhaco: require("../../assets/images/perfil_amarelo_palhaco.png"),
  azul_none: require("../../assets/images/perfil_azul_none.png"),
  azul_bone: require("../../assets/images/perfil_azul_bone.png"),
  azul_coroa: require("../../assets/images/perfil_azul_coroa.png"),
  azul_tiara: require("../../assets/images/perfil_azul_tiara.png"),
  azul_cartola: require("../../assets/images/perfil_azul_cartola.png"),
  azul_oculos: require("../../assets/images/perfil_azul_oculos.png"),
  azul_squirtle: require("../../assets/images/perfil_azul_squirtle.png"),
  azul_palhaco: require("../../assets/images/perfil_azul_palhaco.png"),
  rosa_none: require("../../assets/images/perfil_rosa_none.png"),
  rosa_bone: require("../../assets/images/perfil_rosa_bone.png"),
  rosa_coroa: require("../../assets/images/perfil_rosa_coroa.png"),
  rosa_tiara: require("../../assets/images/perfil_rosa_tiara.png"),
  rosa_cartola: require("../../assets/images/perfil_rosa_cartola.png"),
  rosa_oculos: require("../../assets/images/perfil_rosa_oculos.png"),
  rosa_squirtle: require("../../assets/images/perfil_rosa_squirtle.png"),
  rosa_palhaco: require("../../assets/images/perfil_rosa_palhaco.png"),
};

export default function Cadastro({ navigation }) {
  async function cadastrarUsuario() {
    setHelperGenero(true);
    if (!hasErrors()) {
      const dataNascimento = new Date(Number(ano), Number(mes), Number(dia));
      instance
        .post("/cadastro", {
          nome: nome.trim(),
          usuario: usuario.trim(),
          genero,
          dataNascimento,
          email: email.trim(),
          senha: senha,
          tipo: tipo,
        })
        .then(async (response) => {
          navigation.navigate("PaginaInicial")
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  async function editarUsuario() {
    setHelperGenero(true);
    if (!hasErrors()) {
      const dataNascimento = new Date(Number(ano), Number(mes), Number(dia));
      instance
        .put("/editar", {
          id: usuarioArmazenado.id,
          nome: nome.trim(),
          usuario: usuario.trim(),
          genero,
          dataNascimento,
          email: email.trim(),
          tipo: tipo,
          cor: cor,
          acessorio: acessorio,
        })
        .then(async (response) => {
          await AsyncStorage.setItem("usuario", JSON.stringify(response.data));
          navigation.navigate("Home");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  const hasErrorsTexto = (text) => {
    return text.trim().length < 3;
  };

  const hasErrorsEmail = () => {
    return !email.includes("@") || email.trim().length < 10;
  };

  const hasErrorsDataDeNascimento = () => {
    return (
      Number(ano) < 1900 ||
      Number(ano) > new Date().getFullYear() ||
      Number(mes) < 1 ||
      Number(mes) > 12 ||
      Number(dia) < 1 ||
      (Number(dia) > 31 && [1, 3, 5, 7, 8, 10, 12].includes(Number(mes))) ||
      ([4, 6, 9, 11].includes(Number(mes)) && Number(dia) > 30) ||
      (Number(dia) > 29 && Number(mes) === 2)
    );
  };

  const hasErrorsGenero = () => {
    return genero == null;
  };

  const hasErrorsSenha = () => {
    return (
      senha.match(/[0-9]/g) == null ||
      senha.match(/[A-Z]/g) == null ||
      senha.match(/[a-z]/g) == null ||
      senha.match(/[\W|_]/g) == null ||
      senha.length < 8
    );
  };

  const hasErrorsConfirmarSenha = () => {
    return senha != confirmaSenha;
  };

  const hasErrorsTipo = () => {
    return tipo == null;
  };

  const hasErrors = () => {
    if (usuarioArmazenado) {
      return (
        hasErrorsTexto(nome) ||
        hasErrorsEmail() ||
        hasErrorsTexto(usuario) ||
        hasErrorsDataDeNascimento() ||
        hasErrorsGenero()
      );
    }
    return (
      hasErrorsTexto(nome) ||
      hasErrorsEmail() ||
      hasErrorsTexto(usuario) ||
      hasErrorsDataDeNascimento() ||
      hasErrorsSenha() ||
      hasErrorsConfirmarSenha() ||
      hasErrorsGenero() ||
      hasErrorsTipo()
    );
  };
  const route = useRoute();
  let usuarioArmazenado = null;
  if (route.params) {
    usuarioArmazenado = route.params.usuarioArmazenado;
  }
  const [openGenero, setOpenGenero] = useState(false);
  const [cor, setCor] = useState(
    usuarioArmazenado ? usuarioArmazenado.cor : "preto"
  );
  const [acessorio, setAcessorio] = useState(
    usuarioArmazenado ? usuarioArmazenado.acessorio : "none"
  );
  const [imagemKey, setImagemKey] = useState(
    `${cor.toLowerCase()}_${acessorio.toLowerCase()}`
  );
  const [imagemSource, setImagemSource] = useState(
    imagensPerfil[imagemKey] || imagensPerfil["preto_none"]
  );
  const [dialogVisible, setDialogVisible] = useState(false);
  const [genero, setGenero] = useState(
    usuarioArmazenado ? usuarioArmazenado.genero : null
  );
  const [generos, setGeneros] = useState([
    { label: "Masculino", value: "Masculino" },
    { label: "Feminino", value: "Feminino" },
    { label: "Outro", value: "Outro" },
  ]);
  const [openTipo, setOpenTipo] = useState(false);
  const [tipo, setTipo] = useState(
    usuarioArmazenado ? usuarioArmazenado.tipo : null
  ); // State for the selected value
  const [tipos, setTipos] = useState([
    { label: "Programação", value: "Programacao" },
    { label: "Raciocínio Lógico", value: "RaciocinioLogico" },
  ]);
  const [nome, setNome] = useState(
    usuarioArmazenado ? usuarioArmazenado.nome : ""
  );
  const [email, setEmail] = useState(
    usuarioArmazenado ? usuarioArmazenado.email : ""
  );
  const [usuario, setUsuario] = useState(
    usuarioArmazenado ? usuarioArmazenado.usuario : ""
  );
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [dia, setDia] = useState(
    usuarioArmazenado
      ? new Date(usuarioArmazenado.nascimento).getDate().toString()
      : ""
  );
  const [mes, setMes] = useState(
    usuarioArmazenado
      ? new Date(usuarioArmazenado.nascimento).getMonth().toString()
      : ""
  );
  const [ano, setAno] = useState(
    usuarioArmazenado
      ? new Date(usuarioArmazenado.nascimento).getFullYear().toString()
      : ""
  );
  const [helperEmail, setHelperEmail] = useState(false);
  const [helperNome, setHelperNome] = useState(false);
  const [helperUsuario, setHelperUsuario] = useState(false);
  const [helperSenha, setHelperSenha] = useState(false);
  const [helperConfirmarSenha, setHelperConfirmarSenha] = useState(false);
  const [helperDataDeNascimento, setHelperDataDeNascimento] = useState(false);
  const [helperGenero, setHelperGenero] = useState(false);
  const [helperTipo, setHelperTipo] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  return (
    <View style={styles.container}>
      <Logo />
      <View style={{ flex: 1, marginHorizontal: 20, marginTop: 20 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 130 : 130}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {usuarioArmazenado ? (
              <Pressable
                style={styles.avatarContainer}
                onPress={() => {
                  setDialogVisible(true);
                }}
              >
                <View>
                  <Text style={{ alignSelf: "center", fontSize: 19 }}>
                    Avatar
                  </Text>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#000",
                      width: 50,
                      alignSelf: "center",
                      marginVertical: 5,
                    }}
                  />
                </View>

                <View style={{ width: 100, height: 105 }}>
                  <Image source={imagemSource} style={styles.perfil} />
                  <View style={{ position: "absolute", left: 65, top: 65 }}>
                    <Icon
                      source="square-edit-outline"
                      size={30}
                      color="black"
                    />
                  </View>
                </View>
              </Pressable>
            ) : (
              <></>
            )}
            <Text style={{ alignSelf: "center", fontSize: 19 }}>
              Dados Pessoais
            </Text>
            <View
              style={{
                height: 1,
                backgroundColor: "#000",
                width: 100,
                alignSelf: "center",
                marginVertical: 5,
              }}
            />
            <Text style={styles.label}>Nome:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                setNome(text);
                setHelperNome(true);
              }}
              value={nome}
            ></TextInput>
            <HelperText
              style={styles.helper}
              type="error"
              visible={hasErrorsTexto(nome) && helperNome}
            >
              Preencha seu nome
            </HelperText>
            <Text style={styles.label}>Data de Nascimento:</Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TextInput
                style={{ ...styles.input, width: 50, textAlign: "center" }}
                placeholder="DD"
                onChangeText={(text) => {
                  setHelperDataDeNascimento(true);
                  setDia(text);
                }}
                value={dia}
              ></TextInput>

              <TextInput
                style={{ ...styles.input, width: 50, textAlign: "center" }}
                placeholder="MM"
                onChangeText={(text) => {
                  setHelperDataDeNascimento(true);
                  setMes(text);
                }}
                value={mes}
              ></TextInput>

              <TextInput
                style={{ ...styles.input, width: 80, textAlign: "center" }}
                placeholder="AAAA"
                onChangeText={(text) => {
                  setHelperDataDeNascimento(true);
                  setAno(text);
                }}
                value={ano}
              ></TextInput>
            </View>
            <HelperText
              style={styles.helper}
              type="error"
              visible={hasErrorsDataDeNascimento() && helperDataDeNascimento}
            >
              Preencha uma data de nascimento válida
            </HelperText>
            <Text style={styles.label}>Gênero:</Text>
            <DropDownPicker
              style={styles.input}
              open={openGenero}
              value={genero}
              items={generos}
              setOpen={setOpenGenero}
              setValue={setGenero}
              setItems={setGeneros}
              placeholder="Selecionar"
              listMode="SCROLLVIEW"
              dropDownDirection="BOTTOM"
              dropDownContainerStyle={{
                backgroundColor: "none",
                borderWidth: 0,
                borderRadius: 20,
                width: 300,
                marginHorizontal: 5,
              }}
              // Estilo de cada item da lista
              listItemContainerStyle={{
                backgroundColor: "none",
                borderWidth: 0,
                borderRadius: 20,
                width: 300,
                height: 45,
              }}
              // Estilo do texto de cada item
              listItemLabelStyle={{
                color: "#333",
                fontSize: 14,
              }}
              selectedItemLabelStyle={{
                color: "#6200ee",
                fontWeight: "bold",
              }}
              // Estilo do placeholder
              placeholderStyle={{
                color: "grey",
              }}
              // Estilo da seta
              arrowIconStyle={{
                tintColor: "#6200ee",
              }}
            />
            <HelperText
              style={styles.helper}
              type="error"
              visible={hasErrorsGenero() && helperGenero}
            >
              Preencha um gênero
            </HelperText>
            <Text style={{ alignSelf: "center", fontSize: 19, marginTop: 20 }}>
              Dados Cadastrais
            </Text>
            <View
              style={{
                height: 1,
                backgroundColor: "#000",
                width: 100,
                alignSelf: "center",
                marginVertical: 5,
              }}
            />
            <Text style={styles.label}>Email:</Text>

            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                setEmail(text);
                setHelperEmail(true);
              }}
              value={email}
            ></TextInput>

            <HelperText
              style={styles.helper}
              type="error"
              visible={hasErrorsEmail() && helperEmail}
            >
              Preencha um endereço de email válido
            </HelperText>
            <Text style={styles.label}>Usuário:</Text>

            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                setUsuario(text);
                setHelperUsuario(true);
              }}
              value={usuario}
            ></TextInput>

            <HelperText
              style={styles.helper}
              type="error"
              visible={hasErrorsTexto(usuario) && helperUsuario}
            >
              Preencha um nome de usuário válido
            </HelperText>

            {!usuarioArmazenado && (
              <View>
                <Text style={styles.label}>Senha:</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                      setSenha(text);
                      setHelperSenha(true);
                    }}
                    secureTextEntry={!showSenha}
                  ></TextInput>
                  <TouchableOpacity
                    onPress={() => setShowSenha(!showSenha)}
                    style={{ marginLeft: -50 }}
                  >
                    <Ionicons
                      name={showSenha ? "eye" : "eye-off"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
                <HelperText
                  style={styles.helper}
                  type="error"
                  visible={hasErrorsSenha() && helperSenha}
                >
                  {!hasErrorsSenha() || !helperSenha
                    ? " "
                    : "A senha precisa conter:\n • 8 caracteres\n • 1 letra maiúscula\n • 1 número\n • 1 caractere especia"}
                  l
                </HelperText>
                <Text style={styles.label}>Confirmar Senha:</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                      setConfirmaSenha(text);
                      setHelperConfirmarSenha(true);
                    }}
                    secureTextEntry={!showConfirmarSenha}
                  ></TextInput>
                  <TouchableOpacity
                    onPress={() => setShowConfirmarSenha(!showConfirmarSenha)}
                    style={{ marginLeft: -50 }}
                  >
                    <Ionicons
                      name={showConfirmarSenha ? "eye" : "eye-off"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
                <HelperText
                  style={styles.helper}
                  type="error"
                  visible={hasErrorsConfirmarSenha() && helperConfirmarSenha}
                >
                  A senha não é igual
                </HelperText>
              </View>
            )}
            {!usuarioArmazenado && (
              <>
                <DropDownPicker
                  style={{...styles.input, marginBottom: tipo && tipo.length > 0 ? 0 : 30}}
                  open={openTipo}
                  value={tipo}
                  items={tipos}
                  setOpen={setOpenTipo}
                  setValue={setTipo}
                  setItems={setTipos}
                  placeholder="Selecionar"
                  listMode="SCROLLVIEW"
                  dropDownDirection="BOTTOM"
                  disabled={!!usuarioArmazenado}
                  dropDownContainerStyle={{
                    backgroundColor: "none",
                    borderWidth: 0,
                    borderRadius: 20,
                    width: 300,
                    marginHorizontal: 5,
                  }}
                />
                <HelperText
                  style={styles.helper}
                  type="error"
                  visible={hasErrorsTipo() && helperTipo}
                >
                  Selecione um tipo de usuário
                </HelperText>
                <View style={{ marginTop: 10, paddingHorizontal: 5 }}>
                  {tipo === "Programacao" && (
                    <Text style={styles.infoText}>
                      O tipo "Programação" foca em desafios de algoritmos,
                      estruturas de dados e lógica de programação aplicada. 🖥️
                    </Text>
                  )}
                  {tipo === "RaciocinioLogico" && (
                    <Text style={styles.infoText}>
                      O tipo "Raciocínio Lógico" aborda quebra-cabeças,
                      sequências lógicas e problemas que testam sua capacidade
                      de dedução. 🧠
                    </Text>
                  )}
                </View>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 35,
          paddingVertical: 20,
        }}
      >
        <Button
          mode="elevated"
          textColor="black"
          buttonColor="#bfecff"
          style={{ width: 150 }}
          onPress={() => navigation.goBack()}
        >
          Voltar
        </Button>
        <Button
          mode="elevated"
          textColor="white"
          buttonColor="#6446db"
          style={{ width: 150, opacity: hasErrors() ? 0.4 : 1 }}
          onPress={usuarioArmazenado ? editarUsuario : cadastrarUsuario}
        >
          Salvar
        </Button>
      </View>
      {usuarioArmazenado && (
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
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>Cor</Text>
              <View style={styles.avatarImages}>
                {usuarioArmazenado.cores.map((c) => {
                  return (
                    <Pressable
                      key={c.id}
                      onPress={() => {
                        setCor(c.cor);
                      }}
                    >
                      <Image
                        source={
                          imagensPerfil[
                            `${c.cor.toLowerCase()}_${acessorio.toLowerCase()}`
                          ]
                        }
                        style={{
                          ...styles.avatarConfig,
                          opacity: cor === c.cor ? 1 : 0.5,
                        }}
                      />
                    </Pressable>
                  );
                })}
              </View>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Acessório
              </Text>
              <View style={styles.avatarImages}>
                {usuarioArmazenado.acessorios.map((a) => {
                  return (
                    <Pressable
                      key={a.id}
                      onPress={() => {
                        setAcessorio(a.acessorio);
                      }}
                    >
                      <Image
                        source={
                          imagensPerfil[
                            `${cor.toLowerCase()}_${a.acessorio.toLowerCase()}`
                          ]
                        }
                        style={{
                          ...styles.avatarConfig,
                          opacity: acessorio === a.acessorio ? 1 : 0.5,
                        }}
                      />
                    </Pressable>
                  );
                })}
              </View>
              <Button
                mode="elevated"
                textColor="white"
                buttonColor="#6446db"
                style={{ width: 150, alignSelf: "center" }}
                onPress={() => {
                  setDialogVisible(false);
                  setImagemKey(
                    `${cor.toLowerCase()}_${acessorio.toLowerCase()}`
                  );
                  setImagemSource(
                    imagensPerfil[
                      `${cor.toLowerCase()}_${acessorio.toLowerCase()}`
                    ]
                  );
                }}
              >
                Salvar
              </Button>
            </View>
          </Dialog>
        </Portal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#EEEEEE",
  },
  input: {
    width: "95%",
    maxWidth: 380,
    height: 45,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 0,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 18,
  },
  helper: {
    fontSize: 13,
    textColor: "red",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  perfil: {
    width: 90,
    height: 92,
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  dialog: {
    backgroundColor: "#6446DB",
    alignSelf: "center",
    justifyContent: "center",
    // alignItems: "center",
    borderRadius: 15,
    width: 350,
    height: 450,
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
  avatarConfig: {
    width: 70,
    height: 71,
  },
  avatarImages: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    width: "100%",
  },
});
