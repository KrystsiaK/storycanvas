import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF6B9D', // Playful pink
    secondary: '#4ECDC4', // Turquoise
    tertiary: '#FFE66D', // Sunny yellow
    background: '#FFFFFF',
    surface: '#F8F9FA',
    error: '#FF5252',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#1A1A1A',
    onSurface: '#1A1A1A',
  },
  roundness: 16,
  fonts: DefaultTheme.fonts,
};

export type AppTheme = typeof theme;

