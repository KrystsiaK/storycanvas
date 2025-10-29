import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator } from 'react-native-paper';

import { store, persistor } from './src/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { theme } from './src/theme';

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </PaperProvider>
        </SafeAreaProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

export default App;

