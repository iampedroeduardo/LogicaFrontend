import { StyleSheet, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function PaginaInicial() {
  return (
    <LinearGradient
      colors={['#BFECFF', '#6446DB']}
      style={styles.container}
      start={{ x: 0, y: 0 }} // Início do gradiente (canto superior esquerdo)
      end={{ x: 1, y: 1 }}   // Fim do gradiente (canto inferior direito) - simula 45deg
    >
      <Image
        source={require('../../assets/images/axolote_png.png')}
        style={styles.logo}
      />
      <Text>oi</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250, // Defina a largura desejada
    height: 250, // Defina a altura desejada
    marginBottom: 20, // Adiciona um espaço abaixo da imagem (opcional)
  }
});
