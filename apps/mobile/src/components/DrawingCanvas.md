# 🎨 Drawing Canvas Component

## Features

### Core Drawing
- ✏️ **Pen Tool** - Smooth drawing with finger/stylus
- 🧽 **Eraser Tool** - Triple-width eraser for easy corrections
- 🎨 **13 Colors** - Full color palette including:
  - Black, Red, Green, Blue
  - Yellow, Magenta, Cyan
  - Orange, Purple, Pink
  - Brown, Gray, White

### Brush Sizes
- 📏 **6 Stroke Widths** - 2px, 5px, 10px, 15px, 20px, 30px
- Real-time preview of selected size

### Canvas Controls
- ↩️ **Undo** - Step back through drawing history
- ↪️ **Redo** - Step forward through history
- 🗑️ **Clear** - Clear entire canvas with confirmation
- 💾 **Save** - Export drawing as PNG image

### UI/UX
- 📱 **Full-screen modal** - Maximized drawing area
- 🎯 **Touch optimized** - Smooth drawing performance
- 🎨 **Color picker** - Expandable horizontal scroll palette
- 📐 **Size picker** - Visual size selection
- ✨ **Active tool highlight** - Clear visual feedback
- 🔒 **Safe close** - Modal with proper dismissal

## Usage

```tsx
import { DrawingCanvas } from '../components/DrawingCanvas';

const [showCanvas, setShowCanvas] = useState(false);

<Button onPress={() => setShowCanvas(true)}>
  🎨 Draw Your Hero
</Button>

<DrawingCanvas
  visible={showCanvas}
  onClose={() => setShowCanvas(false)}
  onSave={(imagePath) => {
    console.log('Drawing saved to:', imagePath);
  }}
/>
```

## Technical Details

### Library
- **@terrylinla/react-native-sketch-canvas** - Professional drawing library
- Works on iOS, Android, and Web
- Hardware-accelerated rendering
- Smooth touch response

### Performance
- Optimized for mobile devices
- Minimal re-renders
- Efficient path handling
- Smooth animations

### Integration Points
- Can integrate with OpenAI for hero generation from drawings
- Saved images can be uploaded to backend
- Images stored in device's photo gallery
- Path returned for further processing

## Future Enhancements (Ideas)

### Drawing Features
- [ ] Shapes tool (circle, rectangle, star)
- [ ] Fill bucket tool
- [ ] Text tool with fonts
- [ ] Stickers/stamps
- [ ] Layers support
- [ ] Opacity/alpha control
- [ ] Blur tool
- [ ] Color picker with custom colors
- [ ] Gradient brushes

### Advanced Features
- [ ] Background images/templates
- [ ] Import existing images
- [ ] Symmetry mode (mirror drawing)
- [ ] Grid/guides overlay
- [ ] Zoom/pan canvas
- [ ] Selection tool (move/resize)
- [ ] Drawing tutorials/hints
- [ ] Pressure sensitivity (for stylus)
- [ ] Gesture shortcuts
- [ ] Drawing time-lapse replay

### Sharing & Export
- [ ] Share to social media
- [ ] Export different formats (JPG, SVG)
- [ ] Export different resolutions
- [ ] Save to cloud storage
- [ ] Collaborative drawing (multiplayer)

### AI Integration
- [ ] Convert drawing to story character
- [ ] AI auto-complete sketches
- [ ] Style transfer (make drawing look professional)
- [ ] Background removal
- [ ] Colorization suggestions

## Notes for Developers

### Refs
- `canvasRef` provides access to canvas methods
- Key methods: `undo()`, `redo()`, `clear()`, `save()`

### State Management
- Local state for UI controls
- Modal visibility controlled by parent
- Save callback returns image path

### Styling
- Uses functional design with Indigo accent (#6366f1)
- Responsive to screen size
- Safe area handling for notched devices

### Dependencies
- @terrylinla/react-native-sketch-canvas
- @expo/vector-icons (MaterialIcons)
- react-native-paper (for consistent design)

## Known Limitations

1. **No native web canvas** - Uses library's web implementation
2. **Eraser is white color** - Not true transparency (limitation of library)
3. **No vector export** - Only raster images (PNG)
4. **Single layer** - No layer management yet

## Testing

Test the component by:
1. Drawing with different colors
2. Trying different brush sizes
3. Using undo/redo extensively
4. Testing eraser tool
5. Clearing canvas
6. Saving drawing
7. Opening/closing modal multiple times
8. Testing on different screen sizes

## References

- Library docs: https://github.com/terrylinla/react-native-sketch-canvas
- React Native Paper: https://reactnativepaper.com/
- Expo Vector Icons: https://icons.expo.fyi/

