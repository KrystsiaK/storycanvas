import React, { useState, useCallback, useRef } from "react";
import { Modal, StyleSheet, View, Dimensions } from "react-native";
import { Header } from "./Header";
import { Canvas } from "./Canvas";
import { Toolbar } from "./Toolbar";
import { useDrawing } from "./hooks/useDrawing";
import { useHistory } from "./hooks/useHistory";
import { useCanvasState } from "./hooks/useCanvasState";
import { storageService } from "./services/storageService";
import { shapeService } from "./services/shapeService";
import { DrawingCanvasProps, PathData, ShapeData, ShapeType } from "./types";
import { DEFAULT_SHAPE_SIZE } from "./utils/constants";

const { width, height } = Dimensions.get("window");

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [paths, setPaths] = useState<PathData[]>([]);
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const canvasRef = useRef<any>(null);

  // Canvas state management
  const {
    selectedColor,
    strokeWidth,
    tool,
    backgroundColor,
    setColor,
    setStrokeWidth,
    setTool,
    setBackgroundColor,
  } = useCanvasState();

  // History management
  const {
    addToHistory,
    undo,
    redo,
    clear: clearHistory,
    canUndo,
    canRedo,
  } = useHistory({ paths: [], shapes: [] });

  // Drawing logic
  const handlePathComplete = useCallback(
    (pathData: PathData) => {
      const newPaths = [...paths, pathData];
      setPaths(newPaths);
      addToHistory({ paths: newPaths, shapes });
    },
    [paths, shapes, addToHistory]
  );

  const { currentPath, panResponder } = useDrawing({
    onPathComplete: handlePathComplete,
    tool,
    color: selectedColor,
    strokeWidth,
  });

  // Actions
  const handleUndo = useCallback(() => {
    const previousState = undo();
    if (previousState !== null) {
      setPaths(previousState.paths);
      setShapes(previousState.shapes);
    }
  }, [undo]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState !== null) {
      setPaths(nextState.paths);
      setShapes(nextState.shapes);
    }
  }, [redo]);

  const handleClear = useCallback(() => {
    storageService.showConfirmation(
      "Clear Canvas",
      "Clear everything?",
      () => {
        setPaths([]);
        setShapes([]);
        clearHistory();
      }
    );
  }, [clearHistory]);

  const handleShapeSelect = useCallback(
    (shapeType: ShapeType) => {
      // Add shape in center of canvas
      const centerX = width / 2;
      const centerY = height / 2;

      const newShape = shapeService.createShapeData(
        shapeType,
        centerX,
        centerY,
        DEFAULT_SHAPE_SIZE,
        selectedColor,
        strokeWidth
      );

      const newShapes = [...shapes, newShape];
      setShapes(newShapes);
      addToHistory({ paths, shapes: newShapes });
    },
    [shapes, paths, selectedColor, strokeWidth, addToHistory]
  );

  const handleSave = useCallback(async () => {
    if (!canvasRef.current?.current?.makeImageSnapshot) {
      storageService.showError("Canvas not ready");
      return;
    }

    const base64Data = await storageService.exportToBase64(
      () => canvasRef.current.current.makeImageSnapshot()
    );

    if (base64Data) {
      storageService.showSaveSuccess();
      onSave?.(base64Data);
    }
  }, [onSave]);

  const handleCanvasReady = useCallback((ref: any) => {
    canvasRef.current = ref;
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Header onClose={onClose} onSave={handleSave} title="Draw Hero! 🎨" />

        <Canvas
          paths={paths}
          shapes={shapes}
          currentPath={currentPath}
          currentColor={selectedColor}
          currentStrokeWidth={strokeWidth}
          currentTool={tool}
          backgroundColor={backgroundColor}
          panHandlers={panResponder.panHandlers}
          onCanvasReady={handleCanvasReady}
        />

        <Toolbar
          selectedTool={tool}
          selectedColor={selectedColor}
          strokeWidth={strokeWidth}
          backgroundColor={backgroundColor}
          onToolSelect={setTool}
          onColorSelect={setColor}
          onStrokeWidthSelect={setStrokeWidth}
          onBackgroundColorSelect={setBackgroundColor}
          onShapeSelect={handleShapeSelect}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClear}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});

// Export types for external use
export * from "./types";
export * from "./utils/constants";

