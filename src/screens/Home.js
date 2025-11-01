import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { BottomNavigation, useTheme } from "react-native-paper";
import Inicio from "./Inicio";
import Perfil from "./Perfil";
import Ranking from "./Ranking";

export default function Home({ navigation }) {
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  const [routes] = useState([
    { key: "inicio", title: "Início", focusedIcon: "home" },
    { key: "ranking", title: "Ranking", focusedIcon: "trophy" },
    { key: "perfil", title: "Perfil", focusedIcon: "account-circle" },
  ]);

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const buscarUsuario = async () => {
        setLoading(true);
        try {
          const usuarioJSON = await AsyncStorage.getItem("usuario");
          if (usuarioJSON) {
            setUsuario(JSON.parse(usuarioJSON));
          }
        } catch (error) {
          console.error("Falha ao buscar usuário do storage", error);
        } finally {
          setLoading(false);
        }
      };
      async function deslogar() {
        await AsyncStorage.removeItem("usuario");
        navigation.navigate("PaginaInicial");
      }
      buscarUsuario();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6446db" />
      </View>
    );
  }

  const renderScene = BottomNavigation.SceneMap({
    inicio: () => <Inicio navigation={navigation} usuario={usuario} />,
    ranking: () => <Ranking navigation={navigation} usuario={usuario} />,
    perfil: () => <Perfil navigation={navigation} usuario={usuario} />,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{ backgroundColor: "#6446DB", justifyContent: "center" }}
      theme={{
        colors: {
          onSurfaceVariant: "#EEEEEE", //itens não selecionados cor
          primary: "#BFECFF", //item selecionado cor (testar no celular!!!!)
          secondaryContainer: "transparent", //borda itens selecionados cor
        },
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEEEEE",
  },
  text: {
    fontSize: 24,
  },
});
