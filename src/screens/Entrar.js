import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { Button, HelperText } from "react-native-paper";
import instance from "../axios.js";
import Logo from "../components/Logo.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Entrar({ navigation }) {
  async function usuarioEntrar() {
    if (CampoPreenchido()) {
      instance
        .post("/entrar", {
          usuario: usuario.trim(),
          senha: senha,
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
          if (error.response.data.error) {
            if (error.response.data.error == "senha") {
              setErroSenha("Senha incorreta");
            } else if (error.response.data.error == "usuario") {
              setErroUsuario("Usuário não encontrado");
            } else if (error.response.data.error == "email") {
              setErroUsuario("Email não verificado");
            } else{
              //erro de servidor
              console.log(error);
            }
          }
        });
    }
  }
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState("");
  const [erroUsuario, setErroUsuario] = useState("");

  const CampoPreenchido = () => {
    return usuario.trim().length > 0 && senha.trim().length > 0;
  };

  return (
    <View style={styles.container}>
      <Logo cor="#6446db" />
      <View style={{ margin: 20, justifyContent: "center", height: "75%" }}>
        <Text style={{ alignSelf: "center", fontSize: 19 }}>
          Dados de Login
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
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.label}>Usuário ou email:</Text>
          <TextInput
            style={styles.input}
            value={usuario}
            onChangeText={(text) => {
              setUsuario(text);
              setErroUsuario(true);
            }}
          />
          <HelperText
            type="error"
            visible={!!erroUsuario}
            style={styles.helper}
          >
            {erroUsuario}
          </HelperText>

          <Text style={styles.label}>Senha:</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={styles.input}
              value={senha}
              secureTextEntry={!showSenha}
              onSubmitEditing={usuarioEntrar}
              onChangeText={(text) => {
                setSenha(text);
                setErroSenha(true);
              }}
            />
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

          <HelperText type="error" visible={!!erroSenha} style={styles.helper}>
            {erroSenha}
          </HelperText>
          <Text
            style={styles.underlined}
            onPress={() => {
              navigation.navigate("RecuperacaoSenha");
            }}
          >
            Esqueci a senha
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 35 }}
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
            style={{ width: 150, opacity: !CampoPreenchido() ? 0.4 : 1 }}
            onPress={usuarioEntrar}
          >
            Entrar
          </Button>
        </View>
      </View>
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
});
