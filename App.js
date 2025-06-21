import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PaginaInicial from './src/screens/PaginaInicial';
import Cadastro from './src/screens/Cadastro';
import Home from './src/screens/Home';
import { PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="PaginaInicial">
          <Stack.Screen name="PaginaInicial" component={PaginaInicial} options={{ headerShown: false }}/>
          <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }}/>
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
      </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
