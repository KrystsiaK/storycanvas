import React from "react";
import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ShapeType, ShapeConfig } from "../types";
import { THEME_COLOR } from "../utils/constants";

interface ShapeSelectorProps {
  shapes: ShapeConfig[];
  onShapeSelect: (shape: ShapeType) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ShapeSelector: React.FC<ShapeSelectorProps> = ({
  shapes,
  onShapeSelect,
  isExpanded,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onToggle}>
        <MaterialIcons name="category" size={20} color="#666" />
        <Text style={styles.label}>Shapes</Text>
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
          {shapes.map((shape) => (
            <TouchableOpacity
              key={shape.type}
              style={styles.shapeOption}
              onPress={() => {
                onShapeSelect(shape.type);
                onToggle(); // Close after selection
              }}
              accessibilityLabel={`Draw ${shape.label}`}
            >
              <MaterialIcons name={shape.icon as any} size={32} color={THEME_COLOR} />
              <Text style={styles.shapeLabel}>{shape.label}</Text>
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
    maxHeight: 80,
    marginTop: 5,
  },
  shapeOption: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },
  shapeLabel: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
  },
});

