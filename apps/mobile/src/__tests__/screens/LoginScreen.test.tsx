import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { LoginScreen } from '../../screens/auth/LoginScreen';
import { authReducer } from '../../store/slices/authSlice';
import { api } from '../../services/api';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('LoginScreen', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        [api.reducerPath]: api.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
    });
    mockNavigate.mockClear();
  });

  const renderLoginScreen = () => {
    return render(
      <Provider store={store}>
        <NavigationContainer>
          <LoginScreen navigation={mockNavigate as any} route={{} as any} />
        </NavigationContainer>
      </Provider>
    );
  };

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = renderLoginScreen();
    
    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Sign in to continue your storytelling journey')).toBeTruthy();
  });

  it('renders without crashing', () => {
    const { toJSON } = renderLoginScreen();
    
    expect(toJSON()).toBeTruthy();
  });

  it('has sign in button', () => {
    const { getByText } = renderLoginScreen();
    
    const signInButton = getByText('Sign In');
    expect(signInButton).toBeTruthy();
  });

  it('has navigation to register screen', () => {
    const { getByText } = renderLoginScreen();
    
    const registerLink = getByText("Don't have an account? Sign Up");
    expect(registerLink).toBeTruthy();
  });

  it('has submit button', () => {
    const { getByText } = renderLoginScreen();
    
    const signInButton = getByText('Sign In');
    expect(signInButton).toBeTruthy();
  });
});

