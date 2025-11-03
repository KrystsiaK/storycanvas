import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { THEME_COLOR } from "../utils/constants";

interface ToolButtonProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  isActive?: boolean;
  color?: string;
  style?: ViewStyle;
}

export const ToolButton: React.FC<ToolButtonProps> = ({
  icon,
  label,
  onPress,
  isActive = false,
  color = "#333",
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.buttonActive, style]}
      onPress={onPress}
    >
      <MaterialIcons
        name={icon}
        size={24}
        color={isActive ? THEME_COLOR : color}
      />
      <Text style={[styles.label, isActive && styles.labelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    minWidth: 60,
  },
  buttonActive: {
    backgroundColor: "#eef2ff",
  },
  label: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },
  labelActive: {
    color: THEME_COLOR,
    fontWeight: "600",
  },
});

