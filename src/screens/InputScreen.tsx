import { View, StyleSheet, TextInput, LayoutChangeEvent } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { RNText } from '@/components/RNText';
import { useState } from 'react';
import { usePhysicsBall } from '@/hooks/usePhysicsBall';

const BALL_SIZE = 60;

export type PhysicsBallProps = {
  initialX: number;
  initialY: number;
  color: string;
  containerWidth: number;
  containerHeight: number;
};

export const PhysicsBall = ({
  initialX,
  initialY,
  color,
  containerWidth,
  containerHeight,
}: PhysicsBallProps) => {
  const { panGesture, animatedStyle } = usePhysicsBall({
    initialX,
    initialY,
    containerWidth,
    containerHeight,
    ballSize: BALL_SIZE,
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[styles.ball, { backgroundColor: color }, animatedStyle]}
      />
    </GestureDetector>
  );
};

const balls = [
  { id: 0, x: 50, y: 50, color: '#007AFF' },
  { id: 1, x: 100, y: 100, color: '#FF3B30' },
];

export const InputScreen = () => {
  const { colors } = useTheme();
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Text Input Section */}
      <View
        style={[
          styles.section,
          {
            borderColor: colors.cardOutline,
            backgroundColor: colors.cardBackground,
          },
        ]}
      >
        <RNText style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Text Input
        </RNText>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.background,
                borderColor: colors.cardOutline,
                color: colors.textPrimary,
              },
            ]}
            placeholder="Type something here..."
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      {/* Move Input Section */}
      <View
        style={[
          styles.section,
          {
            borderColor: colors.cardOutline,
            backgroundColor: colors.cardBackground,
          },
        ]}
      >
        <RNText style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Move Input
        </RNText>
        <View
          style={[styles.ballContainer, { borderColor: colors.cardOutline }]}
          onLayout={handleContainerLayout}
        >
          {balls.map(ball => (
            <PhysicsBall
              key={ball.id}
              initialX={ball.x}
              initialY={ball.y}
              color={ball.color}
              containerWidth={containerDimensions.width}
              containerHeight={containerDimensions.height}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 20,
  },
  section: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 24,
    boxShadow: '0 4px 8px rgba(0, 0, 0, .03)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputContainer: {
    width: '100%',
  },
  textInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  ballContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  ball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
