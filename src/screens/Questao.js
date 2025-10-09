import { Pressable, StyleSheet, View } from "react-native";
import { Icon } from "react-native-paper";
import Logo from "../components/Logo";
import DescricaoQuestao from "../components/DescricaoQuestao";
import Opcoes from "../components/Opcoes";
import { useState } from "react";


export default function Questao({ navigation }) {
  const [modo, setModo] = useState('descricao')
  const [respondida, setRespondida] = useState(false)
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null)
  const questao = {
    nome: 'Teste',
    descricao: 'ndnndnjcjndjck dncondcoewnc noinds ncidsnc jdj nncnknsknc',
    gabarito: 'njcdcjkcnjdcjndcjcc ndndsjk nslkanclan ccnaioncjka',
    pergunta: 'oncwbucdbucdcbjhk ddbcb',
    opcoes: ['bbjhbjkbkj', 'hubiubuib', 'vyuuuvuycityc', 'yuvvdh'],
    opcaoCerta: 1,
    tipo: 'multiplaEscolha'
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo />
        <Pressable style={styles.xButton}>
          <View style={styles.xInsideButton}>
            <Icon source="close" size={24} color="black" />
          </View>
        </Pressable>
      </View>
      <DescricaoQuestao questao={questao} modo={modo}/>
      {questao.tipo === 'multiplaEscolha' && (<Opcoes opcoes={questao.opcoes} opcaoCerta={questao.opcaoCerta} opcaoSelecionada={opcaoSelecionada} setOpcaoSelecionada={setOpcaoSelecionada} respondida={respondida}/>)}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
    backgroundColor: "#EEEEEE",
    display: "flex",
    gap: 15,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  xButton: {
    width: 50,
    height: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 15,
    padding: 5,
    backgroundColor: "#bfecff",
  },
  xInsideButton:{
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});
