import { useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@/navigation/useNavigation';

export const useTransitionEndEffect = (callback: () => void) => {
  const callbackRef = useRef(callback);
  const navigation = useNavigation();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('transitionEnd', () =>
        callbackRef.current(),
      );

      return () => {
        unsubscribe();
      };
    }, [navigation]),
  );
};
