import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export function EmergencyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.section}>Tu QR de emergencia</Text>

      <View style={styles.qrCard}>
        <View style={styles.qrFrame}>
          <FakeQrLarge />
        </View>
        <Text style={styles.qrName}>Ana M. Martini</Text>
        <Text style={styles.qrSub}>O+ · Alergia: Penicilina · OSDE 210</Text>

        <View style={styles.expiry}>
          <Ionicons name="time-outline" size={14} color={theme.colors.cobre} />
          <Text style={styles.expiryTxt}>Activo hasta el 31 may 2026</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
          <Pressable style={[styles.action, styles.actionPrimary]}>
            <Ionicons name="share-outline" size={14} color={theme.colors.azulMedianoche} />
            <Text style={styles.actionPrimaryTxt}>Compartir</Text>
          </Pressable>
          <Pressable style={[styles.action, styles.actionGhost]}>
            <Ionicons name="refresh-outline" size={14} color={theme.colors.niebla} />
            <Text style={styles.actionGhostTxt}>Renovar</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.section}>Últimos accesos</Text>

      <AccessLog
        institucion="Hospital Italiano"
        ciudad="Buenos Aires"
        cuando="hace 4 minutos"
      />
      <AccessLog institucion="Clínica Bernal" ciudad="La Plata" cuando="hace 3 días" />
    </View>
  );
}

function AccessLog({
  institucion,
  ciudad,
  cuando,
}: {
  institucion: string;
  ciudad: string;
  cuando: string;
}) {
  return (
    <View style={styles.logCard}>
      <View style={styles.logIcon}>
        <Ionicons name="medical-outline" size={14} color={theme.colors.cobre} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.logTitle}>{institucion}</Text>
        <Text style={styles.logSub}>
          {ciudad} · {cuando}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={14} color={theme.colors.niebla} />
    </View>
  );
}

function FakeQrLarge() {
  const cells = Array.from({ length: 225 }, (_, i) => ((i * 9301 + 49297) % 233280) / 233280 > 0.45);
  return (
    <View style={qrStyles.grid}>
      {cells.map((on, i) => (
        <View key={i} style={[qrStyles.cell, on && qrStyles.cellOn]} />
      ))}
    </View>
  );
}

const qrStyles = StyleSheet.create({
  grid: {
    width: 180,
    height: 180,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: { width: 12, height: 12 },
  cellOn: { backgroundColor: '#050B14' },
});

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
  qrCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(217,120,71,0.30)',
    padding: 20,
    alignItems: 'center',
  },
  qrFrame: {
    backgroundColor: theme.colors.blancoCalido,
    padding: 14,
    borderRadius: theme.radii.md,
  },
  qrName: { color: theme.colors.blancoCalido, fontSize: 16, fontWeight: '600', marginTop: 16 },
  qrSub: { color: theme.colors.niebla, fontSize: 12, marginTop: 2 },
  expiry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(217,120,71,0.10)',
  },
  expiryTxt: { color: theme.colors.cobre, fontSize: 11, fontWeight: '600' },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 10,
  },
  actionPrimary: { backgroundColor: theme.colors.turquesa },
  actionPrimaryTxt: { color: theme.colors.azulMedianoche, fontWeight: '600', fontSize: 13 },
  actionGhost: { borderWidth: 1, borderColor: theme.colors.border },
  actionGhostTxt: { color: theme.colors.niebla, fontWeight: '500', fontSize: 13 },
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
  },
  logIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(217,120,71,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logTitle: { color: theme.colors.blancoCalido, fontSize: 14, fontWeight: '500' },
  logSub: { color: theme.colors.niebla, fontSize: 12, marginTop: 2 },
});
