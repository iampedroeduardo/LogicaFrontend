import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Button, HelperText, Portal, Dialog } from "react-native-paper";
import instance from "../axios.js";
import Logo from "../components/Logo.js";

export default function RecuperacaoSenha({ navigation }) {
  async function emailRecuperarSenha() {
    if (CampoPreenchido()) {
      setDialogVisible(true);
      setEnviando(true);
      instance
        .post("/email-recuperar-senha", {
          email: email.trim(),
        })
        .then((response) => {
          setEnviando(false);
        })
        .catch((error) => {
          setEnviando(false);
          if (error.response.data.error) {
            if (error.response.data.error == "email") {
              setErroUsuario("Usuário com este email não encontrado");
            } else {
              //erro de servidor
              console.log(error);
            }
          }
        });
    }
  }
  async function verificarCodigo() {
    setDialogVisible(true);
    setEnviando(true);
    instance
      .post("/verificar-codigo", {
        email: email.trim(),
        codigo: codigo,
      })
      .then((response) => {
        setEnviando(false);
        console.log(response.data);
        navigation.navigate("RecuperacaoNovaSenha", {
          id: response.data.id,
        });
        setDialogVisible(false);
      })
      .catch((error) => {
        setEnviando(false);
        if (error.response.data.error) {
          if (error.response.data.error == "codigo") {
            setErroUsuario("Código incorreto");
          } else {
            //erro de servidor
            console.log(error);
          }
        }
      });
  }
  const [email, setEmail] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [codigo, setCodigo] = useState("");

  const CampoPreenchido = () => {
    return email.trim().length > 0;
  };

  return (
    <View style={styles.container}>
      <Logo cor="#6446db" />
      <View style={{ margin: 20, justifyContent: "center", height: "75%" }}>
        <Text style={{ alignSelf: "center", fontSize: 19 }}>
          Recuperação de Senha
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
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErroEmail(true);
            }}
          />
          <HelperText type="error" visible={!!erroEmail} style={styles.helper}>
            {erroEmail}
          </HelperText>
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
            onPress={emailRecuperarSenha}
          >
            Recuperar
          </Button>
        </View>
      </View>
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => {}}
          dismissable={false}
          style={styles.dialog}
        >
          <View style={styles.dialogContent}>
            {enviando ? (
              <Text style={styles.dialogText}>Enviando...</Text>
            ) : (
              <Text style={styles.dialogText}>
                Email enviado com sucesso! Preencha o código recebido no email:
              </Text>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
              }}
            >
              {enviando ? (
                <ActivityIndicator size={30} color="#6446db" />
              ) : (
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <TextInput
                    style={{ ...styles.input, width: 100, textAlign: "center" }}
                    maxLength={6}
                    keyboardType="numeric"
                    value={codigo}
                    onChangeText={(text) => {
                      setCodigo(text);
                      setErroEmail(true);
                    }}
                  />
                  <HelperText
                    type="error"
                    visible={!!erroEmail}
                    style={styles.helper}
                  >
                    {erroEmail}
                  </HelperText>
                  <Button
                    mode="elevated"
                    textColor="black"
                    buttonColor="#bfecff"
                    style={{ width: 150 }}
                    onPress={() => verificarCodigo()}
                  >
                    Enviar
                  </Button>
                </View>
              )}
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
    justifyContent: "center",
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
