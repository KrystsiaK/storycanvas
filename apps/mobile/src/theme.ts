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
  fonts: {
    ...DefaultTheme.fonts,
    displayLarge: {
      ...DefaultTheme.fonts.displayLarge,
      fontFamily: 'System',
    },
    displayMedium: {
      ...DefaultTheme.fonts.displayMedium,
      fontFamily: 'System',
    },
    displaySmall: {
      ...DefaultTheme.fonts.displaySmall,
      fontFamily: 'System',
    },
    headlineLarge: {
      ...DefaultTheme.fonts.headlineLarge,
      fontFamily: 'System',
    },
    headlineMedium: {
      ...DefaultTheme.fonts.headlineMedium,
      fontFamily: 'System',
    },
    headlineSmall: {
      ...DefaultTheme.fonts.headlineSmall,
      fontFamily: 'System',
    },
    titleLarge: {
      ...DefaultTheme.fonts.titleLarge,
      fontFamily: 'System',
    },
    titleMedium: {
      ...DefaultTheme.fonts.titleMedium,
      fontFamily: 'System',
    },
    titleSmall: {
      ...DefaultTheme.fonts.titleSmall,
      fontFamily: 'System',
    },
    bodyLarge: {
      ...DefaultTheme.fonts.bodyLarge,
      fontFamily: 'System',
    },
    bodyMedium: {
      ...DefaultTheme.fonts.bodyMedium,
      fontFamily: 'System',
    },
    bodySmall: {
      ...DefaultTheme.fonts.bodySmall,
      fontFamily: 'System',
    },
    labelLarge: {
      ...DefaultTheme.fonts.labelLarge,
      fontFamily: 'System',
    },
    labelMedium: {
      ...DefaultTheme.fonts.labelMedium,
      fontFamily: 'System',
    },
    labelSmall: {
      ...DefaultTheme.fonts.labelSmall,
      fontFamily: 'System',
    },
  },
};

export type AppTheme = typeof theme;

