import { Skia, SkPath } from "@shopify/react-native-skia";
import { PathData, ToolType } from "../types";
import { ERASER_COLOR } from "../utils/constants";

export const pathService = {
  /**
   * Creates a new Skia path starting at given coordinates
   */
  createPath: (x: number, y: number): SkPath => {
    const path = Skia.Path.Make();
    path.moveTo(x, y);
    return path;
  },

  /**
   * Adds a line to the path and returns an immutable copy
   */
  addLineToPath: (path: SkPath, x: number, y: number): SkPath => {
    path.lineTo(x, y);
    return path.copy();
  },

  /**
   * Creates a PathData object from current drawing state
   */
  createPathData: (
    path: SkPath,
    tool: ToolType,
    color: string,
    strokeWidth: number
  ): PathData => {
    const isEraser = tool === "eraser";
    return {
      path,
      tool,
      color: isEraser ? ERASER_COLOR : color,
      strokeWidth: isEraser ? strokeWidth * 3 : strokeWidth,
      timestamp: Date.now(),
    };
  },

  /**
   * Gets the effective stroke width based on tool
   */
  getEffectiveStrokeWidth: (tool: ToolType, baseWidth: number): number => {
    switch (tool) {
      case "eraser":
        return baseWidth * 3;
      case "brush":
        return baseWidth * 1.5;
      case "marker":
        return baseWidth * 1.2;
      default:
        return baseWidth;
    }
  },

  /**
   * Gets the effective color based on tool
   */
  getEffectiveColor: (tool: ToolType, color: string): string => {
    return tool === "eraser" ? ERASER_COLOR : color;
  },

  /**
   * Validates if a path has enough points to be meaningful
   */
  isValidPath: (path: SkPath): boolean => {
    // Path should have at least some bounds
    const bounds = path.getBounds();
    return bounds.width > 0 || bounds.height > 0;
  },
};

