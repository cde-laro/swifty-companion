import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Projects } from '@/types/user';

type Props = {
  projects: Projects[];
  textColor: string;
  mutedColor: string;
  successColor?: string;
  dangerColor?: string;
};

export default function ProjectsList({
  projects,
  textColor,
  mutedColor,
  successColor = '#22c55e',
  dangerColor = '#ef4444',
}: Props) {
  if (!projects || projects.length === 0) {
    return <Text style={{ color: mutedColor, paddingVertical: 8 }}>No projects</Text>;
  }

  return (
    <View style={styles.container}>
      {projects.map((p, idx) => {
        const title = p.project?.name ?? 'Untitled';
        const hasMark = typeof p.final_mark === 'number';
        const markLabel = hasMark ? String(p.final_mark) : '-';
        const validated = p['validated?'];
        const markColor =
          !hasMark ? mutedColor :
          validated === true ? successColor :
          validated === false ? dangerColor :
          mutedColor;

        return (
          <View key={`${title}-${idx}`} style={styles.row}>
            <Text style={[styles.title, { color: textColor }]} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
            <Text style={[styles.mark, { color: markColor }]}>
              {markLabel} {validated == null ? '' : validated ? '✓' : '✗'}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#00000022',
  },
  title: {
    flex: 1,
    fontSize: 14,
    paddingRight: 12,
  },
  mark: {
    minWidth: 32,
    textAlign: 'right',
    fontWeight: '600',
    fontSize: 14,
  },
});
