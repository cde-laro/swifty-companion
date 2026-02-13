import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import SearchBar from '../components/SearchBar';
import { useThemeColor } from '@/hooks/useThemeColors';

const LOGIN_MIN_LENGTH = 3;

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');
  const disabledColor = useThemeColor('disabled');

  const sanitizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);
  const canSearch = sanitizedQuery.length >= LOGIN_MIN_LENGTH;

  const handleSearch = (text: string) => {
    const filteredText = text.replace(/[^a-zA-Z0-9-]/g, '');
    setQuery(filteredText);
  };

  const handleSearchButtonPress = () => {
    if (!canSearch) return;
    router.push({ pathname: '/DetailsScreen', params: { login: sanitizedQuery } });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ flex: 1, backgroundColor }}
        contentContainerStyle={[styles.container, { backgroundColor }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: textColor }]}>Swifty Companion</Text>

        <SearchBar
          value={query}
          onChangeText={handleSearch}
          onSubmitEditing={handleSearchButtonPress}
          placeholder="Rechercher un login"
          disabled={!canSearch}
        />

        <TouchableOpacity
          style={[
            styles.searchButton,
            { backgroundColor: canSearch ? primaryColor : disabledColor },
          ]}
          onPress={handleSearchButtonPress}
          disabled={!canSearch}
          accessibilityRole="button"
          accessibilityLabel="Rechercher ce login"
        >
          <Text style={[styles.searchButtonText, { color: '#fff', opacity: canSearch ? 1 : 0.7 }]}>
            Rechercher
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 100,
    alignItems: 'center',
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
  searchButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
  },
});