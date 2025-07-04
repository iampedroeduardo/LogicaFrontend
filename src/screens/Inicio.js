import { View, StyleSheet, Pressable, Text} from "react-native";
import Logo from "../components/Logo";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';


export default function Inicio({ navigation }) {
  return(

    <View style={styles.container}>
          <Logo />
          <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center',  margin: 20, height: "80%", gap: 25}}>
            <LinearGradient 
              style={styles.caminho}
              colors={['#BFECFF', '#6446DB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              >
              {/* acessar trilha aleatória */} 
              <Pressable style={styles.caminhobutton}>
                <FontAwesome5 name="play" size={55} color="black" />
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
                <AntDesign name="codesquare" size={58} color="black" />
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
                <MaterialIcons name="calculate" size={70} color="black" />
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
    paddingHorizontal: 20,
    backgroundColor: "#EEEEEE",
  },
  caminhobutton: {
    padding: 15,
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
    color: '#4E4E4E'
  }

})
