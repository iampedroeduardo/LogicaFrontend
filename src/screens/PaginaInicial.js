import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper'


export default function PaginaInicial({navigation}) {
  const [fontsLoaded, fontError] = useFonts({
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
  });
  if(!fontsLoaded){
    return null
  }
  return (
    <LinearGradient
      colors={['#BFECFF', '#6446DB']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View>
        <Image
        source={require('../../assets/images/axolote_png.png')}
        style={styles.logoImage}
        />
        <View style={styles.espacamento}>
          <Text style={styles.logoText}>Lógica</Text><Text style={{...styles.logoText, color: '#6446db'}}>++</Text>
        </View>
      </View>
      
      <View style={{width: '100%', alignItems: 'center', marginTop: 300, gap:10}}>
        <Button mode='elevated' icon='email' textColor='black' buttonColor='white' style={{width: '80%'}} onPress={() => navigation.navigate("Cadastro")}>Continuar com email</Button>
        <Button mode='elevated' icon='google' textColor='black' buttonColor='white' style={{width: '80%'}} onPress={() => console.log('Email pressed')}>Continuar com Google</Button>
        <View style={styles.espacamento}>
          <Text>Já tem uma conta?</Text>
          <Text style={styles.underlined} onPress={() => navigation.navigate("Entrar")}>Entre</Text>
        </View>
      </View>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 96,
  },
  logoText:{
    fontFamily: 'Quicksand-Bold',
    fontSize: 30
  },
  button: {
    width: '80%',
    height: 45,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center', 
    borderRadius: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  espacamento:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    marginTop: 10
  },
  underlined: {
    textDecorationLine: 'underline',
  }
});
