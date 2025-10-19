import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CodeEditor, { CodeEditorSyntaxStyles } from "@rivascva/react-native-code-editor";

export default function Algoritmo({ questao }) {
  return (
    <LinearGradient
      colors={["#BFECFF", "#6446DB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.borderDiv}
    >
      <CodeEditor
        language="javascript"
        initialValue={questao.script}
        readOnly={true}          // deixa apenas leitura
        showLineNumbers={true}   // mostra os números de linha
        syntaxStyle={CodeEditorSyntaxStyles.atomOneDark} // estilo pronto
        style={styles.editor}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  borderDiv: {
    width: "100%",
    height: "55%",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 12,
  },
  editor: {
    flex: 1,
    fontSize: 16,
    fontFamily: "monospace",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
