import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColors';

// Define the TableGridProps interface
interface TableGridProps {
  rows?: number;
  cols?: number;
  data?: (string | number)[];
}

export default function TableGrid({ rows = 2, cols = 3, data }: TableGridProps): React.ReactElement {
  const cellBg = useThemeColor('background');
  const borderColor = useThemeColor('disabled');
  const textColor = useThemeColor('text');
  const borderRadius = 8;

  return (
    <View style={styles.table}>
      {Array.from({ length: rows }).map((_, row) => (
        <View key={row} style={styles.tableRow}>
          {Array.from({ length: cols }).map((_, col) => {
            // Détermine le borderRadius pour chaque coin extérieur
            const borderRadiusStyle: any = {};
            if (row === 0 && col === 0) borderRadiusStyle.borderTopLeftRadius = borderRadius;
            if (row === 0 && col === cols - 1) borderRadiusStyle.borderTopRightRadius = borderRadius;
            if (row === rows - 1 && col === 0) borderRadiusStyle.borderBottomLeftRadius = borderRadius;
            if (row === rows - 1 && col === cols - 1) borderRadiusStyle.borderBottomRightRadius = borderRadius;
  
            // Détermine les bordures extérieures uniquement
            const borderStyle: any = {};
            if (row === 0) borderStyle.borderTopWidth = 1;
            if (row === rows - 1) borderStyle.borderBottomWidth = 1;
            if (col === 0) borderStyle.borderLeftWidth = 1;
            if (col === cols - 1) borderStyle.borderRightWidth = 1;
            borderStyle.borderColor = borderColor;
  
            // Bold for first row
            const textStyle = [
              styles.tableCellText,
              { color: textColor },
              row === 0 ? { fontWeight: '700' as const } : { fontWeight: '400' as const }
            ];
  
            return (
              <View
                key={col}
                style={[
                  styles.tableCell,
                  borderRadiusStyle,
                  borderStyle,
                  { backgroundColor: cellBg }
                ]}
              >
                <Text style={textStyle}>
                  {data?.[row * cols + col] ?? `Case ${row * cols + col + 1}`}
                </Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );

}

const styles = StyleSheet.create({
  table: {
    marginTop: 16,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCellText: {
    fontSize: 14,
  },
});