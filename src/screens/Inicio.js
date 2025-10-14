import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-paper";
import Logo from "../components/Logo";


export default function Inicio({ navigation, usuario }) {
  if (!usuario) {
    return null;
  }
  return(
    <View style={styles.container}>
          <Logo />
          <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center',  marginVertical: 20, height: "80%", gap: 25}}>
            <LinearGradient 
              style={styles.caminho}
              colors={['#BFECFF', '#6446DB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              >
              {/* acessar trilha aleatória */}
              <Pressable style={styles.caminhobutton} onPress={() => navigation.navigate("Questao", { usuario })}>
                <Icon source="play" size={95} color="black"/>
              </Pressable>
              <View style={styles.caminhotext}>
                <Text style={styles.titulo}>Iniciar</Text>
                <Text style={styles.texto}>Permita que o algoritmo selecione desafios para você.</Text>
              </View>
            </LinearGradient>
            <LinearGradient 
              style={styles.caminho}
              colors={['#BFECFF', '#6446DB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            >
              {/* Lógica de Programação */}
              <Pressable style={styles.caminhobutton}>
                <Icon source="code-braces" size={65} color="black"/>
              </Pressable>
              <View style={styles.caminhotext}>
                <Text style={styles.titulo}>Lógica de Programação</Text>
                <Text style={styles.texto}>Explore desafios específicos.</Text>
              </View>
            </LinearGradient>
            <LinearGradient 
              style={styles.caminho}
              colors={['#BFECFF', '#6446DB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            >
              {/* Raciocínio Lógico */}
              <Pressable style={styles.caminhobutton}>
                <Icon source="lightbulb-on" size={65} color="black"/>
              </Pressable>
              <View style={styles.caminhotext}>
                <Text style={styles.titulo}>Raciocínio Lógico</Text>
                <Text style={styles.texto}>Explore desafios específicos.</Text>
              </View>
            </LinearGradient>
          </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
    backgroundColor: "#EEEEEE",
  },
  caminhobutton: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 95,
    backgroundColor: "white",
    borderRadius: 15,
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
    fontWeight: 'bold',
    fontSize: 19
  },
  texto: {
    fontSize: 15,
    color: '#ccc'
  }
})
