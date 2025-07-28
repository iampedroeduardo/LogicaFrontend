import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, Image, Pressable} from 'react-native';
import {Icon} from 'react-native-paper';
import { LinearGradient } from "expo-linear-gradient"

export default function DadosPerfil({ navigation, usuario }) {

    
    return (
         <View style={styles.content}>
                        <LinearGradient
                                  style={styles.caminho}
                                  colors={["#BFECFF", "#6446DB"]}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 0.5, y: 1 }}
                                >
                                  {/* informações básicas do perfil */}
                                  <View style={{ width: 100, height: 105 }}>
                                    <Image source={imagemSource} style={styles.perfil} />
                                    <View style={{ position: "absolute", left: 35, top: 75 }}>
                                      <Icon source="shield" size={30} color={usuario.rank.cor} />
                                    </View>
                                    <View style={{ position: "absolute", left: 35, top: 75 }}>
                                      <Icon source="shield-outline" size={30} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 10, textAlign: "center", marginTop: -10 }}>
                                      {"+".repeat(usuario.nivel)}
                                    </Text>
                                  </View>
                                  <View style={styles.caminhotext}>
                                    <View
                                      style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                                    >
                                      <Text style={styles.titulo}>{usuario.usuario}</Text>
                                      <Pressable onPress={() => navigation.navigate("Cadastro", {usuarioArmazenado: usuario})}>
                                        <Icon source="square-edit-outline" size={30} color="black" />
                                      </Pressable>
                                    </View>
                                    <Text
                                      style={{ ...styles.rankTexto, backgroundColor: usuario.rank.cor }}
                                    >
                                      {usuario.rank.nome + " " + "+".repeat(usuario.nivel)}
                                    </Text>
                                  </View>
                                </LinearGradient>
                    </View>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
        alignItems: 'center',
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
        fontWeight: "bold",
        fontSize: 19,
    },
    perfil: {
        width: 90,
        height: 90,
    },
    rankTexto: {
        borderRadius: 50,
        paddingHorizontal: 10,
        paddingVertical: 3,
        width: "fit-content",
        fontSize: 15,
    },
})