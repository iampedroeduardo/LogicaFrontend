import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-paper";
import Logo from "../components/Logo";
import { useEffect, useState } from 'react';
import instance from '../axios';


export default function Inicio({ navigation, usuario }) {
  const [selectProg, setSelectProg] = useState(false);
  const [selectRacio, setSelectRacio] = useState(false);
  const categoriaMap = {
    RaciocinioLogico: "Raciocínio Lógico",
    Variaveis: "Variáveis",
    Condicionais: "Condicionais",
    Operadores: "Operadores",
    LacosDeRepeticao: "Laços de Repetição",
    Strings: "Strings",
    Vetores: "Vetores",
    Funcoes: "Funções",
    Avancado: "Avançado",
  };
  const [categoriasRac, setCategoriasRac] = useState([
    { label: "Proposições", value: "proposicoes" },
    { label: "Conectivos Lógicos", value: "conectivosLogicos" },
    { label: "Tabelas Verdade", value: "tabelasVerdade" },
    { label: "Equivalências Lógicas", value: "equivalenciasLogicas" },
    { label: "Diagramas de Venn", value: "diagramasVenn" },
    { label: "Argumentos Válidos", value: "argumentosValidos" },
    { label: "Sequências Lógicas", value: "sequenciasLogicas" },
    { label: "Padrões Numéricos", value: "padroesNumericos" },
    { label: "Análise Combinatória", value: "analiseCombinatoria" },
    { label: "Probabilidade", value: "probabilidade" },
  ]);
  const [categoriasProgDesbloqueadas, setCategoriasProgDesbloqueadas] = useState([]);
  if (!usuario) {
    return null;
  }
  

  useEffect(() => {
    async function buscarCategoriasDesbloqueadas() {
        try {
          const { data: ranksDesbloqueados } = await instance.get('/atividades/ranks', {
            headers: { Authorization: `Bearer ${usuario.token}` },
            params: { rankId: usuario.rank.id }
          });
          const categorias = ranksDesbloqueados.map(rank => rank.categoria);
          setCategoriasProgDesbloqueadas(categorias);
        } catch (error) {
          // Apenas exibe o erro da API
          console.error("Erro ao buscar categorias desbloqueadas:", error);
        }
      }
    buscarCategoriasDesbloqueadas();
  }, []);

  return(
    <View style={styles.container}>
          <Logo />
          <ScrollView contentContainerStyle={styles.caminhos}>
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
             
              <Pressable style={{flexDirection: 'row', alignItems: 'center', gap: 20}} onPress={() => setSelectProg(!selectProg)}>
                <View style={styles.caminhobutton}>
                  <Icon source="code-braces" size={65} color="black"/>
                </View>
              <View style={styles.caminhotext}>
                <Text style={styles.titulo}>Lógica de Programação</Text>
                <Text style={styles.texto}>Explore desafios específicos.</Text>
              </View>
                <Icon source={selectProg ? "chevron-up" : "chevron-down"} size={20} color="black"/>
              </Pressable>
            </LinearGradient>
            {selectProg && (
              
              <View style={styles.selectContainer}>
                {categoriasProgDesbloqueadas
                  .filter((categoria) => categoria !== 'RaciocinioLogico')
                  .map((categoria) => (
                    <LinearGradient
                      colors={['#B5E2F5', '#8E79E3']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      key={categoria}
                      style={styles.selectItem}
                    >
                      <Pressable
                      style={styles.selectButton}
                      onPress={() => navigation.navigate("Questao", { usuario, categoria })}
                      >
                      <Text style={styles.selectText}>{categoriaMap[categoria]}</Text>
                      <Icon source="chevron-right" size={20} color="black" />
                    </Pressable>
                    </LinearGradient>
                  ))}
              </View>
            )}
            <LinearGradient 
              style={styles.caminho}
              colors={['#BFECFF', '#6446DB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            >
              {/* Raciocínio Lógico */}
              <Pressable style={{flexDirection: 'row', alignItems: 'center', gap: 20}} onPress={() => setSelectRacio(!selectRacio)}>
                <View style={styles.caminhobutton}>
                  <Icon source="lightbulb-on" size={65} color="black"/>
                </View>
                <View style={styles.caminhotext}>
                  <Text style={styles.titulo}>Raciocínio Lógico</Text>
                  <Text style={styles.texto}>Explore desafios específicos.</Text>
                </View>
                <Icon source={selectRacio ? "chevron-up" : "chevron-down"} size={20} color="black"/>
              </Pressable>
            </LinearGradient>
            {selectRacio && (
              <View style={styles.selectContainer}>
                {categoriasRac.map((categoriasRac) => (
                  <LinearGradient
                    colors={['#B5E2F5', '#8E79E3']}
                    start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    key={categoriasRac.value}
                    style={styles.selectItem}
                  >
                    <Pressable
                      style={styles.selectButton}
                      onPress={() => navigation.navigate("Questao", { usuario, categoria: categoriasRac.value })}
                    >
                      <Text style={styles.selectText}>{categoriasRac.label}</Text>
                      <Icon source="chevron-right" size={20} color="black" />
                    </Pressable>
                  </LinearGradient>
                ))}
              </View>
            )}
          </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
    backgroundColor: "#EEEEEE",
    flex: 1,
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
    color: 'white',
    fontWeight: '500',
  },
  caminhos: {
    flexDirection: 'column', 
    alignItems: 'center',  
    paddingVertical: 20, 
    gap: 25,
    flexGrow: 1,
  },
  selectContainer: {
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 10,
    gap: 10
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  selectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black'
  },
})
