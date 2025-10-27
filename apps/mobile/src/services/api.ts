import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

console.log('🌐 API_BASE_URL:', API_BASE_URL);
console.log('🌐 process.env.EXPO_PUBLIC_API_BASE_URL:', process.env.EXPO_PUBLIC_API_BASE_URL);
console.log('🌐 process.env.API_BASE_URL:', process.env.API_BASE_URL);

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Story', 'User'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    
    // Story endpoints
    generateStory: builder.mutation({
      query: (storyParams) => ({
        url: '/stories/generate',
        method: 'POST',
        body: storyParams,
      }),
      invalidatesTags: ['Story'],
    }),
    getStories: builder.query({
      query: () => '/stories',
      providesTags: ['Story'],
    }),
    getStory: builder.query({
      query: (id) => `/stories/${id}`,
      providesTags: ['Story'],
    }),
    updateStory: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/stories/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Story'],
    }),
    deleteStory: builder.mutation({
      query: (id) => ({
        url: `/stories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Story'],
    }),
    
    // Character endpoints
    generateCharacter: builder.mutation({
      query: (characterParams) => ({
        url: '/characters/generate',
        method: 'POST',
        body: characterParams,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGenerateStoryMutation,
  useGetStoriesQuery,
  useGetStoryQuery,
  useUpdateStoryMutation,
  useDeleteStoryMutation,
  useGenerateCharacterMutation,
} = api;

