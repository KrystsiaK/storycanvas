import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

export const downloadStoryPDF = async (storyId: string, storyTitle: string, token: string) => {
  try {
    const filename = `${storyTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    // Download the file
    const downloadResumable = FileSystem.createDownloadResumable(
      `${API_BASE_URL}/pdf/story/${storyId}`,
      fileUri,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await downloadResumable.downloadAsync();

    if (result && result.uri) {
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(result.uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Share ${storyTitle}`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Success', `PDF saved to ${result.uri}`);
      }
    }
  } catch (error) {
    console.error('PDF download error:', error);
    Alert.alert('Error', 'Failed to download PDF. Please try again.');
  }
};

export const downloadAllStoriesPDF = async (token: string) => {
  try {
    const filename = 'My_Story_Collection.pdf';
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    // Download the file
    const downloadResumable = FileSystem.createDownloadResumable(
      `${API_BASE_URL}/pdf/collection`,
      fileUri,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await downloadResumable.downloadAsync();

    if (result && result.uri) {
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(result.uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share My Story Collection',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Success', `PDF saved to ${result.uri}`);
      }
    }
  } catch (error) {
    console.error('PDF collection download error:', error);
    Alert.alert('Error', 'Failed to download PDF collection. Please try again.');
  }
};

