import React, { forwardRef } from 'react';
import { View, TextInput, StyleSheet, Text, useColorScheme } from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
  placeholder?: string;
  disabled?: boolean;
};

const SearchBar = forwardRef<TextInput, SearchBarProps>(
  ({ value, onChangeText, onSubmitEditing, placeholder = 'Search...', disabled = false }, ref) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    return (
      <View style={[styles.searchContainer, isDarkMode && styles.searchContainerDark]}>
        <Text style={[styles.searchIcon, isDarkMode && styles.searchIconDark]}>🔍</Text>
        <TextInput
          ref={ref}
          style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={8}
          returnKeyType="search"
        //   editable={!disabled}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  searchContainerDark: {
    borderColor: '#555',
    backgroundColor: '#333',
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
    color: '#000',
  },
  searchIconDark: {
    color: '#fff',
  },
  searchInput: {
    height: 40,
    flex: 1,
    color: '#000',
  },
  searchInputDark: {
    color: '#fff',
  },
});

export default SearchBar;