import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Card, Chip, SegmentedButtons } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useGenerateStoryMutation } from '../../services/api';
import { setCurrentStory, setGenerating } from '../../store/slices/storySlice';
import { selectIsAuthenticated, selectAuthToken } from '../../store/slices/authSlice';
import type { MainStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const GENRES = ['Adventure', 'Fantasy', 'Mystery', 'Friendship', 'Educational', 'Bedtime'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Russian', 'Ukrainian'];
const AGE_GROUPS = [
  { value: '3-5', label: '3-5 years' },
  { value: '6-8', label: '6-8 years' },
  { value: '9-12', label: '9-12 years' },
];

export const CreateScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const [generateStory, { isLoading }] = useGenerateStoryMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectAuthToken);
  
  const [characterName, setCharacterName] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Adventure');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [ageGroup, setAgeGroup] = useState('6-8');
  const [storyTheme, setStoryTheme] = useState('');
  const [moralLesson, setMoralLesson] = useState('');

  const handleGenerate = async () => {
    console.log('=== Generate Story Button Pressed ===');
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Has Token:', !!token);
    console.log('Character Name:', characterName);
    console.log('Character Description:', characterDescription);
    console.log('Genre:', selectedGenre);
    console.log('Language:', selectedLanguage);
    console.log('Age Group:', ageGroup);
    
    if (!isAuthenticated || !token) {
      Alert.alert('Not Authenticated', 'Please log in to generate stories');
      return;
    }
    
    try {
      dispatch(setGenerating(true));
      console.log('Calling API...');
      
      const result = await generateStory({
        character: {
          name: characterName,
          description: characterDescription,
        },
        genre: selectedGenre,
        language: selectedLanguage,
        ageGroup,
        theme: storyTheme,
        moralLesson,
      }).unwrap();
      
      console.log('Story generated successfully!', result);
      dispatch(setCurrentStory(result));
      
      // Navigate to story detail
      navigation.navigate('StoryDetail', { story: result });
    } catch (error: any) {
      console.error('=== Failed to generate story ===');
      console.error('Error object:', error);
      console.error('Error status:', error?.status);
      console.error('Error data:', error?.data);
      console.error('Error message:', error?.message);
      
      const errorMessage = error?.data?.error || error?.message || 'Failed to generate story';
      Alert.alert('Error', errorMessage);
    } finally {
      dispatch(setGenerating(false));
      console.log('=== Story generation finished ===');
    }
  };

  const isFormValid = characterName && characterDescription && selectedGenre;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineLarge" style={styles.title}>
        Create Your Story ✨
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Let's bring your imagination to life!
      </Text>

      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            1. Create Your Hero
          </Text>
          
          <TextInput
            label="Character Name"
            value={characterName}
            onChangeText={setCharacterName}
            mode="outlined"
            placeholder="e.g., Luna the Brave"
            style={styles.input}
          />
          
          <TextInput
            label="Character Description"
            value={characterDescription}
            onChangeText={setCharacterDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            placeholder="Describe your character's appearance, personality, and special abilities..."
            style={styles.input}
          />
          
          <Button
            mode="outlined"
            icon="draw"
            style={styles.drawButton}
            disabled
          >
            Draw Your Hero (Coming Soon)
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            2. Choose Story Type
          </Text>
          
          <Text variant="labelLarge" style={styles.label}>
            Genre
          </Text>
          <View style={styles.chipContainer}>
            {GENRES.map((genre) => (
              <Chip
                key={genre}
                selected={selectedGenre === genre}
                onPress={() => setSelectedGenre(genre)}
                style={styles.chip}
              >
                {genre}
              </Chip>
            ))}
          </View>
          
          <Text variant="labelLarge" style={styles.label}>
            Age Group
          </Text>
          <SegmentedButtons
            value={ageGroup}
            onValueChange={setAgeGroup}
            buttons={AGE_GROUPS}
            style={styles.segmented}
          />
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            3. Story Settings
          </Text>
          
          <TextInput
            label="Story Theme (Optional)"
            value={storyTheme}
            onChangeText={setStoryTheme}
            mode="outlined"
            placeholder="e.g., Space exploration, underwater adventure..."
            style={styles.input}
          />
          
          <TextInput
            label="Moral Lesson (Optional)"
            value={moralLesson}
            onChangeText={setMoralLesson}
            mode="outlined"
            placeholder="e.g., Importance of friendship, courage..."
            style={styles.input}
          />
          
          <Text variant="labelLarge" style={styles.label}>
            Language
          </Text>
          <View style={styles.chipContainer}>
            {LANGUAGES.map((language) => (
              <Chip
                key={language}
                selected={selectedLanguage === language}
                onPress={() => setSelectedLanguage(language)}
                style={styles.chip}
              >
                {language}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleGenerate}
        loading={isLoading}
        disabled={!isFormValid || isLoading}
        style={styles.generateButton}
        contentStyle={styles.generateButtonContent}
        icon="magic-staff"
      >
        Generate Story
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  drawButton: {
    marginTop: 8,
  },
  label: {
    marginBottom: 8,
    marginTop: 8,
    color: '#666666',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    marginRight: 0,
  },
  segmented: {
    marginBottom: 16,
  },
  generateButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  generateButtonContent: {
    paddingVertical: 8,
  },
});

