import React, { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColors';

export default function RedirectScreen() {
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/');
    }, 15000);

    return () => clearTimeout(t);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <ActivityIndicator size="large" color={primaryColor} accessibilityLabel="Chargement" />
        <Text style={{ marginTop: 12, color: textColor, fontSize: 16, fontWeight: '600' }}>
          Connexion en cours…
        </Text>
      </View>
    </SafeAreaView>
  );
}