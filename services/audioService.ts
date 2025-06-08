// services/audioService.ts
import { AudioModule, useAudioPlayer } from 'expo-audio';

// Initialize audio permissions
export const requestAudioPermissions = async () => {
  try {
    const status = await AudioModule.requestRecordingPermissionsAsync();
    return status.granted;
  } catch (error) {
    console.error('Failed to request audio permissions', error);
    return false;
  }
};

// Set up audio mode
export const setupAudioMode = async () => {
  try {
    await AudioModule.setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });
    return true;
  } catch (error) {
    console.error('Failed to set audio mode', error);
    return false;
  }
};

// Custom hook to create and manage an audio player
export const useQuranAudioPlayer = (initialUri?: string) => {
  const player = useAudioPlayer(initialUri ? { uri: initialUri } : null);
  
  const playAudio = async (uri: string) => {
    try {
      // If we're already playing something, replace it
      if (player.currentTime > 0) {
        await player.replace({ uri });
      } else {
        // Otherwise, set the source and play
        await player.replace({ uri });
      }
      player.play();
      return true;
    } catch (error) {
      console.error('Failed to play audio', error);
      return false;
    }
  };
  
  const stopAudio = async () => {
    try {
      player.pause();
      player.seekTo(0);
      return true;
    } catch (error) {
      console.error('Failed to stop audio', error);
      return false;
    }
  };
  
  return {
    player,
    playAudio,
    stopAudio,
    isPlaying: player.playing,
  };
};