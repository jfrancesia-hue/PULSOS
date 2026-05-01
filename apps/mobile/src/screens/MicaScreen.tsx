import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export function MicaScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.heroCard}>
        <View style={styles.iconWrap}>
          <Ionicons name="sparkles" size={20} color={theme.colors.azulMedianoche} />
        </View>
        <Text style={styles.title}>Mica</Text>
        <Text style={styles.subtitle}>
          Tu acompañante sanitaria. Te explica, te recuerda, te deriva. No reemplaza a tu médico.
        </Text>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusTxt}>En línea</Text>
        </View>
      </View>

      <Text style={styles.section}>Conversación</Text>

      <Bubble rol="user">¿Qué significa que mi colesterol total es 215?</Bubble>
      <Bubble rol="mica">
        Hola Ana. Un colesterol total de 215 mg/dL está apenas por encima del rango deseable
        (menos de 200). No es algo urgente, pero sí algo a hablar con tu médico de cabecera en tu
        próximo control. Si querés, puedo recordarte agendar el turno.
        {'\n\n'}
        Recordá: Mica no reemplaza a un profesional médico.
      </Bubble>

      <Pressable style={styles.input}>
        <Text style={styles.inputPlaceholder}>Escribí a Mica…</Text>
        <Ionicons name="send" size={16} color={theme.colors.turquesa} />
      </Pressable>

      <Text style={styles.section}>Sugerencias</Text>
      <Suggestion text="Recordame tomar enalapril a las 21h" icon="alarm-outline" />
      <Suggestion text="Explicame mi último análisis de sangre" icon="document-text-outline" />
      <Suggestion text="¿Qué hago si me olvido una dosis?" icon="help-circle-outline" />
    </View>
  );
}

function Bubble({ rol, children }: { rol: 'user' | 'mica'; children: React.ReactNode }) {
  const isUser = rol === 'user';
  return (
    <View
      style={[
        styles.bubble,
        isUser
          ? { backgroundColor: 'rgba(43,212,201,0.15)', alignSelf: 'flex-end', marginLeft: 40 }
          : { backgroundColor: theme.colors.cardBg, marginRight: 40 },
      ]}
    >
      <Text style={styles.bubbleTxt}>{children}</Text>
    </View>
  );
}

function Suggestion({
  text,
  icon,
}: {
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Pressable style={styles.suggestion}>
      <Ionicons name={icon} size={14} color={theme.colors.turquesa} />
      <Text style={styles.suggestionTxt}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10 },
  heroCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(43,212,201,0.20)',
    padding: 20,
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.turquesa,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: { color: theme.colors.blancoCalido, fontWeight: '700', fontSize: 22 },
  subtitle: {
    color: theme.colors.niebla,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(43,212,154,0.10)',
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.success },
  statusTxt: { color: theme.colors.success, fontSize: 11, fontWeight: '600' },
  section: {
    color: theme.colors.niebla,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 12,
    marginBottom: 4,
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  bubbleTxt: { color: theme.colors.blancoCalido, fontSize: 13, lineHeight: 19 },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.azulMedianoche,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    height: 44,
    marginTop: 8,
  },
  inputPlaceholder: { color: theme.colors.niebla, fontSize: 13 },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  suggestionTxt: { color: theme.colors.blancoCalido, fontSize: 13 },
});
