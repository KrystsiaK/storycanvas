import React from "react";
import { View, StyleSheet, ViewStyle, Dimensions } from "react-native";
import {
  Canvas as SkiaCanvas,
  Path,
  Rect,
  useCanvasRef,
} from "@shopify/react-native-skia";
import { PathData, ShapeData } from "./types";
import { pathService } from "./services/pathService";
import { shapeService } from "./services/shapeService";

const { width, height } = Dimensions.get("window");

interface CanvasProps {
  paths: PathData[];
  shapes: ShapeData[];
  currentPath: any;
  currentColor: string;
  currentStrokeWidth: number;
  currentTool: string;
  backgroundColor: string;
  panHandlers: any;
  style?: ViewStyle;
  onCanvasReady?: (ref: any) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  paths,
  shapes,
  currentPath,
  currentColor,
  currentStrokeWidth,
  currentTool,
  backgroundColor,
  panHandlers,
  style,
  onCanvasReady,
}) => {
  const canvasRef = useCanvasRef();

  React.useEffect(() => {
    if (canvasRef.current && onCanvasReady) {
      onCanvasReady(canvasRef);
    }
  }, [canvasRef, onCanvasReady]);

  return (
    <View style={[styles.container, style]} {...panHandlers}>
      <SkiaCanvas ref={canvasRef} style={styles.canvas} pointerEvents="none">
        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          color={backgroundColor}
        />

        {/* Completed paths */}
        {paths.map((pathData, index) => (
          <Path
            key={`path-${pathData.timestamp}-${index}`}
            path={pathData.path}
            color={pathData.color}
            style="stroke"
            strokeWidth={pathData.strokeWidth}
            strokeCap="round"
            strokeJoin="round"
          />
        ))}

        {/* Shapes */}
        {shapes.map((shapeData, index) => (
          <Path
            key={`shape-${shapeData.timestamp}-${index}`}
            path={shapeService.createShape(
              shapeData.type,
              shapeData.x,
              shapeData.y,
              shapeData.size
            )}
            color={shapeData.color}
            style="fill"
          />
        ))}

        {/* Current drawing path */}
        {currentPath && (
          <Path
            path={currentPath}
            color={pathService.getEffectiveColor(currentTool as any, currentColor)}
            style="stroke"
            strokeWidth={pathService.getEffectiveStrokeWidth(
              currentTool as any,
              currentStrokeWidth
            )}
            strokeCap="round"
            strokeJoin="round"
          />
        )}
      </SkiaCanvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 12,
    overflow: "hidden",
    // Custom cursor style hint
    cursor: "crosshair" as any,
  },
  canvas: {
    flex: 1,
  },
});

