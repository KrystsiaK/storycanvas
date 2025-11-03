import React, { useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
  PanResponder,
} from "react-native";
import {
  Canvas,
  Path,
  Skia,
  SkPath,
  useCanvasRef,
  Rect,
} from "@shopify/react-native-skia";
import { MaterialIcons } from "@expo/vector-icons";
// import * as FileSystem from "expo-file-system";

const { width, height } = Dimensions.get("window");

interface DrawingCanvasProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (imagePath: string) => void;
}

interface PathData {
  path: SkPath;
  color: string;
  strokeWidth: number;
}

const COLORS = [
  "#000000", "#FF0000", "#00FF00", "#0000FF",
  "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500",
  "#800080", "#FFC0CB", "#A52A2A", "#808080", "#FFFFFF",
];

const STROKE_WIDTHS = [2, 5, 10, 15, 20, 30];

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const canvasRef = useCanvasRef() as any;
  const [paths, setPaths] = useState<PathData[]>([]);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokePicker, setShowStrokePicker] = useState(false);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [currentPath, setCurrentPath] = useState<SkPath | null>(null);

  // история undo/redo
  const historyRef = useRef<PathData[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Refs для актуальных значений в PanResponder
  const pathsRef = useRef(paths);
  const toolRef = useRef(tool);
  const selectedColorRef = useRef(selectedColor);
  const strokeWidthRef = useRef(strokeWidth);
  const currentPathRef = useRef(currentPath);

  // Обновляем refs при изменении state
  pathsRef.current = paths;
  toolRef.current = tool;
  selectedColorRef.current = selectedColor;
  strokeWidthRef.current = strokeWidth;
  currentPathRef.current = currentPath;

  const addToHistory = useCallback(
    (newPaths: PathData[]) => {
      historyRef.current = historyRef.current.slice(0, historyIndex + 1);
      historyRef.current.push(newPaths);
      setHistoryIndex(historyRef.current.length - 1);
    },
    [historyIndex]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        const p = Skia.Path.Make();
        p.moveTo(locationX, locationY);
        currentPathRef.current = p;
        setCurrentPath(p);
      },
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        const current = currentPathRef.current;
        if (current) {
          current.lineTo(locationX, locationY);
          const copied = current.copy();
          currentPathRef.current = copied;
          setCurrentPath(copied);
        }
      },
      onPanResponderRelease: () => {
        const current = currentPathRef.current;
        if (current) {
          const newPaths = [
            ...pathsRef.current,
            {
              path: current,
              color: toolRef.current === "eraser" ? "#FFFFFF" : selectedColorRef.current,
              strokeWidth: toolRef.current === "eraser" ? strokeWidthRef.current * 3 : strokeWidthRef.current,
            },
          ];
          setPaths(newPaths);
          historyRef.current = historyRef.current.slice(0, historyIndex + 1);
          historyRef.current.push(newPaths);
          setHistoryIndex(historyRef.current.length - 1);
          currentPathRef.current = null;
          setCurrentPath(null);
        }
      },
    })
  ).current;

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPaths(historyRef.current[newIndex]);
    }
  }, [historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < historyRef.current.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPaths(historyRef.current[newIndex]);
    }
  }, [historyIndex]);

  const handleClear = useCallback(() => {
    Alert.alert("Clear Canvas", "Are you sure you want to clear everything?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          setPaths([]);
          historyRef.current = [[]];
          setHistoryIndex(0);
        },
      },
    ]);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const image = canvasRef.current?.makeImageSnapshot();
      if (!image) {
        Alert.alert("Error", "No drawing to save");
        return;
      }

      const base64 = image.encodeToBase64();
      
      // TODO: implement file saving with expo-file-system
      // const fileUri = `${FileSystem.documentDirectory}drawing_${Date.now()}.png`;
      // await FileSystem.writeAsStringAsync(fileUri, base64, {
      //   encoding: FileSystem.EncodingType.Base64,
      // });

      Alert.alert("Success", "Drawing captured! (Save to file not implemented yet)");
      onSave?.(`data:image/png;base64,${base64}`);
    } catch (error) {
      Alert.alert("Error", "Failed to save drawing");
    }
  }, [onSave, canvasRef]);

  const selectColor = (color: string) => {
    setSelectedColor(color);
    setShowColorPicker(false);
    setTool("pen");
  };

  const selectStrokeWidth = (width: number) => {
    setStrokeWidth(width);
    setShowStrokePicker(false);
  };

  const toggleEraser = () => {
    setTool((prev) => (prev === "eraser" ? "pen" : "eraser"));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <MaterialIcons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Draw Your Story</Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <MaterialIcons name="save" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Canvas */}
        <View style={styles.canvasContainer} {...panResponder.panHandlers}>
          <Canvas ref={canvasRef} style={styles.canvas} pointerEvents="none">
            <Rect x={0} y={0} width={width} height={height} color="white" />
            {paths.map((p, i) => (
              <Path
                key={i}
                path={p.path}
                color={p.color}
                style="stroke"
                strokeWidth={p.strokeWidth}
                strokeCap="round"
                strokeJoin="round"
              />
            ))}
            {currentPath && (
              <Path
                path={currentPath}
                color={tool === "eraser" ? "#FFFFFF" : selectedColor}
                style="stroke"
                strokeWidth={tool === "eraser" ? strokeWidth * 3 : strokeWidth}
                strokeCap="round"
                strokeJoin="round"
              />
            )}
          </Canvas>
        </View>

        {/* Toolbar */}
        <View style={styles.toolbar}>
          <View style={styles.toolRow}>
            <TouchableOpacity style={styles.toolButton} onPress={handleUndo}>
              <MaterialIcons name="undo" size={24} color="#333" />
              <Text style={styles.toolLabel}>Undo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={handleRedo}>
              <MaterialIcons name="redo" size={24} color="#333" />
              <Text style={styles.toolLabel}>Redo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolButton, tool === "pen" && styles.toolButtonActive]}
              onPress={() => setTool("pen")}
            >
              <MaterialIcons name="create" size={24} color={tool === "pen" ? "#6366f1" : "#333"} />
              <Text style={[styles.toolLabel, tool === "pen" && styles.toolLabelActive]}>Pen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolButton, tool === "eraser" && styles.toolButtonActive]}
              onPress={toggleEraser}
            >
              <MaterialIcons name="clear" size={24} color={tool === "eraser" ? "#6366f1" : "#333"} />
              <Text style={[styles.toolLabel, tool === "eraser" && styles.toolLabelActive]}>Eraser</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={handleClear}>
              <MaterialIcons name="delete" size={24} color="#ef4444" />
              <Text style={[styles.toolLabel, { color: "#ef4444" }]}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Color + size */}
          <View style={styles.toolRow}>
            <TouchableOpacity
              style={styles.colorPickerButton}
              onPress={() => setShowColorPicker(!showColorPicker)}
            >
              <View style={[styles.colorPreview, { backgroundColor: selectedColor }]} />
              <Text style={styles.toolLabel}>Color</Text>
              <MaterialIcons
                name={showColorPicker ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.strokePickerButton}
              onPress={() => setShowStrokePicker(!showStrokePicker)}
            >
              <View style={styles.strokePreview}>
                <View
                  style={{
                    width: strokeWidth,
                    height: strokeWidth,
                    borderRadius: strokeWidth / 2,
                    backgroundColor: selectedColor,
                  }}
                />
              </View>
              <Text style={styles.toolLabel}>Size: {strokeWidth}px</Text>
              <MaterialIcons
                name={showStrokePicker ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {showColorPicker && (
            <ScrollView horizontal style={styles.colorPalette} showsHorizontalScrollIndicator={false}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => selectColor(color)}
                >
                  {selectedColor === color && (
                    <MaterialIcons
                      name="check"
                      size={20}
                      color={color === "#FFFFFF" ? "#000" : "#fff"}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {showStrokePicker && (
            <ScrollView horizontal style={styles.strokePalette} showsHorizontalScrollIndicator={false}>
              {STROKE_WIDTHS.map((w) => (
                <TouchableOpacity
                  key={w}
                  style={[styles.strokeOption, strokeWidth === w && styles.strokeOptionSelected]}
                  onPress={() => selectStrokeWidth(w)}
                >
                  <View
                    style={{
                      width: w,
                      height: w,
                      borderRadius: w / 2,
                      backgroundColor: "#333",
                    }}
                  />
                  <Text style={styles.strokeOptionLabel}>{w}px</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#6366f1",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  headerButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  canvasContainer: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  canvas: { flex: 1 },
  toolbar: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingBottom: 30,
  },
  toolRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10,
  },
  toolButton: { alignItems: "center", padding: 10, borderRadius: 8, minWidth: 60 },
  toolButtonActive: { backgroundColor: "#eef2ff" },
  toolLabel: { fontSize: 11, color: "#666", marginTop: 4 },
  toolLabelActive: { color: "#6366f1", fontWeight: "600" },
  colorPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  strokePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  strokePreview: { width: 30, height: 30, justifyContent: "center", alignItems: "center", marginRight: 10 },
  colorPalette: { maxHeight: 60, marginTop: 5 },
  colorOption: {
    width: 50, height: 50, borderRadius: 25, marginHorizontal: 5,
    justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "#e5e5e5",
  },
  colorOptionSelected: { borderColor: "#6366f1", borderWidth: 3 },
  strokePalette: { maxHeight: 70, marginTop: 5 },
  strokeOption: {
    width: 60, height: 60, borderRadius: 8, marginHorizontal: 5,
    justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5",
    borderWidth: 2, borderColor: "#e5e5e5",
  },
  strokeOptionSelected: { backgroundColor: "#eef2ff", borderColor: "#6366f1" },
  strokeOptionLabel: { fontSize: 10, color: "#666", marginTop: 4 },
});