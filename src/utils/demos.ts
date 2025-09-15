import { RootStackParamList } from '@/navigation/types';

export const demos: {
  id: string;
  name: string;
  description: string;
  screen: keyof RootStackParamList;
}[] = [
  {
    id: '1',
    name: 'Motion Input',
    description: 'Use motion as touch input',
    screen: 'Input',
  },
  {
    id: '2',
    name: 'Camera Access',
    description: 'Access selfie and passthrough cameras',
    screen: 'SelfieCamera',
  },
  {
    id: '3',
    name: 'Background Audio',
    description: 'Play music with notification controls',
    screen: 'BackgroundAudio',
  },
];
