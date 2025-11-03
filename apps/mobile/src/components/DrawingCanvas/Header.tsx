import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { THEME_COLOR } from "./utils/constants";

interface HeaderProps {
  onClose: () => void;
  onSave: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onClose,
  onSave,
  title = "Draw Your Story",
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.button}>
        <MaterialIcons name="close" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onSave} style={styles.button}>
        <MaterialIcons name="save" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: THEME_COLOR,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  button: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});

