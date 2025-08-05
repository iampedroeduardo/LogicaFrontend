import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, StyleSheet } from 'react-native';

export default function DescricaoToggle() {
  const [aberto, setAberto] = useState(false);

  const toggleDescricao = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAberto(!aberto);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botao} onPress={toggleDescricao}>
        <Text style={styles.botaoTexto}>
          {aberto ? 'Ocultar Descrição' : 'Mostrar Descrição'}
        </Text>
      </TouchableOpacity>

      {aberto && (
        <View style={styles.descricao}>
          <Text style={styles.texto}>
            O algoritmo tem o objetivo de verificar se o usuário é maior de idade e retornar uma mensagem diferente para cada caso, se ele for maior de idade e se ele não for maior de idade.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 10,
  },
  botao: {
    backgroundColor: '#4B70E2',
    padding: 10,
    borderRadius: 8,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descricao: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#eef',
    borderRadius: 8,
  },
  texto: {
    fontSize: 14,
  },
});
