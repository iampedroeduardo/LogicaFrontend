import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';


export default function PaginaInicial() {
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
      start={{ x: 0, y: 0 }} // Início do gradiente (canto superior esquerdo)
      end={{ x: 1, y: 1 }}   // Fim do gradiente (canto inferior direito) - simula 45deg
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
      

      <View style={styles.button} onClick={() => console.log('Email pressed')}>
        <Text style={styles.buttonText}>Continuar com email</Text>
      </View>
      <View style={styles.button} onClick={() => console.log('Google pressed')}>
        <Text style={styles.buttonText}>Continuar com Google</Text>
      </View>
      <View style={styles.espacamento}>
        <Text>Já tem uma conta?</Text>
        <Text style={styles.underlined} onClick={() => console.log('Google pressed')}>Entre</Text>
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
    width: 100, // Defina a largura desejada
    height: 100,
    marginBottom: 20, // Adiciona um espaço abaixo da imagem (opcional)
  },
  logoText:{
    fontFamily: 'Quicksand-Bold',
    fontSize: 25
  },
  button: {
    width: '80%', // Largura desejada
    height: 45,
    backgroundColor: 'white', // Cor de fundo do botão
    justifyContent: 'center', // Centraliza o texto verticalmente
    alignItems: 'center', // Centraliza o texto horizontalmente
    borderRadius: 20, // Bordas arredondadas
    marginVertical: 10, // Espaçamento vertical entre os botões
  },
  buttonText: {
    color: 'black', // Cor do texto do botão
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
