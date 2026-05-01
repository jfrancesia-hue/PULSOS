import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export function PulsoIdScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.section}>Tu identidad sanitaria</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>AM</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Ana M. Martini</Text>
            <Text style={styles.muted}>DNI 32.145.678 · CABA</Text>
          </View>
          <View style={styles.badge}>
            <View style={styles.dot} />
            <Text style={styles.badgeTxt}>Verificado</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Stat label="Grupo sanguíneo" value="O+" accent={theme.colors.cobre} />
          <Stat label="Cobertura" value="OSDE 210" accent={theme.colors.turquesa} />
        </View>
      </View>

      <Text style={styles.section}>Datos críticos</Text>

      <Item icon="warning-outline" titulo="Alergia: Penicilina" sub="Severa · diagnosticada en 2010" accent={theme.colors.cobre} />
      <Item icon="heart-outline" titulo="Hipertensión arterial" sub="Desde mar 2018 · controlada" />
      <Item icon="medkit-outline" titulo="Enalapril 10mg" sub="1 comp. cada 12 hs · habitual" />

      <Text style={styles.section}>Contacto de emergencia</Text>
      <Item icon="call-outline" titulo="Carlos Martini" sub="Cónyuge · +54 9 11 5566 7788" />
    </View>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, accent ? { color: accent } : null]}>{value}</Text>
    </View>
  );
}

function Item({
  icon,
  titulo,
  sub,
  accent = theme.colors.turquesa,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  titulo: string;
  sub: string;
  accent?: string;
}) {
  return (
    <View style={styles.itemCard}>
      <View style={[styles.itemIcon, { backgroundColor: `${accent}25` }]}>
        <Ionicons name={icon} size={16} color={accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{titulo}</Text>
        <Text style={styles.itemSub}>{sub}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  section: {
    color: theme.colors.niebla,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 12,
    marginBottom: 4,
  },
  card: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(43,212,201,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: { color: theme.colors.turquesa, fontWeight: '700', fontSize: 14 },
  name: { color: theme.colors.blancoCalido, fontSize: 16, fontWeight: '600' },
  muted: { color: theme.colors.niebla, fontSize: 12, marginTop: 2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(43,212,154,0.10)',
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.success },
  badgeTxt: { color: theme.colors.success, fontSize: 11, fontWeight: '600' },
  divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 16 },
  row: { flexDirection: 'row', gap: 12 },
  stat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: theme.radii.md,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statLabel: { color: theme.colors.niebla, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },
  statValue: { color: theme.colors.blancoCalido, fontSize: 18, fontWeight: '700', marginTop: 4 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: { color: theme.colors.blancoCalido, fontSize: 14, fontWeight: '500' },
  itemSub: { color: theme.colors.niebla, fontSize: 12, marginTop: 2 },
});
