import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

interface Story {
  id: string;
  title: string;
  content: string;
  characters: Character[];
  genre: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

interface StoryState {
  currentStory: Story | null;
  stories: Story[];
  isGenerating: boolean;
  error: string | null;
}

const initialState: StoryState = {
  currentStory: null,
  stories: [],
  isGenerating: false,
  error: null,
};

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setCurrentStory: (state, action: PayloadAction<Story>) => {
      state.currentStory = action.payload;
    },
    addStory: (state, action: PayloadAction<Story>) => {
      state.stories.unshift(action.payload);
    },
    setStories: (state, action: PayloadAction<Story[]>) => {
      state.stories = action.payload;
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCurrentStory: (state) => {
      state.currentStory = null;
    },
  },
});

export const {
  setCurrentStory,
  addStory,
  setStories,
  setGenerating,
  setError,
  clearCurrentStory,
} = storySlice.actions;

export const storyReducer = storySlice.reducer;

export const selectCurrentStory = (state: RootState) => state.story.currentStory;
export const selectStories = (state: RootState) => state.story.stories;
export const selectIsGenerating = (state: RootState) => state.story.isGenerating;

