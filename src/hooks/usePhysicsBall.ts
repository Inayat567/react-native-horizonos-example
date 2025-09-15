import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  AnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import { Gesture, PanGesture } from 'react-native-gesture-handler';

export interface PhysicsBallConfig {
  initialX: number;
  initialY: number;
  containerWidth: number;
  containerHeight: number;
  ballSize?: number;
}

export interface PhysicsBallState {
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  isPressed: SharedValue<boolean>;
}

export interface PhysicsBallActions {
  panGesture: PanGesture;
  animatedStyle: AnimatedStyle;
}

export const usePhysicsBall = ({
  initialX,
  initialY,
  containerWidth,
  containerHeight,
  ballSize = 60,
}: PhysicsBallConfig): PhysicsBallState & PhysicsBallActions => {
  const BALL_RADIUS = ballSize / 2;

  // Ensure initial position is within bounds
  const constrainedInitialX = Math.max(
    BALL_RADIUS,
    Math.min(containerWidth - BALL_RADIUS, initialX),
  );
  const constrainedInitialY = Math.max(
    BALL_RADIUS,
    Math.min(containerHeight - BALL_RADIUS, initialY),
  );

  const translateX = useSharedValue(constrainedInitialX);
  const translateY = useSharedValue(constrainedInitialY);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const isPressed = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isPressed.value = true;
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate(event => {
      const newX = startX.value + event.translationX;
      const newY = startY.value + event.translationY;

      // Constrain within the container boundaries
      const minX = 16;
      const maxX = containerWidth - 2 * BALL_RADIUS - 16;
      const minY = 16;
      const maxY = containerHeight - 2 * BALL_RADIUS - 16;

      const constrainedX = Math.max(minX, Math.min(maxX, newX));
      const constrainedY = Math.max(minY, Math.min(maxY, newY));

      translateX.value = constrainedX;
      translateY.value = constrainedY;
    })
    .onEnd(() => {
      isPressed.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: withSpring(isPressed.value ? 1.1 : 1) },
      ],
    };
  });

  return {
    translateX,
    translateY,
    isPressed,
    panGesture,
    animatedStyle,
  };
};
