import { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  CameraDevice,
} from 'react-native-vision-camera';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  RotateCcw,
  Maximize,
  Minimize,
  User,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { RNText } from '@/components/RNText';
import { useNavigation } from '@/navigation/useNavigation';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';
import { useTransitionEndEffect } from '@/hooks/useTransitionEndEffect';

export type VideoTileProps = {
  participantName: string;
  isLocal?: boolean;
};

export type VideoTilePropsWithControls = VideoTileProps & {
  isCameraActive?: boolean;
  isMicMuted?: boolean;
};

const VideoTile = ({
  participantName,
  isLocal = false,
  isCameraActive = true,
  isMicMuted = false,
  cameraDevice,
}: VideoTilePropsWithControls & { cameraDevice?: CameraDevice | null }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.videoTile}>
      <View
        style={[
          styles.videoPlaceholder,
          {
            backgroundColor:
              isLocal && isCameraActive ? colors.cardBackground : '#1a1a1a',
            borderColor: colors.cardOutline,
          },
        ]}
      >
        {isLocal ? (
          <LocalPreview
            isActive={isCameraActive}
            cameraDevice={cameraDevice || null}
          />
        ) : (
          <View style={styles.fakeParticipantContainer}>
            <User size={48} color="#666666" />
          </View>
        )}

        {/* Mic status indicator */}
        {isMicMuted && (
          <View style={styles.micStatusIndicator}>
            <MicOff size={16} color="#ffffff" />
          </View>
        )}

        <View style={styles.participantNameContainer}>
          <RNText style={styles.participantName}>{participantName}</RNText>
          {isLocal && <RNText style={styles.localIndicator}>You</RNText>}
        </View>
      </View>
    </View>
  );
};

export type LocalPreviewProps = {
  isActive: boolean;
  cameraDevice: CameraDevice | null;
};

const LocalPreview = ({ isActive, cameraDevice }: LocalPreviewProps) => {
  if (!cameraDevice || !isActive) {
    return (
      <View style={styles.fakeParticipantContainer}>
        <User size={48} color="#666666" />
      </View>
    );
  }

  return (
    <Camera
      preview
      isActive={isActive}
      device={cameraDevice}
      style={styles.cameraPreview}
      androidPreviewViewType="texture-view"
    />
  );
};

const FullscreenCamera = ({
  isActive,
  cameraDevice,
  onToggleFullscreen,
}: {
  isActive: boolean;
  cameraDevice?: CameraDevice;
  onToggleFullscreen: () => void;
}) => {
  if (!cameraDevice) {
    return null;
  }

  return (
    <View style={styles.fullscreenContainer}>
      <Camera
        preview
        isActive={isActive}
        device={cameraDevice}
        style={styles.fullscreenCamera}
        androidPreviewViewType="texture-view"
      />

      {/* Fullscreen Controls Overlay */}
      <View style={styles.fullscreenControls}>
        <TouchableOpacity
          style={[
            styles.fullscreenControlButton,
            { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
          ]}
          onPress={onToggleFullscreen}
        >
          <Minimize size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const SelfieCameraScreen = () => {
  const navigation = useNavigation();
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isUsingFrontCamera, setIsUsingFrontCamera] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { colors } = useTheme();

  // Use custom hook for camera permissions
  const { isLoading, permissionsGranted, error, retryPermissions } =
    useCameraPermissions();

  // Get camera devices
  const frontCamera = useCameraDevice('front');
  const backCamera = useCameraDevice('back');

  // Determine which camera to use
  const currentCamera = isUsingFrontCamera ? frontCamera : backCamera;

  // Trigger permission check when navigation transition ends
  useTransitionEndEffect(() => {
    retryPermissions();
  });

  const toggleMic = () => {
    setIsMicMuted(!isMicMuted);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const switchCamera = () => {
    setIsUsingFrontCamera(!isUsingFrontCamera);
  };

  const endCall = () => {
    navigation.goBack();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Loading state UI - wait for permissions
  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.textPrimary} />
        <RNText style={[styles.loadingText, { color: colors.textPrimary }]}>
          Verifying permissions...
        </RNText>
      </View>
    );
  }

  // If permissions not granted, show error state
  if (!permissionsGranted) {
    return (
      <View
        style={[
          styles.container,
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <RNText style={[styles.errorText, { color: colors.textPrimary }]}>
          {error || 'Camera permissions are required to use this feature.'}
        </RNText>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.textPrimary }]}
          onPress={retryPermissions}
        >
          <RNText style={styles.retryButtonText}>Retry</RNText>
        </TouchableOpacity>
      </View>
    );
  }

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <FullscreenCamera
        isActive={isCameraOn}
        cameraDevice={currentCamera}
        onToggleFullscreen={toggleFullscreen}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.cardBackground,
            borderBottomColor: colors.cardOutline,
          },
        ]}
      >
        <RNText style={styles.meetingTitle}>Team Standup Meeting</RNText>
        <RNText color="secondary" style={styles.meetingTime}>
          10:30 AM - 11:00 AM
        </RNText>
      </View>

      {/* Video Grid */}
      <View style={styles.videoGrid}>
        <VideoTile
          participantName="John Doe"
          isLocal={true}
          isCameraActive={isCameraOn}
          isMicMuted={isMicMuted}
          cameraDevice={currentCamera}
        />
        <VideoTile participantName="Jane Smith" isMicMuted={true} />
        <VideoTile participantName="Mike Johnson" />
        <VideoTile participantName="Sarah Wilson" isMicMuted={true} />
      </View>

      {/* Bottom Controls */}
      <View
        style={[
          styles.controlsContainer,
          {
            backgroundColor: colors.cardBackground,
            borderTopColor: colors.cardOutline,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.controlButton,
            {
              backgroundColor: colors.backgroundHighlight,
              borderColor: colors.cardOutline,
            },
            isMicMuted && styles.controlButtonMuted,
          ]}
          onPress={toggleMic}
        >
          {isMicMuted ? (
            <MicOff size={24} color={colors.textPrimary} />
          ) : (
            <Mic size={24} color={colors.textPrimary} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            {
              backgroundColor: colors.backgroundHighlight,
              borderColor: colors.cardOutline,
            },
            !isCameraOn && styles.controlButtonMuted,
          ]}
          onPress={toggleCamera}
        >
          {isCameraOn ? (
            <Video size={24} color={colors.textPrimary} />
          ) : (
            <VideoOff size={24} color={colors.textPrimary} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            {
              backgroundColor: colors.backgroundHighlight,
              borderColor: colors.cardOutline,
            },
          ]}
          onPress={switchCamera}
        >
          <RotateCcw size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            {
              backgroundColor: colors.backgroundHighlight,
              borderColor: colors.cardOutline,
            },
          ]}
          onPress={toggleFullscreen}
        >
          <Maximize size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={endCall}
        >
          <Phone size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  meetingTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  meetingTime: {
    fontSize: 14,
  },
  videoGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  videoTile: {
    width: '50%',
    height: '50%',
    padding: 4,
  },
  videoPlaceholder: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'flex-end',
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  participantNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 12,
    marginBottom: 12,
    marginRight: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  participantName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  localIndicator: {
    fontSize: 11,
    color: '#ffffff',
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  micStatusIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  controlsContainer: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    gap: 24,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  controlButtonMuted: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  endCallButton: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  cameraPreview: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fullscreenCamera: {
    flex: 1,
  },
  fullscreenControls: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  fullscreenControlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  fakeParticipantContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
});
