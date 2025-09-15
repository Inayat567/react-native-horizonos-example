import { useState, useEffect, useCallback } from 'react';
import { Alert, Share } from 'react-native';
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useTrackPlayerEvents,
  Event,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  url: string;
  artwork: string;
}

export interface AudioPlaybackState {
  currentTrackId: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AudioPlaybackActions {
  playTrack: (track: Track) => Promise<void>;
  pauseTrack: () => Promise<void>;
  stopTrack: () => Promise<void>;
  shareTrack: (track: Track) => Promise<void>;
  setupPlayer: () => Promise<void>;
}

export const useAudioPlayback = (): AudioPlaybackState &
  AudioPlaybackActions => {
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playbackState = usePlaybackState();

  const setupPlayer = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await TrackPlayer.setupPlayer();

      await TrackPlayer.updateOptions({
        forwardJumpInterval: 10,
        backwardJumpInterval: 10,
        capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
      });
    } catch (error) {
      console.error('Error setting up TrackPlayer:', error);
      setError('Failed to initialize audio player');
      Alert.alert('Error', 'Failed to initialize audio player');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const playTrack = useCallback(
    async (track: Track) => {
      try {
        setIsLoading(true);
        setError(null);

        if (
          currentTrackId === track.id &&
          playbackState.state === State.Playing
        ) {
          // Pause current track
          await TrackPlayer.pause();
        } else {
          // Stop current track and play new one
          await TrackPlayer.stop();
          await TrackPlayer.reset();

          await TrackPlayer.add({
            id: track.id,
            url: track.url,
            title: track.title,
            artist: track.artist,
            artwork: track.artwork,
          });

          await TrackPlayer.play();
          setCurrentTrackId(track.id);
        }
      } catch (error) {
        console.error('Error playing track:', error);
        setError('Failed to play audio track');
        Alert.alert('Error', 'Failed to play audio track');
      } finally {
        setIsLoading(false);
      }
    },
    [currentTrackId, playbackState.state],
  );

  const pauseTrack = useCallback(async () => {
    try {
      await TrackPlayer.pause();
    } catch (error) {
      console.error('Error pausing track:', error);
      setError('Failed to pause audio track');
    }
  }, []);

  const stopTrack = useCallback(async () => {
    try {
      await TrackPlayer.stop();
      setCurrentTrackId(null);
    } catch (error) {
      console.error('Error stopping track:', error);
      setError('Failed to stop audio track');
    }
  }, []);

  const shareTrack = useCallback(async (track: Track) => {
    try {
      await Share.share({
        message: `Check out this royalty-free music: "${track.title}" by ${track.artist}\n\n${track.url}`,
        title: `Share: ${track.title}`,
        url: track.url,
      });
    } catch (error) {
      console.error('Error sharing track:', error);
      setError('Failed to share track');
      Alert.alert('Error', 'Failed to share track');
    }
  }, []);

  // Track player events
  useTrackPlayerEvents(
    [Event.PlaybackState, Event.PlaybackActiveTrackChanged],
    useCallback(async event => {
      if (event.type === Event.PlaybackState) {
        if (event.state === State.Playing) {
          // When playing, get the current track ID
          const currentTrack = await TrackPlayer.getActiveTrack();
          if (currentTrack) {
            setCurrentTrackId(currentTrack.id);
          }
        } else if (event.state === State.Paused) {
          // Don't clear currentTrackId when paused - keep it for resume
        } else if (event.state === State.Stopped) {
          setCurrentTrackId(null);
        }
      } else if (event.type === Event.PlaybackActiveTrackChanged) {
        // Track changed, update current track ID
        if (event.track != null) {
          setCurrentTrackId(event.track.id);
        } else {
          setCurrentTrackId(null);
        }
      }
    }, []),
  );

  // Setup player on mount
  useEffect(() => {
    setupPlayer();

    return () => {
      TrackPlayer.reset();
    };
  }, [setupPlayer]);

  return {
    currentTrackId,
    isPlaying: playbackState.state === State.Playing,
    isLoading,
    error,
    playTrack,
    pauseTrack,
    stopTrack,
    shareTrack,
    setupPlayer,
  };
};
