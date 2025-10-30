import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import Svg, { Path, G } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_SIZE = Math.min(SCREEN_WIDTH - 32, 400);

interface PathData {
  path: string;
  color: string;
  width: number;
}

interface DrawingCanvasProps {
  onSave?: (imageData: string) => void;
  onClear?: () => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onSave, onClear }) => {
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [strokeColor, setStrokeColor] = useState<string>('#000000');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  
  const svgRef = useRef<any>(null);

  const colors = [
    '#000000', // Black
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF6B9D', // Pink
    '#8B4513', // Brown
    '#FFA500', // Orange
  ];

  const widths = [2, 3, 5, 8];

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath(`M ${locationX},${locationY}`);
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath((prev) => `${prev} L ${locationX},${locationY}`);
    },
    onPanResponderRelease: () => {
      if (currentPath) {
        setPaths((prev) => [
          ...prev,
          { path: currentPath, color: strokeColor, width: strokeWidth },
        ]);
        setCurrentPath('');
      }
    },
  });

  const handleClear = () => {
    setPaths([]);
    setCurrentPath('');
    onClear?.();
  };

  const handleUndo = () => {
    setPaths((prev) => prev.slice(0, -1));
  };

  const handleSave = () => {
    // For now, we'll save the SVG paths as JSON
    // In a real app, you'd convert the SVG to an image
    const drawingData = JSON.stringify({
      paths,
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
    });
    onSave?.(drawingData);
  };

  return (
    <View style={styles.container}>
      {/* Canvas */}
      <View style={[styles.canvas, { width: CANVAS_SIZE, height: CANVAS_SIZE }]} {...panResponder.panHandlers}>
        <Svg width={CANVAS_SIZE} height={CANVAS_SIZE} ref={svgRef}>
          <G>
            {paths.map((pathData, index) => (
              <Path
                key={index}
                d={pathData.path}
                stroke={pathData.color}
                strokeWidth={pathData.width}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {currentPath && (
              <Path
                d={currentPath}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </G>
        </Svg>
      </View>

      {/* Color Palette */}
      <View style={styles.toolbar}>
        <View style={styles.colorPalette}>
          {colors.map((color) => (
            <IconButton
              key={color}
              icon="circle"
              iconColor={color}
              size={24}
              onPress={() => setStrokeColor(color)}
              style={[
                styles.colorButton,
                strokeColor === color && styles.selectedColor,
              ]}
            />
          ))}
        </View>

        {/* Brush Size Selector */}
        <View style={styles.widthSelector}>
          {widths.map((width) => (
            <IconButton
              key={width}
              icon="circle"
              iconColor={strokeColor}
              size={width * 3}
              onPress={() => setStrokeWidth(width)}
              style={[
                styles.widthButton,
                strokeWidth === width && styles.selectedWidth,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button mode="outlined" onPress={handleUndo} disabled={paths.length === 0} icon="undo">
          Undo
        </Button>
        <Button mode="outlined" onPress={handleClear} disabled={paths.length === 0} icon="delete">
          Clear
        </Button>
        <Button mode="contained" onPress={handleSave} disabled={paths.length === 0} buttonColor="#FF6B9D" icon="check">
          Save
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  canvas: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  toolbar: {
    width: CANVAS_SIZE,
    marginBottom: 16,
  },
  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  colorButton: {
    margin: 4,
  },
  selectedColor: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  widthSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  widthButton: {
    margin: 4,
  },
  selectedWidth: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: CANVAS_SIZE,
    gap: 8,
  },
});
