import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

export function useThemeColor(key: keyof typeof Colors['light']) {
  const scheme = useColorScheme();
  return Colors[scheme ?? 'light'][key];
}

export function useThemeColors() {
  const scheme = useColorScheme();
  return Colors[scheme ?? 'light'];
}