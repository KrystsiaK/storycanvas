import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { ToolButton } from "./ToolButton";
import { ColorPicker } from "./ColorPicker";
import { BrushSizePicker } from "./BrushSizePicker";
import { ToolType, ToolConfig } from "../types";
import { COLORS, BRUSH_SIZES, TOOLS, ERROR_COLOR } from "../utils/constants";

interface ToolbarProps {
  selectedTool: ToolType;
  selectedColor: string;
  strokeWidth: number;
  onToolSelect: (tool: ToolType) => void;
  onColorSelect: (color: string) => void;
  onStrokeWidthSelect: (width: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedTool,
  selectedColor,
  strokeWidth,
  onToolSelect,
  onColorSelect,
  onStrokeWidthSelect,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokePicker, setShowStrokePicker] = useState(false);

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
    setShowColorPicker(false);
    // Switch to pen when selecting color
    if (selectedTool === "eraser") {
      onToolSelect("pen");
    }
  };

  const handleStrokeWidthSelect = (width: number) => {
    onStrokeWidthSelect(width);
    setShowStrokePicker(false);
  };

  return (
    <View style={styles.container}>
      {/* Action buttons row */}
      <View style={styles.row}>
        <ToolButton
          icon="undo"
          label="Undo"
          onPress={onUndo}
          color={canUndo ? "#333" : "#ccc"}
        />
        <ToolButton
          icon="redo"
          label="Redo"
          onPress={onRedo}
          color={canRedo ? "#333" : "#ccc"}
        />

        {TOOLS.map((tool: ToolConfig) => (
          <ToolButton
            key={tool.type}
            icon={tool.icon as any}
            label={tool.label}
            onPress={() => onToolSelect(tool.type)}
            isActive={selectedTool === tool.type}
          />
        ))}

        <ToolButton
          icon="delete"
          label="Clear"
          onPress={onClear}
          color={ERROR_COLOR}
        />
      </View>

      {/* Color and size pickers row */}
      <View style={styles.row}>
        <ColorPicker
          colors={COLORS}
          selectedColor={selectedColor}
          onColorSelect={handleColorSelect}
          isExpanded={showColorPicker}
          onToggle={() => setShowColorPicker(!showColorPicker)}
        />

        <BrushSizePicker
          sizes={BRUSH_SIZES}
          selectedSize={strokeWidth}
          onSizeSelect={handleStrokeWidthSelect}
          isExpanded={showStrokePicker}
          onToggle={() => setShowStrokePicker(!showStrokePicker)}
          previewColor={selectedColor}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10,
  },
});

