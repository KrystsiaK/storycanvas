import { Skia } from "@shopify/react-native-skia";
import { ShapeType, ShapeData } from "../types";

export const shapeService = {
  /**
   * Creates a path for a circle
   */
  createCircle: (x: number, y: number, size: number) => {
    const path = Skia.Path.Make();
    path.addCircle(x, y, size / 2);
    return path;
  },

  /**
   * Creates a path for a square
   */
  createSquare: (x: number, y: number, size: number) => {
    const path = Skia.Path.Make();
    const half = size / 2;
    path.addRect({
      x: x - half,
      y: y - half,
      width: size,
      height: size,
    });
    return path;
  },

  /**
   * Creates a path for a star (5-pointed)
   */
  createStar: (x: number, y: number, size: number) => {
    const path = Skia.Path.Make();
    const outerRadius = size / 2;
    const innerRadius = outerRadius * 0.4;
    const points = 5;

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI * i) / points - Math.PI / 2;
      const px = x + radius * Math.cos(angle);
      const py = y + radius * Math.sin(angle);

      if (i === 0) {
        path.moveTo(px, py);
      } else {
        path.lineTo(px, py);
      }
    }
    path.close();
    return path;
  },

  /**
   * Creates a path for a heart
   */
  createHeart: (x: number, y: number, size: number) => {
    const path = Skia.Path.Make();
    const scale = size / 100;

    // Heart shape (simplified)
    path.moveTo(x, y + 20 * scale);

    // Left curve
    path.cubicTo(
      x - 50 * scale,
      y - 20 * scale,
      x - 50 * scale,
      y + 20 * scale,
      x,
      y + 50 * scale
    );

    // Right curve
    path.cubicTo(
      x + 50 * scale,
      y + 20 * scale,
      x + 50 * scale,
      y - 20 * scale,
      x,
      y + 20 * scale
    );

    path.close();
    return path;
  },

  /**
   * Creates a path for a triangle
   */
  createTriangle: (x: number, y: number, size: number) => {
    const path = Skia.Path.Make();
    const half = size / 2;
    const height = (size * Math.sqrt(3)) / 2;

    // Top point
    path.moveTo(x, y - height / 2);
    // Bottom right
    path.lineTo(x + half, y + height / 2);
    // Bottom left
    path.lineTo(x - half, y + height / 2);
    path.close();

    return path;
  },

  /**
   * Creates a shape path based on type
   */
  createShape: (type: ShapeType, x: number, y: number, size: number) => {
    switch (type) {
      case "circle":
        return shapeService.createCircle(x, y, size);
      case "square":
        return shapeService.createSquare(x, y, size);
      case "star":
        return shapeService.createStar(x, y, size);
      case "heart":
        return shapeService.createHeart(x, y, size);
      case "triangle":
        return shapeService.createTriangle(x, y, size);
      default:
        return shapeService.createCircle(x, y, size);
    }
  },

  /**
   * Creates ShapeData from parameters
   */
  createShapeData: (
    type: ShapeType,
    x: number,
    y: number,
    size: number,
    color: string,
    strokeWidth: number
  ): ShapeData => {
    return {
      type,
      x,
      y,
      size,
      color,
      strokeWidth,
      timestamp: Date.now(),
    };
  },
};

