import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
} from "react-native";
import { Button, HelperText } from "react-native-paper";
import Logo from "../components/Logo.js";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import instance from "../axios.js";

export default function Cadastro({ navigation }) {
  async function cadastrarUsuario() {
    const dataNascimento = new Date();

    await instance.post("/cadastro", {
      nome,
      sobrenome,
      usuario,
      genero,
      dataNascimento,
      email,
      senha,
    });
  }

   const hasErrors = () => {
    return !email.includes('@');
  };

  const [open, setOpen] = useState(false);
  const [genero, setGenero] = useState(null);
  const [generos, setGeneros] = useState([
    { label: "Masculino", value: "Masculino" },
    { label: "Feminino", value: "Feminino" },
    { label: "Outro", value: "Outro" },
  ]);
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  return (
    <View style={styles.container}>
      <Logo />
      <View style={{ margin: 20, height: "80%" }}>
        <ScrollView>
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
          <TextInput style={styles.input} onChangeText={setNome}></TextInput>
          <Text style={styles.label}>Sobrenome:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setSobrenome}
          ></TextInput>
          <Text style={styles.label}>Data de Nascimento:</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TextInput
              style={{ ...styles.input, width: 50, textAlign: "center" }}
              placeholder="DD"
              onChangeText={setDia}
            ></TextInput>
            <TextInput
              style={{ ...styles.input, width: 50, textAlign: "center" }}
              placeholder="MM"
              onChangeText={setMes}
            ></TextInput>
            <TextInput
              style={{ ...styles.input, width: 80, textAlign: "center" }}
              placeholder="AAAA"
              onChangeText={setAno}
            ></TextInput>
          </View>
          <Text style={styles.label}>Gênero:</Text>
          <DropDownPicker
            style={styles.input}
            open={open}
            value={genero}
            items={generos}
            setOpen={setOpen}
            setValue={setGenero}
            setItems={setGeneros}
            placeholder="Selecionar"
            listMode="SCROLLVIEW"
            dropDownContainerStyle={{
              backgroundColor: "none",
              borderWidth: 0,
              borderRadius: 20,
              width: 200,
              marginHorizontal: 5,
            }}
            // Estilo de cada item da lista
            listItemContainerStyle={{
              backgroundColor: "none",
              borderWidth: 0,
              borderRadius: 20,
              width: 200,
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
          <TextInput style={styles.input} onChangeText={setEmail}></TextInput>
          <HelperText type="error" visible={hasErrors()}>
            Email address is invalid!
          </HelperText>
          <Text style={styles.label}>Usuário:</Text>
          <TextInput style={styles.input} onChangeText={setUsuario}></TextInput>
          <Text style={styles.label}>Senha:</Text>
          <TextInput style={styles.input} onChangeText={setSenha}></TextInput>
          <Text style={styles.label}>Confirmar Senha:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setConfirmaSenha}
          ></TextInput>
        </ScrollView>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 35 }}>
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
          style={{ width: 150 }}
          onPress={cadastrarUsuario}
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
    width: 250,
    height: 45,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 20,
    marginVertical: 10,
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
});
