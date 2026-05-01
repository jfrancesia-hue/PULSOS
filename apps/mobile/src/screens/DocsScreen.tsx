import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const DOCS = [
  { tipo: 'Estudio lab', titulo: 'Hemograma completo', fecha: '15 abr 2026', icon: 'flask-outline' as const },
  { tipo: 'Imagen', titulo: 'Ecografía abdominal', fecha: '02 abr 2026', icon: 'scan-outline' as const },
  { tipo: 'Receta', titulo: 'Enalapril 10mg', fecha: '28 mar 2026', icon: 'document-text-outline' as const },
  { tipo: 'Vacunación', titulo: 'Antigripal 2026', fecha: '14 mar 2026', icon: 'medical-outline' as const },
  { tipo: 'Indicación', titulo: 'Plan de control HTA', fecha: '10 mar 2026', icon: 'list-outline' as const },
];

export function DocsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tus documentos</Text>
        <Pressable style={styles.upload}>
          <Ionicons name="cloud-upload-outline" size={14} color={theme.colors.turquesa} />
          <Text style={styles.uploadTxt}>Subir</Text>
        </Pressable>
      </View>

      {DOCS.map((d, i) => (
        <Pressable key={i} style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name={d.icon} size={16} color={theme.colors.turquesa} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{d.titulo}</Text>
            <Text style={styles.cardSub}>
              {d.tipo} · {d.fecha}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={theme.colors.niebla} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: { color: theme.colors.blancoCalido, fontSize: 18, fontWeight: '700' },
  upload: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(43,212,201,0.30)',
  },
  uploadTxt: { color: theme.colors.turquesa, fontSize: 12, fontWeight: '600' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(43,212,201,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { color: theme.colors.blancoCalido, fontSize: 14, fontWeight: '500' },
  cardSub: { color: theme.colors.niebla, fontSize: 12, marginTop: 2 },
});
