import { useState, useCallback, useRef } from "react";
import { PathData } from "../types";
import { MAX_HISTORY_SIZE } from "../utils/constants";

export const useHistory = (initialPaths: PathData[] = []) => {
  const historyRef = useRef<PathData[][]>([initialPaths]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addToHistory = useCallback(
    (newPaths: PathData[]) => {
      // Remove future states if we're not at the end
      historyRef.current = historyRef.current.slice(0, historyIndex + 1);
      
      // Add new state
      historyRef.current.push(newPaths);
      
      // Limit history size
      if (historyRef.current.length > MAX_HISTORY_SIZE) {
        historyRef.current = historyRef.current.slice(-MAX_HISTORY_SIZE);
      }
      
      setHistoryIndex(historyRef.current.length - 1);
    },
    [historyIndex]
  );

  const undo = useCallback((): PathData[] | null => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      return historyRef.current[newIndex];
    }
    return null;
  }, [historyIndex]);

  const redo = useCallback((): PathData[] | null => {
    if (historyIndex < historyRef.current.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      return historyRef.current[newIndex];
    }
    return null;
  }, [historyIndex]);

  const clear = useCallback(() => {
    historyRef.current = [[]];
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

