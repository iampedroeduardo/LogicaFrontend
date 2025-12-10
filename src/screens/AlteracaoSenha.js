import { Ionicons } from "@expo/vector-icons";
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

export default function AlteracaoSenha({ navigation, route }) {
  const { id } = route.params;

  async function alterarSenha() {
    setHelperSenhaAntiga(true);
    setHelperSenha(true);
    setHelperConfirmarSenha(true);
    if (!hasErrors()) {
      instance
        .post("/alterar-senha", {
          id: id,
          senhaAntiga: senhaAntiga,
          novaSenha: senha,
        })
        .then(() => {
          navigation.goBack();
        })
        .catch((error) => {
          if (error.response && error.response.data.error === "senha_antiga") {
            setErroSenhaAntiga("Senha antiga incorreta");
          } else if(error.response && error.response.data.error === "senha") {
            setErroSenha("Senha incompleta");
          }else {
            console.log(error);
          }
        });
    }
  }

  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  const [showSenhaAntiga, setShowSenhaAntiga] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const [helperSenhaAntiga, setHelperSenhaAntiga] = useState(false);
  const [helperSenha, setHelperSenha] = useState(false);
  const [helperConfirmarSenha, setHelperConfirmarSenha] = useState(false);

  const [erroSenhaAntiga, setErroSenhaAntiga] = useState("");

  const hasErrorsSenhaAntiga = () => {
    return senhaAntiga.trim().length === 0;
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
    return senha !== confirmaSenha || confirmaSenha.trim().length === 0;
  };

  const hasErrors = () => {
    return hasErrorsSenhaAntiga() || hasErrorsSenha() || hasErrorsConfirmarSenha();
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
            Alterar Senha
          </Text>
          <View style={styles.divider} />
          <View>
            <Text style={styles.label}>Senha Antiga:</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => {
                  setSenhaAntiga(text);
                  setHelperSenhaAntiga(true);
                  setErroSenhaAntiga("");
                }}
                secureTextEntry={!showSenhaAntiga}
              />
              <TouchableOpacity
                onPress={() => setShowSenhaAntiga(!showSenhaAntiga)}
                style={{ marginLeft: -50 }}
              >
                <Ionicons
                  name={showSenhaAntiga ? "eye" : "eye-off"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            <HelperText type="error" visible={helperSenhaAntiga && (hasErrorsSenhaAntiga() || erroSenhaAntiga)}>
              {erroSenhaAntiga || "Digite sua senha antiga"}
            </HelperText>

            <Text style={styles.label}>Nova Senha:</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => {
                  setSenha(text);
                  setHelperSenha(true);
                }}
                secureTextEntry={!showSenha}
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
            <HelperText style={styles.helper} type="error" visible={hasErrorsSenha() && helperSenha}>
              A senha precisa conter: 8 caracteres, 1 maiúscula, 1 número e 1 símbolo.
            </HelperText>

            <Text style={styles.label}>Confirmar Nova Senha:</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => {
                  setConfirmaSenha(text);
                  setHelperConfirmarSenha(true);
                }}
                secureTextEntry={!showConfirmarSenha}
              />
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
            <HelperText type="error" visible={hasErrorsConfirmarSenha() && helperConfirmarSenha}>
              As senhas não são iguais
            </HelperText>
          </View>
          <View style={styles.buttonContainer}>
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
              onPress={alterarSenha}
              disabled={hasErrors()}
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
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 25, backgroundColor: "#EEEEEE" },
  input: { width: "95%", maxWidth: 380, height: 45, backgroundColor: "white", justifyContent: "center", alignItems: "center", paddingHorizontal: 10, borderRadius: 20, marginTop: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, borderWidth: 0, marginHorizontal: 5 },
  label: { fontSize: 18 },
  helper: { fontSize: 13 },
  divider: { height: 1, backgroundColor: "#000", width: 100, alignSelf: "center", marginVertical: 5 },
  buttonContainer: { flexDirection: "row", justifyContent: "center", gap: 35, marginTop: 20 },
});