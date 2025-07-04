import AsyncStorage from "@react-native-async-storage/async-storage";
import { use, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Inicio from "./Inicio";
import Perfil from "./Perfil";
import { BottomNavigation, useTheme } from "react-native-paper";


export default function Home({ navigation }) {
  const [index, setIndex] = useState(2);
  const theme = useTheme();
  const [routes] = useState([
    { key: 'inicio', title: 'Início', focusedIcon: 'home'},
    { key: 'ranking', title: 'Ranking', focusedIcon: 'trophy' },
    { key: 'perfil', title: 'Perfil', focusedIcon: 'account-circle' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    inicio: () => <Inicio navigation={navigation} />,
    ranking: () => <Perfil navigation={navigation} />,
    perfil: () => <Perfil navigation={navigation} />,
  });

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarUsuario = async () => {
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

    buscarUsuario();
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6446db" />
      </View>
    );
  }

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
          secondaryContainer: "transparent" //borda itens selecionados cor
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#EEEEEE",
    },
    text: {
        fontSize: 24
    }
})