import React, { useEffect, useMemo } from 'react';
import { Stack, router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Alert, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColors';
import * as SecureStore from 'expo-secure-store';

export default function RootLayout() {
  const pathname = usePathname();

  useEffect(() => {
    if (!__DEV__) return;

    const eu = (globalThis as any).ErrorUtils;
    const defaultHandler = eu?.getGlobalHandler?.();

    eu?.setGlobalHandler?.((error: unknown, isFatal: boolean) => {
      console.error('Global error handler:', { isFatal, error });
      defaultHandler?.(error, isFatal);
    });
  }, []);

  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');

  const hideBack = useMemo(() => {
    return pathname === '/' || pathname === '/redirect';
  }, [pathname]);

  const hideLogout = useMemo(() => {
    return pathname === '/' || pathname === '/redirect';
  }, [pathname]);

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('access_token');
    } finally {
      router.replace('/');
    }
  };

  const confirmLogout = () => {
    Alert.alert('Déconnexion', 'Se déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'OK', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerStyle: { backgroundColor },
        headerTintColor: textColor,
        headerBackVisible: false,

        headerLeft: ({ canGoBack }) => {
          if (!canGoBack || hideBack) return null;

          return (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
              <Ionicons name="arrow-back" size={24} color={textColor} />
            </TouchableOpacity>
          );
        },

        headerRight: () => {
          if (hideLogout) return null;

          return (
            <TouchableOpacity onPress={confirmLogout} style={{ marginRight: 16 }}>
              <Ionicons name="log-out-outline" size={24} color={textColor} />
            </TouchableOpacity>
          );
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Login' }} />
      <Stack.Screen name="SearchScreen" options={{ title: 'Recherche' }} />
      <Stack.Screen name="DetailsScreen" options={{ title: 'Détails' }} />
      <Stack.Screen name="redirect" options={{ title: '' }} />
      <Stack.Screen name="+not-found" options={{ title: 'Page non trouvée' }} />
    </Stack>
  );
}