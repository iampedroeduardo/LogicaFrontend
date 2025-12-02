import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button, HelperText } from "react-native-paper";
import instance from "../axios.js";
import Logo from "../components/Logo.js";
import { useRoute } from "@react-navigation/native";

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
          await AsyncStorage.setItem("usuario", JSON.stringify(response.data));
          if (Platform.OS === "web") {
            navigation.navigate("CadastroAtividade");
          } else {
            navigation.navigate("Home");
          }
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
  if(route.params) {
    usuarioArmazenado  = route.params.usuarioArmazenado;
    //console.log(usuarioArmazenado);
  }
  const [openGenero, setOpenGenero] = useState(false);
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
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
                  style={styles.input}
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
                      O tipo "Raciocínio Lógico" aborda quebra-cabeças, sequências
                      lógicas e problemas que testam sua capacidade de dedução. 🧠
                    </Text>
                  )}
                </View>
              </>
            )}

          </ScrollView>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 35, paddingVertical: 20 }}>
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
});
