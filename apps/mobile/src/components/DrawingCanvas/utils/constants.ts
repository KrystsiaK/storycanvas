import { ToolConfig, ColorConfig, BrushSizeConfig } from "../types";

export const COLORS: ColorConfig[] = [
  { color: "#000000", name: "Black" },
  { color: "#FF0000", name: "Red" },
  { color: "#00FF00", name: "Green" },
  { color: "#0000FF", name: "Blue" },
  { color: "#FFFF00", name: "Yellow" },
  { color: "#FF00FF", name: "Magenta" },
  { color: "#00FFFF", name: "Cyan" },
  { color: "#FFA500", name: "Orange" },
  { color: "#800080", name: "Purple" },
  { color: "#FFC0CB", name: "Pink" },
  { color: "#A52A2A", name: "Brown" },
  { color: "#808080", name: "Gray" },
  { color: "#FFFFFF", name: "White" },
];

export const BRUSH_SIZES: BrushSizeConfig[] = [
  { size: 2, label: "2px" },
  { size: 5, label: "5px" },
  { size: 10, label: "10px" },
  { size: 15, label: "15px" },
  { size: 20, label: "20px" },
  { size: 30, label: "30px" },
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
  {
    type: "brush",
    icon: "brush",
    label: "Brush",
    defaultStrokeWidth: 10,
  },
  {
    type: "marker",
    icon: "border-color",
    label: "Marker",
    defaultStrokeWidth: 8,
  },
];

export const DEFAULT_COLOR = "#000000";
export const DEFAULT_STROKE_WIDTH = 5;
export const DEFAULT_TOOL = "pen";
export const ERASER_COLOR = "#FFFFFF";
export const MAX_HISTORY_SIZE = 100;

export const CANVAS_BACKGROUND_COLOR = "white";
export const THEME_COLOR = "#6366f1";
export const ERROR_COLOR = "#ef4444";

