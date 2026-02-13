import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColors';

type Props = {
  email?: string;
  phone?: string | null;
};

export default function ContactButtons({ email, phone }: Props) {
  const primaryColor = useThemeColor('primary');
  const disabledColor = useThemeColor('disabled');
  const textColor = useThemeColor('text');
  const isPhoneHidden = !phone || phone === 'hidden';

  return (
    <View style={styles.buttonRow}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: primaryColor }]}
        onPress={() => Linking.openURL(`mailto:${email ?? ''}`)}
      >
        <Ionicons name="mail-outline" size={20} color={textColor} style={{ marginRight: 6 }} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isPhoneHidden ? disabledColor : primaryColor }]}
        disabled={isPhoneHidden}
        onPress={() => Linking.openURL(`tel:${phone ?? ''}`)}
      >
        <Ionicons
          name="call-outline"
          size={20}
          color={textColor}
          style={{ marginRight: 6, opacity: isPhoneHidden ? 0.5 : 1 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isPhoneHidden ? disabledColor : primaryColor }]}
        disabled={isPhoneHidden}
        onPress={() => Linking.openURL(`sms:${phone ?? ''}`)}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={20} color={textColor} style={{ marginRight: 6 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#4ADE80',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
});
