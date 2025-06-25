import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PaginaInicial from "./src/screens/PaginaInicial";
import Cadastro from "./src/screens/Cadastro";
import Home from "./src/screens/Home";
import HomeTeste from "./src/screens/HomeTeste";
import Entrar from "./src/screens/Entrar";
import { PaperProvider } from "react-native-paper";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View, StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();

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
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={usuario ? "Home" : "PaginaInicial"}>
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 24
    }
})