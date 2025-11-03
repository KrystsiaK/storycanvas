import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ColorConfig } from "../types";
import { THEME_COLOR } from "../utils/constants";

interface BackgroundSelectorProps {
  colors: ColorConfig[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  colors,
  selectedColor,
  onColorSelect,
  isExpanded,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onToggle}>
        <MaterialIcons name="palette" size={20} color="#666" />
        <Text style={styles.label}>Background</Text>
        <MaterialIcons
          name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView
          horizontal
          style={styles.palette}
          showsHorizontalScrollIndicator={false}
        >
          {colors.map(({ color, name }) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.colorOptionSelected,
              ]}
              onPress={() => {
                onColorSelect(color);
                onToggle(); // Close after selection
              }}
              accessibilityLabel={`Set ${name} background`}
            >
              {selectedColor === color && (
                <MaterialIcons
                  name="check"
                  size={24}
                  color={color === "#FFFFFF" ? THEME_COLOR : "#fff"}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 11,
    color: "#666",
    flex: 1,
    marginLeft: 8,
  },
  palette: {
    maxHeight: 60,
    marginTop: 5,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#e5e5e5",
  },
  colorOptionSelected: {
    borderColor: THEME_COLOR,
    borderWidth: 3,
  },
});

