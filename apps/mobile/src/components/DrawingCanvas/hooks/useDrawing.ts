import { useState, useRef, useCallback } from "react";
import { PanResponder } from "react-native";
import { SkPath } from "@shopify/react-native-skia";
import { PathData, ToolType } from "../types";
import { pathService } from "../services/pathService";

interface UseDrawingProps {
  onPathComplete?: (path: PathData) => void;
  tool: ToolType;
  color: string;
  strokeWidth: number;
}

export const useDrawing = ({
  onPathComplete,
  tool,
  color,
  strokeWidth,
}: UseDrawingProps) => {
  const [currentPath, setCurrentPath] = useState<SkPath | null>(null);
  const currentPathRef = useRef<SkPath | null>(null);

  // Refs for latest values (to avoid stale closures in PanResponder)
  const toolRef = useRef(tool);
  const colorRef = useRef(color);
  const strokeWidthRef = useRef(strokeWidth);

  // Update refs when props change
  toolRef.current = tool;
  colorRef.current = color;
  strokeWidthRef.current = strokeWidth;

  const handleTouchStart = useCallback((x: number, y: number) => {
    const path = pathService.createPath(x, y);
    currentPathRef.current = path;
    setCurrentPath(path);
  }, []);

  const handleTouchMove = useCallback((x: number, y: number) => {
    const current = currentPathRef.current;
    if (current) {
      const updated = pathService.addLineToPath(current, x, y);
      currentPathRef.current = updated;
      setCurrentPath(updated);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const current = currentPathRef.current;
    if (current && pathService.isValidPath(current)) {
      const pathData = pathService.createPathData(
        current,
        toolRef.current,
        colorRef.current,
        strokeWidthRef.current
      );
      
      onPathComplete?.(pathData);
      
      currentPathRef.current = null;
      setCurrentPath(null);
    }
  }, [onPathComplete]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        handleTouchStart(locationX, locationY);
      },
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        handleTouchMove(locationX, locationY);
      },
      onPanResponderRelease: () => {
        handleTouchEnd();
      },
    })
  ).current;

  const clearCurrentPath = useCallback(() => {
    currentPathRef.current = null;
    setCurrentPath(null);
  }, []);

  return {
    currentPath,
    panResponder,
    clearCurrentPath,
  };
};

