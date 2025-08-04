import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { Appbar, Menu, Divider, Icon, Button } from "react-native-paper";
import Logo from "../components/Logo.js";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [usuario, setUsuario] = useState(null);
  const [windows, setWindows] = useState([]);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useEffect(() => {
    async function getUsuario() {
      const usuarioArmazenado = await AsyncStorage.getItem("usuario");
      if (usuarioArmazenado) {
        setUsuario(JSON.parse(usuarioArmazenado));
      }
    }
    getUsuario();
  }, []);

  async function deslogar() {
    await AsyncStorage.removeItem("usuario");
    closeMenu();
    navigation.navigate("PaginaInicial");
  }

  if (!usuario) {
    return null; // ou um componente de loading
  }

  function newWindow(type){
    const window = {
      type,
      nome: type==="codigo" ? "Algoritmo" : type==="multiplaEscolha" ? "Múltipla Escolha" : "Minhas Questões",
      descricao: "", 
      script: "",
      errosLacuna: [],
      gabarito: "",
      opcao1: "",
      opcao2: "",
      opcao3: "",
      opcao4:""
    }
    setWindows(prev => [...prev, window]);
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
        {/* icones e texto incial */}
        {
          windows.length === 0 ? (<View style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
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
        </View>) : windows.map((window, index) => <Window key={index} window={window}/>)
        }
        

        {/* botões de navegação */}
        <View style={styles.buttons}>
          <Pressable style={styles.button} onPress={()=>{newWindow("codigo")}}>
            <View style={styles.iconButton}>
              <Icon source="code-braces" size={20} color="black" />
            </View>
            <Text>Novo Código</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={()=>{newWindow("multiplaEscolha")}}>
            <View style={styles.iconButton}>
              <Icon source="alphabetical" size={20} color="black" />
            </View>
            <Text>Múltipla Escolha</Text>
          </Pressable> 
          <Pressable style={styles.button} onPress={()=>{newWindow("minhasQuestoes")}}>
            <View style={styles.iconButton}>
              <Icon source="format-list-bulleted-square" size={20} color="black" />
            </View>
            <Text>Minhas Questões</Text>
          </Pressable>
        </View>
      </View>
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
  buttons:{
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
  }
  
});
