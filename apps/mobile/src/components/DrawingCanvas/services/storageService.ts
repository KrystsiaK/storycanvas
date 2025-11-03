import { Alert } from "react-native";

export const storageService = {
  /**
   * Converts canvas snapshot to base64
   */
  exportToBase64: async (
    makeImageSnapshot: () => any
  ): Promise<string | null> => {
    try {
      const image = makeImageSnapshot();
      if (!image) {
        throw new Error("Failed to create image snapshot");
      }

      const base64 = image.encodeToBase64();
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Error", "Failed to export drawing");
      return null;
    }
  },

  /**
   * Shows success message after save
   */
  showSaveSuccess: () => {
    Alert.alert("Success", "Drawing saved successfully!");
  },

  /**
   * Shows error message
   */
  showError: (message: string) => {
    Alert.alert("Error", message);
  },

  /**
   * Shows confirmation dialog
   */
  showConfirmation: (
    title: string,
    message: string,
    onConfirm: () => void
  ): void => {
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        style: "destructive",
        onPress: onConfirm,
      },
    ]);
  },
};

