import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BrushSizeConfig } from "../types";
import { THEME_COLOR } from "../utils/constants";

interface BrushSizePickerProps {
  sizes: BrushSizeConfig[];
  selectedSize: number;
  onSizeSelect: (size: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
  previewColor: string;
}

export const BrushSizePicker: React.FC<BrushSizePickerProps> = ({
  sizes,
  selectedSize,
  onSizeSelect,
  isExpanded,
  onToggle,
  previewColor,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onToggle}>
        <View style={styles.sizePreview}>
          <View
            style={{
              width: selectedSize,
              height: selectedSize,
              borderRadius: selectedSize / 2,
              backgroundColor: previewColor,
            }}
          />
        </View>
        <Text style={styles.label}>Size: {selectedSize}px</Text>
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
          {sizes.map(({ size, label }) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeOption,
                selectedSize === size && styles.sizeOptionSelected,
              ]}
              onPress={() => onSizeSelect(size)}
              accessibilityLabel={`Select ${label} brush size`}
            >
              <View
                style={{
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: "#333",
                }}
              />
              <Text style={styles.sizeLabel}>{label}</Text>
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
    marginLeft: 5,
  },
  sizePreview: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  label: {
    fontSize: 11,
    color: "#666",
    flex: 1,
  },
  palette: {
    maxHeight: 70,
    marginTop: 5,
  },
  sizeOption: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },
  sizeOptionSelected: {
    backgroundColor: "#eef2ff",
    borderColor: THEME_COLOR,
  },
  sizeLabel: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
  },
});

