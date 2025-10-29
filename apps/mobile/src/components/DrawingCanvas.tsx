import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import SketchCanvas from '@terrylinla/react-native-sketch-canvas';
import { MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DrawingCanvasProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (imagePath: string) => void;
}

const COLORS = [
  '#000000', // Black
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#FFC0CB', // Pink
  '#A52A2A', // Brown
  '#808080', // Gray
  '#FFFFFF', // White
];

const STROKE_WIDTHS = [2, 5, 10, 15, 20, 30];

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const canvasRef = useRef<any>(null);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokePicker, setShowStrokePicker] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const handleRedo = () => {
    canvasRef.current?.redo();
  };

  const handleClear = () => {
    Alert.alert(
      'Clear Canvas',
      'Are you sure you want to clear everything?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => canvasRef.current?.clear(),
        },
      ]
    );
  };

  const handleSave = async () => {
    try {
      const result = await canvasRef.current?.save(
        'png',
        false,
        'StoryCanvas',
        `drawing_${Date.now()}`,
        true,
        false,
        false
      );
      
      if (result) {
        Alert.alert('Success', 'Drawing saved successfully!');
        if (onSave) {
          onSave(result.path);
        }
      }
    } catch (error) {
      console.error('Error saving drawing:', error);
      Alert.alert('Error', 'Failed to save drawing');
    }
  };

  const selectColor = (color: string) => {
    setSelectedColor(color);
    setShowColorPicker(false);
    setTool('pen');
  };

  const selectStrokeWidth = (width: number) => {
    setStrokeWidth(width);
    setShowStrokePicker(false);
  };

  const toggleEraser = () => {
    if (tool === 'eraser') {
      setTool('pen');
    } else {
      setTool('eraser');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <MaterialIcons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Draw Your Story</Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <MaterialIcons name="save" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Canvas */}
        <View style={styles.canvasContainer}>
          <SketchCanvas
            ref={canvasRef}
            style={styles.canvas}
            strokeColor={tool === 'eraser' ? '#FFFFFF' : selectedColor}
            strokeWidth={tool === 'eraser' ? strokeWidth * 3 : strokeWidth}
            user="user_001"
            touchEnabled={true}
          />
        </View>

        {/* Toolbar */}
        <View style={styles.toolbar}>
          {/* Main Actions Row */}
          <View style={styles.toolRow}>
            <TouchableOpacity
              style={styles.toolButton}
              onPress={handleUndo}
            >
              <MaterialIcons name="undo" size={24} color="#333" />
              <Text style={styles.toolLabel}>Undo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolButton}
              onPress={handleRedo}
            >
              <MaterialIcons name="redo" size={24} color="#333" />
              <Text style={styles.toolLabel}>Redo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolButton,
                tool === 'pen' && styles.toolButtonActive,
              ]}
              onPress={() => setTool('pen')}
            >
              <MaterialIcons name="create" size={24} color={tool === 'pen' ? '#6366f1' : '#333'} />
              <Text style={[styles.toolLabel, tool === 'pen' && styles.toolLabelActive]}>Pen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolButton,
                tool === 'eraser' && styles.toolButtonActive,
              ]}
              onPress={toggleEraser}
            >
              <MaterialIcons name="clear" size={24} color={tool === 'eraser' ? '#6366f1' : '#333'} />
              <Text style={[styles.toolLabel, tool === 'eraser' && styles.toolLabelActive]}>Eraser</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolButton}
              onPress={handleClear}
            >
              <MaterialIcons name="delete" size={24} color="#ef4444" />
              <Text style={[styles.toolLabel, { color: '#ef4444' }]}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Color Picker Row */}
          <View style={styles.toolRow}>
            <TouchableOpacity
              style={styles.colorPickerButton}
              onPress={() => setShowColorPicker(!showColorPicker)}
            >
              <View style={[styles.colorPreview, { backgroundColor: selectedColor }]} />
              <Text style={styles.toolLabel}>Color</Text>
              <MaterialIcons 
                name={showColorPicker ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.strokePickerButton}
              onPress={() => setShowStrokePicker(!showStrokePicker)}
            >
              <View style={styles.strokePreview}>
                <View
                  style={{
                    width: strokeWidth,
                    height: strokeWidth,
                    borderRadius: strokeWidth / 2,
                    backgroundColor: selectedColor,
                  }}
                />
              </View>
              <Text style={styles.toolLabel}>Size: {strokeWidth}px</Text>
              <MaterialIcons 
                name={showStrokePicker ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          {/* Color Palette */}
          {showColorPicker && (
            <ScrollView 
              horizontal 
              style={styles.colorPalette}
              showsHorizontalScrollIndicator={false}
            >
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => selectColor(color)}
                >
                  {selectedColor === color && (
                    <MaterialIcons name="check" size={20} color={color === '#FFFFFF' ? '#000' : '#fff'} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Stroke Width Picker */}
          {showStrokePicker && (
            <ScrollView 
              horizontal 
              style={styles.strokePalette}
              showsHorizontalScrollIndicator={false}
            >
              {STROKE_WIDTHS.map((width) => (
                <TouchableOpacity
                  key={width}
                  style={[
                    styles.strokeOption,
                    strokeWidth === width && styles.strokeOptionSelected,
                  ]}
                  onPress={() => selectStrokeWidth(width)}
                >
                  <View
                    style={{
                      width: width,
                      height: width,
                      borderRadius: width / 2,
                      backgroundColor: '#333',
                    }}
                  />
                  <Text style={styles.strokeOptionLabel}>{width}px</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  canvas: {
    flex: 1,
  },
  toolbar: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingBottom: 30,
  },
  toolRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  toolButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    minWidth: 60,
  },
  toolButtonActive: {
    backgroundColor: '#eef2ff',
  },
  toolLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  toolLabelActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
  colorPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  strokePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  strokePreview: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  colorPalette: {
    maxHeight: 60,
    marginTop: 5,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#e5e5e5',
  },
  colorOptionSelected: {
    borderColor: '#6366f1',
    borderWidth: 3,
  },
  strokePalette: {
    maxHeight: 70,
    marginTop: 5,
  },
  strokeOption: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e5e5e5',
  },
  strokeOptionSelected: {
    backgroundColor: '#eef2ff',
    borderColor: '#6366f1',
  },
  strokeOptionLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
});

