import { useThemeColor } from '@/hooks/useThemeColors';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

type ProgressBarProps = {
  progress: number; // entre 0 et 1
  leftText?: string;
  rightText?: string;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  borderRadius?: number;
};

export default function ProgressBar({
  progress,
  leftText = 'XP',
  rightText = '1200 / 2000',
  height = 12,
  backgroundColor = useThemeColor('disabled'),
  progressColor = useThemeColor('primary'),
  borderRadius = 6,
}: ProgressBarProps) {
  return (
    <View>
      <View style={styles.textRow}>
        <Text style={[styles.leftText, { color: useThemeColor('text') }]}>{leftText}</Text>
        <Text style={[styles.rightText, { color: useThemeColor('text') }]}>{rightText}</Text>
      </View>
      <View style={[styles.container, { height, backgroundColor, borderRadius }]}>
        <View
          style={[
            styles.progress,
            {
              width: `${Math.max(0, Math.min(progress, 1)) * 100}%`,
              backgroundColor: progressColor,
              borderRadius,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  leftText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  rightText: {
    fontSize: 12,
  },
  container: {
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});