import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Icon } from "react-native-paper";
import instance from "../axios";
import Logo from "../components/Logo";

export default function Ranking({ navigation, usuario }) {
  const [ranking, setRanking] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingBottom, setLoadingBottom] = useState(true);
  const [hasMoreTop, setHasMoreTop] = useState(true);
  const [hasMoreBottom, setHasMoreBottom] = useState(true);
  async function loadInicial() {
    try {
      const response = await instance.get(`/ranking/${usuario.id}/8/9`, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
        },
      });
      setRanking(response.data);
      setLoadingTop(false);
      setLoadingBottom(false);
    } catch (error) {
      console.log(error);
    }
  }
  async function loadTop() {
    if (loadingTop || !hasMoreTop) {
      return;
    }
    setLoadingTop(true);
    try {
      const response = await instance.get(`/ranking/${ranking[0].id}/5/-1`, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
        },
      });
      setRanking((prev) => [...response.data, ...prev]);
      setHasMoreTop(response.data.length === 5);
      setLoadingTop(false);
    } catch (error) {
      console.log(error);
    }
  }
  async function loadBottom() {
    if (loadingBottom || !hasMoreBottom) {
      return;
    }
    setLoadingBottom(true);
    try {
      const response = await instance.get(
        `/ranking/${ranking[ranking.length - 1].id}/-1/5`,
        {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
          },
        }
      );
      setRanking((prev) => [...prev, ...response.data]);
      setHasMoreBottom(response.data.length === 5);
      setLoadingBottom(false);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    loadInicial();
  }, []);
  return (
    <View style={styles.container}>
      <Logo cor = "#6446db"/>
      <View style={{ flex: 1 }}>
        <LinearGradient
          style={styles.caminho}
          colors={["#BFECFF", "#6446DB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <Icon source="trophy" size={30} color="black" />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Ranking</Text>
        </LinearGradient>
        <FlatList
          data={ranking}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <LinearGradient
              style={styles.opcaoContainer}
              colors={
                usuario.id === item.id
                  ? ["#cbeaf7ff", "#9d86faff"]
                  : ["#FFFFFF", "#FFFFFF"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            >
              <LinearGradient
                colors={["#cbeaf7ff", "#9d86faff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.letter}
              >
                <View>
                  {item.posicao <= 3 ? (
                    <>
                      <Icon
                        source="trophy"
                        size={35}
                        color={
                          item.posicao === "1"
                            ? "#FFE366"
                            : item.posicao === "2"
                            ? "#969696"
                            : "#DC9135"
                        }
                      />
                      <Text style={styles.posicaoComTrofeu}>
                        {item.posicao}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.posicaoSemTrofeu}>{item.posicao}</Text>
                  )}
                </View>
              </LinearGradient>
              <View style={styles.nomeRank}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {item.usuario}
                </Text>
                <View>
                  <View style={{ width: 35, height: 35 }}>
                    <View style={{ position: "absolute", left: 0, top: 0 }}>
                      <Icon
                        source="shield"
                        size={35}
                        color={item.rankcor}
                      />
                    </View>
                    <View style={{ position: "absolute", left: 0, top: 0 }}>
                      <Icon source="shield-outline" size={35} color="black" />
                    </View>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        marginTop: 8,
                      }}
                    >
                      {"+".repeat(item.nivel)}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          )}
          onEndReached={loadBottom}
          onEndReachedThreshold={0.3}
          onRefresh={loadTop}
          refreshing={loadingTop}
          ListFooterComponent={
            loadingBottom ? <ActivityIndicator style={{ margin: 8 }} /> : null
          }
        ></FlatList>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
    backgroundColor: "#EEEEEE",
  },
  caminho: {
    marginVertical: 20,
    padding: 25,
    flexDirection: "row",
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
  opcaoContainer: {
    width: "100%",
    height: 60,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  letter: {
    width: 60,
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  posicaoComTrofeu: {
    position: "absolute",
    top: 6,
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 14,
    color: "black",
  },
  posicaoSemTrofeu: {
    fontWeight: "bold",
    fontSize: 18,
    color: "black",
  },
  nomeRank:{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "78%"
  }
});
