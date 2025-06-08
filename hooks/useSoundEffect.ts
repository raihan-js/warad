// hooks/useSoundEffect.ts
import { Audio, AVPlaybackStatus } from 'expo-av';
import { useEffect, useState } from 'react';

export function useSoundEffect() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playSound = async (audioUrl: string) => {
    try {
      // Unload previous sound if it exists
      if (sound) {
        await sound.unloadAsync();
      }

      // Load and play the new sound
      console.log('Loading audio from URL:', audioUrl);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (status: AVPlaybackStatus) => {
          // First check if the status is loaded
          if (status.isLoaded) {
            // Now we can safely check didJustFinish
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }
        }
      );

      setSound(newSound);
      setIsPlaying(true);
      setError(null);
      
      return true;
    } catch (error) {
      console.error('Failed to play audio:', error);
      setError('Failed to play audio. Please try again.');
      setIsPlaying(false);
      return false;
    }
  };

  const stopSound = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Failed to stop audio:', error);
    }
  };

  const unloadSound = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Failed to unload audio:', error);
    }
  };

  return {
    sound,
    isPlaying,
    error,
    playSound,
    stopSound,
    unloadSound,
  };
}