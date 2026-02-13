import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

type Props = {
  uri?: string;
  level?: number;
};

export default function AvatarWithStatus({ uri, level = 0 }: Props) {
  return (
    <View style={styles.imageContainer}>
      <View style={{ width: 128, height: 128 }}>
        <Image
          source={{ uri }}
          style={styles.logo}
          resizeMode="cover"
        />
        <View style={styles.statusCircle}>
          <Text style={styles.statusText}>{Math.floor(level || 0)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 16,
    marginBottom: 8,
    position: 'relative',
    alignItems: 'center',
  },
  logo: {
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: '#ccc',
  },
  statusCircle: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#4ADE80',
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    lineHeight: 42,
    includeFontPadding: false,
  },
});
