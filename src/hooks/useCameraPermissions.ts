import { useState, useCallback } from 'react';
import { PermissionsAndroid, Permission, Alert } from 'react-native';
import RNRestart from 'react-native-restart';

const CAMERA_PERMISSION = 'android.permission.CAMERA' as Permission;
const HEADSET_CAMERA_PERMISSION =
  'horizonos.permission.HEADSET_CAMERA' as Permission;

export interface CameraPermissionState {
  isLoading: boolean;
  permissionsGranted: boolean;
  error: string | null;
}

export interface CameraPermissionActions {
  retryPermissions: () => void;
  resetPermissions: () => void;
}

export const useCameraPermissions = (): CameraPermissionState &
  CameraPermissionActions => {
  const [isLoading, setIsLoading] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAndRequestPermissions = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Check if permissions are already granted
      const cameraGranted = await PermissionsAndroid.check(CAMERA_PERMISSION);
      const headsetGranted = await PermissionsAndroid.check(
        HEADSET_CAMERA_PERMISSION,
      );
      const allGranted = cameraGranted && headsetGranted;

      if (allGranted) {
        setPermissionsGranted(true);
        setIsLoading(false);
        return;
      }

      // Request permissions if not all granted
      const cameraResult = await PermissionsAndroid.request(CAMERA_PERMISSION);
      const headsetResult = await PermissionsAndroid.request(
        HEADSET_CAMERA_PERMISSION,
      );
      const allRequestedGranted =
        cameraResult === PermissionsAndroid.RESULTS.GRANTED &&
        headsetResult === PermissionsAndroid.RESULTS.GRANTED;

      if (allRequestedGranted) {
        Alert.alert(
          'Permissions Granted',
          'We need to restart the app to apply the new permissions.',
          [{ text: 'Restart', onPress: () => RNRestart.restart() }],
        );
        setPermissionsGranted(true);
      } else {
        setError(
          'Camera and headset camera permissions are required to use this feature.',
        );
        setPermissionsGranted(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Permission error:', error);
      setError('Failed to request permissions');
      setIsLoading(false);
    }
  }, []);

  const retryPermissions = useCallback(() => {
    setIsLoading(true);
    setPermissionsGranted(false);
    setError(null);
    checkAndRequestPermissions();
  }, [checkAndRequestPermissions]);

  const resetPermissions = useCallback(() => {
    setIsLoading(true);
    setPermissionsGranted(false);
    setError(null);
  }, []);

  return {
    isLoading,
    permissionsGranted,
    error,
    retryPermissions,
    resetPermissions,
  };
};
