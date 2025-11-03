import { SkPath } from "@shopify/react-native-skia";

export interface PathData {
  path: SkPath;
  color: string;
  strokeWidth: number;
  tool: ToolType;
  timestamp: number;
}

export type ToolType = "pen" | "eraser" | "brush" | "marker" | "highlighter";

export interface DrawingCanvasProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (imagePath: string) => void;
}

export interface CanvasState {
  selectedColor: string;
  strokeWidth: number;
  tool: ToolType;
  opacity: number;
}

export interface HistoryState {
  past: PathData[][];
  present: PathData[];
  future: PathData[][];
}

export interface ToolConfig {
  type: ToolType;
  icon: string;
  label: string;
  defaultStrokeWidth: number;
  strokeMultiplier?: number;
}

export interface ColorConfig {
  color: string;
  name: string;
}

export interface BrushSizeConfig {
  size: number;
  label: string;
}

