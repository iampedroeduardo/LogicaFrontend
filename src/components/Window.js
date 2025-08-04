import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Icon } from "react-native-paper";

export default function Window({ window }) {
  return (
    <View style={styles.window}>
      <View style={styles.titleView}>
        {window.type === "minhasQuestoes" ? (
          <View style={styles.titleText}>
            <Text>{window.nome}</Text>
          </View>
        ) : (
          <TextInput style={styles.titleText} value={window.nome} />
        )}
        <Pressable style={styles.deleteButton}>
          <Icon source="delete" size={14} color="black" />
        </Pressable>
      </View>
      <View style={styles.questionView}>
        <View style={styles.questionContent}>
          <View style={styles.questionText}></View>
        </View>
        {window.type !== "minhasQuestoes" &&
          (window.type === "codigo" ? (
            <View style={styles.questionPopups}>
              <View style={styles.popupView}>
                <View style={styles.popupIcon}>
                  <Icon source="pen" size={20} color="black" />
                </View>
              </View>
              <View style={styles.popupView}>
                <View style={styles.popupIcon}>
                  <Icon source="alert" size={20} color="black" />
                </View>
              </View>
              <View style={styles.popupView}>
                <View style={styles.popupIcon}>
                  <Icon source="format-quote-close" size={20} color="black" />
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.questionPopups}>
              <View style={styles.popupView}>
                <View style={styles.popupIcon}>
                  <Icon source="alpha-a" size={20} color="black" />
                </View>
              </View>
              <View style={styles.popupView}>
                <View style={styles.popupIcon}>
                  <Icon source="alpha-b" size={20} color="black" />
                </View>
              </View>
              <View style={styles.popupView}>
                <View style={styles.popupIcon}>
                  <Icon source="alpha-c" size={20} color="black" />
                </View>
              </View>
              <View style={styles.popupView}>
                <View style={styles.popupIcon}>
                  <Icon source="alpha-d" size={20} color="black" />
                </View>
              </View>
            </View>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  window: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 500,
  },
  titleView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  titleText: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#BFECFF",
    padding: 8,
    borderRadius: 15,
    minWidth: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#6446DB",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionView: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  questionContent: {
    backgroundColor: "#6446DB",
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 300,
    minHeight: 400,
  },
  questionText: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
    height: "100%",
  },
  questionPopups: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  popupView: {
    padding: 0,
  },
  popupIcon: {
    padding: 10,
    backgroundColor: "#BFECFF",
    borderRadius: 15,
  }
});
