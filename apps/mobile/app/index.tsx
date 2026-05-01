import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../src/theme';
import { PulsoIdScreen } from '../src/screens/PulsoIdScreen';
import { EmergencyScreen } from '../src/screens/EmergencyScreen';
import { MicaScreen } from '../src/screens/MicaScreen';
import { DocsScreen } from '../src/screens/DocsScreen';

type Tab = 'id' | 'emergency' | 'mica' | 'docs';

const TABS: Array<{ key: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { key: 'id', label: 'Pulso ID', icon: 'card-outline' },
  { key: 'emergency', label: 'Emergencia', icon: 'qr-code-outline' },
  { key: 'mica', label: 'Mica', icon: 'sparkles-outline' },
  { key: 'docs', label: 'Documentos', icon: 'document-text-outline' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('id');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoMark}>
            <Ionicons name="pulse" size={20} color={theme.colors.turquesa} />
          </View>
          <View>
            <Text style={styles.brand}>PULSO</Text>
            <Text style={styles.brandSub}>Hola, Ana</Text>
          </View>
        </View>
        <Pressable style={styles.bellButton}>
          <Ionicons name="notifications-outline" size={18} color={theme.colors.niebla} />
          <View style={styles.bellDot} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 96 }}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'id' ? <PulsoIdScreen /> : null}
        {tab === 'emergency' ? <EmergencyScreen /> : null}
        {tab === 'mica' ? <MicaScreen /> : null}
        {tab === 'docs' ? <DocsScreen /> : null}
      </ScrollView>

      <View style={styles.tabBar}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              style={[styles.tabBtn, active && styles.tabBtnActive]}
            >
              <Ionicons
                name={t.icon}
                size={18}
                color={active ? theme.colors.turquesa : theme.colors.niebla}
              />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.azulProfundo },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(43,212,201,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    color: theme.colors.blancoCalido,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },
  brandSub: { color: theme.colors.niebla, fontSize: 12 },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.cobre,
  },
  scroll: { flex: 1 },
  tabBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    backgroundColor: 'rgba(15,31,61,0.95)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    padding: 6,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 18,
    gap: 2,
  },
  tabBtnActive: { backgroundColor: 'rgba(43,212,201,0.10)' },
  tabLabel: { color: theme.colors.niebla, fontSize: 10, fontWeight: '500' },
  tabLabelActive: { color: theme.colors.turquesa },
});
