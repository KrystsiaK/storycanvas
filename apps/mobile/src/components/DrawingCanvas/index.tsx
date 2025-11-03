import React, { useState, useCallback, useRef } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Header } from "./Header";
import { Canvas } from "./Canvas";
import { Toolbar } from "./Toolbar";
import { useDrawing } from "./hooks/useDrawing";
import { useHistory } from "./hooks/useHistory";
import { useCanvasState } from "./hooks/useCanvasState";
import { storageService } from "./services/storageService";
import { DrawingCanvasProps, PathData } from "./types";

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [paths, setPaths] = useState<PathData[]>([]);
  const canvasRef = useRef<any>(null);

  // Canvas state management
  const {
    selectedColor,
    strokeWidth,
    tool,
    setColor,
    setStrokeWidth,
    setTool,
  } = useCanvasState();

  // History management
  const {
    addToHistory,
    undo,
    redo,
    clear: clearHistory,
    canUndo,
    canRedo,
  } = useHistory([]);

  // Drawing logic
  const handlePathComplete = useCallback(
    (pathData: PathData) => {
      const newPaths = [...paths, pathData];
      setPaths(newPaths);
      addToHistory(newPaths);
    },
    [paths, addToHistory]
  );

  const { currentPath, panResponder } = useDrawing({
    onPathComplete: handlePathComplete,
    tool,
    color: selectedColor,
    strokeWidth,
  });

  // Actions
  const handleUndo = useCallback(() => {
    const previousPaths = undo();
    if (previousPaths !== null) {
      setPaths(previousPaths);
    }
  }, [undo]);

  const handleRedo = useCallback(() => {
    const nextPaths = redo();
    if (nextPaths !== null) {
      setPaths(nextPaths);
    }
  }, [redo]);

  const handleClear = useCallback(() => {
    storageService.showConfirmation(
      "Clear Canvas",
      "Are you sure you want to clear everything?",
      () => {
        setPaths([]);
        clearHistory();
      }
    );
  }, [clearHistory]);

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
        <Header onClose={onClose} onSave={handleSave} />

        <Canvas
          paths={paths}
          currentPath={currentPath}
          currentColor={selectedColor}
          currentStrokeWidth={strokeWidth}
          currentTool={tool}
          panHandlers={panResponder.panHandlers}
          onCanvasReady={handleCanvasReady}
        />

        <Toolbar
          selectedTool={tool}
          selectedColor={selectedColor}
          strokeWidth={strokeWidth}
          onToolSelect={setTool}
          onColorSelect={setColor}
          onStrokeWidthSelect={setStrokeWidth}
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

