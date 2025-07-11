import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Cadastro from "./src/screens/Cadastro";
import Entrar from "./src/screens/Entrar";
import Home from "./src/screens/Home";
import HomeTeste from "./src/screens/HomeTeste";
import PaginaInicial from "./src/screens/PaginaInicial";

const Stack = createNativeStackNavigator();
const theme = {
  ...DefaultTheme, // ou use DarkTheme
  colors: {
    ...DefaultTheme.colors,
    // personalize outras cores aqui se quiser
  },
};

export default function AppNavigator() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const buscarUsuario = async () => {
      const usuarioJSON = await AsyncStorage.getItem("usuario");
      if (usuarioJSON) {
        setUsuario(JSON.parse(usuarioJSON));
      }
      setLoading(false);
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
    <PaperProvider
      settings={{
        icon: (props) => <MaterialCommunityIcons {...props} />,
      }}
      theme={theme}
    >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={usuario != null ? "Home" : "PaginaInicial"}
        >
          <Stack.Screen
            name="PaginaInicial"
            component={PaginaInicial}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Cadastro"
            component={Cadastro}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeTeste"
            component={HomeTeste}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Entrar"
            component={Entrar}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
});
