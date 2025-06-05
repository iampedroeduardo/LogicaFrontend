import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PaginaInicial from './src/screens/PaginaInicial';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PaginaInicial">
        <Stack.Screen name="PaginaInicial" component={PaginaInicial} options={{ headerShown: false }}/>
     </Stack.Navigator>
    </NavigationContainer>
  );
}
