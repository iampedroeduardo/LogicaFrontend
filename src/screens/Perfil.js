import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Icon, Portal, Dialog, Button } from "react-native-paper";
import Logo from "../components/Logo";
import { useState } from "react";

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

export default function Perfil({ navigation, usuario }) {
  async function deslogar() {
    await AsyncStorage.removeItem("usuario");
    setVisible(false);
    navigation.navigate("PaginaInicial");
  }
  if (!usuario) {
    return null;
  }
  const imagemKey = `${usuario.cor.toLowerCase()}_${usuario.acessorio.toLowerCase()}`;
  const imagemSource = imagensPerfil[imagemKey] || imagensPerfil["preto_none"]; // Imagem padrão
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Logo />
        <Pressable
          onPress={() => {
            setVisible(true);
          }}
        >
          <Icon source="logout" size={35} color="black" />
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 20,
          height: "80%",
          gap: 25,
        }}
      >
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
            <Text style={{ fontSize: 10, textAlign: "center", marginTop: -10 }}>
              {"+".repeat(usuario.nivel)}
            </Text>
          </View>
          <View style={styles.caminhotext}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text style={styles.titulo}>{usuario.usuario}</Text>
              <Pressable onPress={() => navigation.navigate("Cadastro", {usuarioArmazenado: usuario})}>
                <Icon source="square-edit-outline" size={30} color="black" />
              </Pressable>
            </View>
            <Text
              style={{ ...styles.rankTexto, backgroundColor: usuario.rank.cor }}
            >
              {usuario.rank.nome + " " + "+".repeat(usuario.nivel)}
            </Text>
          </View>
        </LinearGradient>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: 500,
          }}
        >
          <LinearGradient
            style={{
              ...styles.caminho,
              width: "50%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              height: 150,
            }}
            colors={["#BFECFF", "#6446DB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Icon source="shield" size={20} color="black" />
              <Text style={{ ...styles.titulo, textAlign: "center" }}>
                Rank
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
              }}
            >
              <View style={{ width: 60, height: 60 }}>
                <View style={{ position: "absolute", left: 0, top: 0 }}>
                  <Icon source="shield" size={60} color={usuario.rank.cor} />
                </View>
                <View style={{ position: "absolute", left: 0, top: 0 }}>
                  <Icon source="shield-outline" size={60} color="black" />
                </View>
                <Text
                  style={{ fontSize: 15, textAlign: "center", marginTop: 15 }}
                >
                  {"+".repeat(usuario.nivel)}
                </Text>
              </View>
              <Icon source="arrow-right" size={20} color="black" />
              <View style={{ width: 60, height: 60 }}>
                <View style={{ position: "absolute", left: 0, top: 0 }}>
                  <Icon
                    source="shield"
                    size={60}
                    color={
                      usuario.nivel == 2
                        ? usuario.proximoRank.cor
                        : usuario.rank.cor
                    }
                  />
                </View>
                <View style={{ position: "absolute", left: 0, top: 0 }}>
                  <Icon source="shield-outline" size={60} color="black" />
                </View>
                <Text
                  style={{ fontSize: 15, textAlign: "center", marginTop: 15 }}
                >
                  {"+".repeat(usuario.nivel == 2 ? 0 : usuario.nivel + 1)}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "90%",
                height: 15,
                backgroundColor: "#fff",
                borderRadius: 50,
                padding: 5,
              }}
            >
              <LinearGradient
                style={{
                  width: usuario.xp + "%", //de acordo com o xp
                  height: 5,
                  backgroundColor: "#fff",
                  borderRadius: 50,
                }}
                colors={["#BFECFF", "#6446DB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              ></LinearGradient>
            </View>
          </LinearGradient>
          <LinearGradient
            style={{
              ...styles.caminho,
              width: "45%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              height: 150,
            }}
            colors={["#BFECFF", "#6446DB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Icon source="fire" size={20} color="black" />
              <Text style={{ ...styles.titulo, textAlign: "center" }}>
                Ofensiva
              </Text>
            </View>
            <Text style={{ fontSize: 50, textAlign: "center" }}>0</Text>
            <Text style={{ ...styles.titulo, textAlign: "center" }}>Dias</Text>
          </LinearGradient>
        </View>
      </View>
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => {
            setVisible(false);
          }}
        >
          <Dialog.Title>Logout</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Tem certeza que deseja sair da conta atual?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setVisible(false);
              }}
            >
              Cancelar
            </Button>
            <Button onPress={deslogar}>Sair</Button>
          </Dialog.Actions>
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
  },
  caminhobutton: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 15,
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
  texto: {
    fontSize: 15,
    color: "#4E4E4E",
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
});
