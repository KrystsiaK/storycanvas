import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, Chip, SegmentedButtons } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';

import { useGenerateStoryMutation } from '../../services/api';
import { setCurrentStory, setGenerating } from '../../store/slices/storySlice';
// import { DrawingCanvas } from '../../components/DrawingCanvas';

const GENRES = ['Adventure', 'Fantasy', 'Mystery', 'Friendship', 'Educational', 'Bedtime'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Russian', 'Ukrainian'];
const AGE_GROUPS = [
  { value: '3-5', label: '3-5 years' },
  { value: '6-8', label: '6-8 years' },
  { value: '9-12', label: '9-12 years' },
];

export const CreateScreen = () => {
  const dispatch = useDispatch();
  const [generateStory, { isLoading }] = useGenerateStoryMutation();
  
  const [characterName, setCharacterName] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Adventure');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [ageGroup, setAgeGroup] = useState('6-8');
  const [storyTheme, setStoryTheme] = useState('');
  const [moralLesson, setMoralLesson] = useState('');
  const [showDrawingCanvas, setShowDrawingCanvas] = useState(false);

  const handleGenerate = async () => {
    try {
      dispatch(setGenerating(true));
      
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
      
      dispatch(setCurrentStory(result));
      // Navigate to story view
    } catch (error) {
      console.error('Failed to generate story:', error);
    } finally {
      dispatch(setGenerating(false));
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
            mode="contained"
            icon="brush"
            style={styles.drawButton}
            onPress={() => setShowDrawingCanvas(true)}
            buttonColor="#6366f1"
          >
            🎨 Draw Your Hero
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

      {/* <DrawingCanvas
        visible={showDrawingCanvas}
        onClose={() => setShowDrawingCanvas(false)}
        onSave={(imagePath) => {
          console.log('Drawing saved:', imagePath);
          setShowDrawingCanvas(false);
        }}
      /> */}
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

