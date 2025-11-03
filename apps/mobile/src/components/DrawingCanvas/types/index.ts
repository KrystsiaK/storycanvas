import { SkPath } from "@shopify/react-native-skia";

export interface PathData {
  path: SkPath;
  color: string;
  strokeWidth: number;
  tool: ToolType;
  timestamp: number;
}

export type ToolType = "pen" | "eraser" | "brush" | "marker" | "highlighter";

export type ShapeType = "circle" | "square" | "star" | "heart" | "triangle";

export interface ShapeData {
  type: ShapeType;
  x: number;
  y: number;
  size: number;
  color: string;
  strokeWidth: number;
  timestamp: number;
}

export interface StickerData {
  type: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  timestamp: number;
}

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
  backgroundColor: string;
}

export interface HistoryState {
  past: { paths: PathData[]; shapes: ShapeData[] }[];
  present: { paths: PathData[]; shapes: ShapeData[] };
  future: { paths: PathData[]; shapes: ShapeData[] }[];
}

export interface ToolConfig {
  type: ToolType;
  icon: string;
  label: string;
  defaultStrokeWidth: number;
  strokeMultiplier?: number;
}

export interface ShapeConfig {
  type: ShapeType;
  icon: string;
  label: string;
}

export interface ColorConfig {
  color: string;
  name: string;
}

export interface BrushSizeConfig {
  size: number;
  label: string;
}

