import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProgressBar from '@/components/ui/ProgressBar';

type Skill = {
  id: number;
  name: string;
  level: number;
};

type Props = {
  skills: Skill[];
  mutedColor: string;
};

export default function SkillsList({ skills, mutedColor }: Props) {
  if (!skills || skills.length === 0) {
    return <Text style={{ color: mutedColor, paddingVertical: 8 }}>No skills</Text>;
  }

  return (
    <View style={styles.container}>
      {[...skills]
        .sort((a, b) => b.level - a.level)
        .map(s => (
          <View key={s.id} style={{ marginBottom: 10 }}>
            <ProgressBar
              leftText={s.name}
              rightText={s.level.toFixed(2)}
              progress={Math.max(0, Math.min(1, s.level / 21))}
            />
          </View>
        ))
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
});
