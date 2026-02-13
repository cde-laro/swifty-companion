import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColors';
import * as AuthSession from 'expo-auth-session';
import { AuthRequest } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const CLIENT_ID = process.env.EXPO_PUBLIC_42_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_42_CLIENT_SECRET;
const API_URL = process.env.EXPO_PUBLIC_42_API_URL ?? 'https://api.intra.42.fr';
const REDIRECT_URI = AuthSession.makeRedirectUri({ scheme: 'swifty', path: 'redirect' });

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const smallTextColor = useThemeColor('smallText');
  const primaryColor = useThemeColor('primary');
  const disabledColor = useThemeColor('disabled');

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const discovery = useMemo(
    () => ({
      authorizationEndpoint: `${API_URL}/oauth/authorize`,
      tokenEndpoint: `${API_URL}/oauth/token`,
    }),
    []
  );
  const canLogin = Boolean(CLIENT_ID && CLIENT_SECRET) && !isLoggingIn;

  const handleLogin42 = async () => {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      setErrorMessage("CLIENT_ID / CLIENT_SECRET manquants (variables d'environnement).");
      return;
    }

    setErrorMessage(null);
    setIsLoggingIn(true);

    try {
      const request = new AuthRequest({
        clientId: CLIENT_ID,
        redirectUri: REDIRECT_URI,
        clientSecret: CLIENT_SECRET,
        responseType: 'code',
        scopes: ['public'],
      });

      const result = await request.promptAsync(discovery);

      if (result.type === 'success' && result.params.code) {
        const tokenResponse = await fetch(discovery.tokenEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: result.params.code,
            redirect_uri: REDIRECT_URI,
          }).toString(),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
          setErrorMessage(tokenData?.error_description ?? 'Erreur lors de la récupération du token');
          return;
        }

        await SecureStore.setItemAsync('access_token', tokenData.access_token);
        router.replace('/SearchScreen');
        return;
      }

      if (result.type === 'dismiss') {
        setErrorMessage('Connexion annulée');
        return;
      }

      setErrorMessage('Erreur lors de la connexion');
    } catch (e) {
      setErrorMessage('Erreur réseau: ' + (e instanceof Error ? e.message : 'Unknown error'));
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ flex: 1, backgroundColor }}
        contentContainerStyle={{ flexGrow: 1, backgroundColor }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.container, { backgroundColor }]}>
          <Text style={[styles.title, { color: textColor }]}>Swifty Companion</Text>

          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: canLogin ? primaryColor : disabledColor, opacity: canLogin ? 1 : 0.7 },
            ]}
            onPress={handleLogin42}
            disabled={!canLogin}
            accessibilityRole="button"
            accessibilityLabel="Se connecter avec 42"
          >
            {isLoggingIn ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Se connecter avec 42</Text>
            )}
          </TouchableOpacity>

          {errorMessage ? (
            <Text style={[styles.errorText, { color: smallTextColor }]}>{errorMessage}</Text>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 240,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    marginTop: 12,
    fontSize: 12,
    textAlign: 'center',
  },
});