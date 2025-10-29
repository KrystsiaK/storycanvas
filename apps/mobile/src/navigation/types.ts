import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Create: undefined;
  Library: undefined;
  Profile: undefined;
};

export type CreateStackParamList = {
  CreateStart: undefined;
  CharacterCreation: undefined;
  StorySettings: undefined;
  StoryGeneration: undefined;
  StoryView: { storyId: string };
};

