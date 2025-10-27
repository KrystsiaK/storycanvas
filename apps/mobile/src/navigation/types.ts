import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
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

export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  StoryDetail: {
    story: {
      id: string;
      title: string;
      content: string;
      genre: string;
      language: string;
      ageGroup: string;
      theme?: string;
      moralLesson?: string;
      audioUrl?: string | null;
      videoUrl?: string | null;
      pdfUrl?: string | null;
    };
  };
};

export type CreateStackParamList = {
  CreateStart: undefined;
  CharacterCreation: undefined;
  StorySettings: undefined;
  StoryGeneration: undefined;
  StoryView: { storyId: string };
};

