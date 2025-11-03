import { ToolConfig, ColorConfig, BrushSizeConfig, ShapeConfig } from "../types";

export const COLORS: ColorConfig[] = [
  { color: "#FF0000", name: "Red" },
  { color: "#FFA500", name: "Orange" },
  { color: "#FFFF00", name: "Yellow" },
  { color: "#00FF00", name: "Green" },
  { color: "#0000FF", name: "Blue" },
  { color: "#800080", name: "Purple" },
  { color: "#FFC0CB", name: "Pink" },
  { color: "#A52A2A", name: "Brown" },
  { color: "#000000", name: "Black" },
  { color: "#808080", name: "Gray" },
  { color: "#FFFFFF", name: "White" },
];

export const BRUSH_SIZES: BrushSizeConfig[] = [
  { size: 5, label: "Small" },
  { size: 10, label: "Medium" },
  { size: 20, label: "Large" },
  { size: 30, label: "Huge" },
];

export const TOOLS: ToolConfig[] = [
  {
    type: "pen",
    icon: "create",
    label: "Pen",
    defaultStrokeWidth: 5,
  },
  {
    type: "eraser",
    icon: "clear",
    label: "Eraser",
    defaultStrokeWidth: 15,
    strokeMultiplier: 3,
  },
];

export const SHAPES: ShapeConfig[] = [
  { type: "circle", icon: "radio-button-unchecked", label: "Circle" },
  { type: "square", icon: "crop-square", label: "Square" },
  { type: "star", icon: "star-outline", label: "Star" },
  { type: "heart", icon: "favorite-border", label: "Heart" },
  { type: "triangle", icon: "change-history", label: "Triangle" },
];

export const BACKGROUND_COLORS: ColorConfig[] = [
  { color: "#FFFFFF", name: "White" },
  { color: "#E3F2FD", name: "Sky Blue" },
  { color: "#F1F8E9", name: "Light Green" },
  { color: "#FFF9C4", name: "Light Yellow" },
  { color: "#FFE0B2", name: "Peach" },
  { color: "#F3E5F5", name: "Lavender" },
  { color: "#FCE4EC", name: "Pink" },
];

export const DEFAULT_COLOR = "#FF0000";
export const DEFAULT_STROKE_WIDTH = 10;
export const DEFAULT_TOOL = "pen";
export const DEFAULT_SHAPE_SIZE = 80;
export const ERASER_COLOR = "#FFFFFF";
export const MAX_HISTORY_SIZE = 50;

export const CANVAS_BACKGROUND_COLOR = "white";
export const THEME_COLOR = "#6366f1";
export const ERROR_COLOR = "#ef4444";

