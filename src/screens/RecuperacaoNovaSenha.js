import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Button, HelperText } from "react-native-paper";
import instance from "../axios.js";
import Logo from "../components/Logo.js";

export default function RecuperacaoNovaSenha({ navigation, route }) {
  const { id } = route.params;

  async function novaSenha() {
    setHelperSenha(true);
    setHelperConfirmarSenha(true);
    if (!hasErrors()) {
      instance
        .post("/recuperacao-nova-senha", {
          id: id,
          novaSenha: senha,
        })
        .then(async (response) => {
          await AsyncStorage.setItem("usuario", JSON.stringify(response.data));
          navigation.navigate("Entrar");
        })
        .catch((error) => {
          if (error.response.data.error) {
            if (error.response.data.error == "senha") {
              setErroSenha("Senha inválida");
            } else if (error.response.data.error == "usuario") {
              setErroUsuario("Usuário não encontrado");
            } else {
              //erro de servidor
              console.log(error);
            }
          }
        });
    }
  }
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [helperSenha, setHelperSenha] = useState(false);
  const [helperConfirmarSenha, setHelperConfirmarSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState("");

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

  const hasErrors = () => {
    return hasErrorsSenha() || hasErrorsConfirmarSenha();
  };

  return (
    <View style={styles.container}>
      <Logo cor="#6446db" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 130 : 130}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ alignSelf: "center", fontSize: 19 }}>
            Crie uma nova senha
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
          <View>
            <Text style={styles.label}>Senha:</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => {
                  setSenha(text);
                  setHelperSenha(true); // Mostra o helper ao começar a digitar
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
                ? ""
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 35,
              marginTop: 20,
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
              onPress={novaSenha}
            >
              Salvar
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 25,
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
  underlined: {
    textDecorationLine: "underline",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 35,
    paddingVertical: 20,
    marginTop: 20,
  },
});
