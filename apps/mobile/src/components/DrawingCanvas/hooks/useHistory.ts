import { useState, useCallback, useRef } from "react";
import { PathData, ShapeData } from "../types";
import { MAX_HISTORY_SIZE } from "../utils/constants";

interface HistoryEntry {
  paths: PathData[];
  shapes: ShapeData[];
}

export const useHistory = (initialState: HistoryEntry = { paths: [], shapes: [] }) => {
  const historyRef = useRef<HistoryEntry[]>([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addToHistory = useCallback(
    (newState: HistoryEntry) => {
      // Remove future states if we're not at the end
      historyRef.current = historyRef.current.slice(0, historyIndex + 1);
      
      // Deep clone to avoid reference issues
      const clonedState = {
        paths: [...newState.paths],
        shapes: [...newState.shapes],
      };
      
      // Add new state
      historyRef.current.push(clonedState);
      
      // Limit history size
      if (historyRef.current.length > MAX_HISTORY_SIZE) {
        historyRef.current = historyRef.current.slice(-MAX_HISTORY_SIZE);
      }
      
      setHistoryIndex(historyRef.current.length - 1);
    },
    [historyIndex]
  );

  const undo = useCallback((): HistoryEntry | null => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      return historyRef.current[newIndex];
    }
    return null;
  }, [historyIndex]);

  const redo = useCallback((): HistoryEntry | null => {
    if (historyIndex < historyRef.current.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      return historyRef.current[newIndex];
    }
    return null;
  }, [historyIndex]);

  const clear = useCallback(() => {
    historyRef.current = [{ paths: [], shapes: [] }];
    setHistoryIndex(0);
  }, []);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyRef.current.length - 1;

  return {
    addToHistory,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
    historyIndex,
  };
};

