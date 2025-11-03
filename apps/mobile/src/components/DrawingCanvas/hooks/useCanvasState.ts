import { useState, useCallback } from "react";
import { ToolType, CanvasState } from "../types";
import {
  DEFAULT_COLOR,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_TOOL,
  CANVAS_BACKGROUND_COLOR,
} from "../utils/constants";

export const useCanvasState = () => {
  const [state, setState] = useState<CanvasState>({
    selectedColor: DEFAULT_COLOR,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    tool: DEFAULT_TOOL as ToolType,
    opacity: 1,
    backgroundColor: CANVAS_BACKGROUND_COLOR,
  });

  const setColor = useCallback((color: string) => {
    setState((prev) => ({ ...prev, selectedColor: color }));
  }, []);

  const setStrokeWidth = useCallback((width: number) => {
    setState((prev) => ({ ...prev, strokeWidth: width }));
  }, []);

  const setTool = useCallback((tool: ToolType) => {
    setState((prev) => ({ ...prev, tool }));
  }, []);

  const setOpacity = useCallback((opacity: number) => {
    setState((prev) => ({ ...prev, opacity }));
  }, []);

  const setBackgroundColor = useCallback((color: string) => {
    setState((prev) => ({ ...prev, backgroundColor: color }));
  }, []);

  const toggleTool = useCallback((tool: ToolType) => {
    setState((prev) => ({
      ...prev,
      tool: prev.tool === tool ? (DEFAULT_TOOL as ToolType) : tool,
    }));
  }, []);

  return {
    ...state,
    setColor,
    setStrokeWidth,
    setTool,
    setOpacity,
    setBackgroundColor,
    toggleTool,
  };
};

