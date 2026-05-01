# Pulso · Design System

> Tokens, componentes, principios visuales.

---

## Filosofía

Pulso debe sentirse como **una evolución premium de Nativos Consultora Digital** — territorial, argentina, institucional, moderna, humana, tecnológica, confiable, cálida, de primer mundo.

Inspiraciones:

- **Apple Health** — simplicidad clínica del ciudadano.
- **One Medical** — calidez profesional.
- **Oscar Health** — modernidad UX en seguros de salud.
- **Palantir Foundry** — densidad institucional para gobierno.
- **Linear / Vercel / Stripe** — pulido detallista de UI moderna.
- **mi.argentina.gob.ar** (mejor versión) — institucional argentino.

A evitar:

- Estética hospitalaria vieja (verde menta clínico, fonts genéricos).
- SaaS Bootstrap-ish (cards aburridas, paleta sobreutilizada).
- Cripto / web3 / "futurista neón".
- Diseño infantil o gamificado de más.
- Exceso de emojis o iconografía decorativa.

---

## Tokens

### Color

Paleta de marca con tema oscuro como **default** (las imágenes referencia son tema oscuro). Tema claro disponible para impresión y accesibilidad.

#### Brand

```css
--pulso-azul-profundo:   #0A1628;  /* Fondo principal, secciones serias */
--pulso-azul-noche:      #0F1F3D;  /* Cards sobre fondo principal */
--pulso-azul-medianoche: #050B14;  /* Capas más profundas, footer */

--pulso-turquesa:        #2BD4C9;  /* Acento principal Nativos */
--pulso-turquesa-glow:   #5EE7DE;  /* Hover, glow sutil */
--pulso-turquesa-deep:   #14807A;  /* Acentos sobre fondo claro */

--pulso-cobre:           #D97847;  /* Acento secundario, mineral argentino */
--pulso-cobre-deep:      #A85829;  /* Hover de cobre */

--pulso-blanco-calido:   #F5F1EA;  /* Texto principal sobre oscuro */
--pulso-niebla:          #C7CDD9;  /* Texto secundario sobre oscuro */
```

#### Estados

```css
--pulso-success:  #2BD49A;  /* Verde turquesa-tirando-a-vegetal */
--pulso-warning:  #F5B647;  /* Ámbar institucional */
--pulso-danger:   #E55A4C;  /* Rojo coral, no estridente */
--pulso-info:     #4FA3F0;  /* Azul info */
```

#### Neutros (escala del oscuro al claro)

```css
--neutral-950: #050B14;
--neutral-900: #0A1628;
--neutral-800: #0F1F3D;
--neutral-700: #1A2D4F;
--neutral-600: #2A3F5F;
--neutral-500: #475873;
--neutral-400: #6B7A93;
--neutral-300: #94A0B5;
--neutral-200: #BBC4D2;
--neutral-100: #DDE2EB;
--neutral-50:  #F5F1EA;
```

### Tipografía

Pareja: **Manrope** (display, headings) + **Inter** (body, UI).

```css
--font-display: 'Manrope', system-ui, sans-serif;
--font-body:    'Inter', system-ui, sans-serif;
--font-mono:    'JetBrains Mono', 'Fira Code', monospace;
```

Escala (mobile-first, escala fluida):

| Token | rem | px | Uso |
| --- | --- | --- | --- |
| `text-2xs` | 0.625 | 10 | Labels minúsculas, badges |
| `text-xs` | 0.75 | 12 | Captions |
| `text-sm` | 0.875 | 14 | Body secundario |
| `text-base` | 1 | 16 | Body |
| `text-lg` | 1.125 | 18 | Body grande |
| `text-xl` | 1.25 | 20 | h5 |
| `text-2xl` | 1.5 | 24 | h4 |
| `text-3xl` | 1.875 | 30 | h3 |
| `text-4xl` | 2.25 | 36 | h2 |
| `text-5xl` | 3 | 48 | h1 desktop |
| `text-6xl` | 3.75 | 60 | hero |
| `text-7xl` | 4.5 | 72 | hero XL |

Pesos: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (display).

### Spacing

Escala de 4px (`0.25rem`):

```
0   → 0
1   → 4px
2   → 8px
3   → 12px
4   → 16px
5   → 20px
6   → 24px
8   → 32px
10  → 40px
12  → 48px
16  → 64px
20  → 80px
24  → 96px
32  → 128px
```

### Radii

```
--radius-xs:   4px;   /* badges, chips */
--radius-sm:   8px;   /* botones secundarios */
--radius-md:  12px;   /* botones primarios, inputs */
--radius-lg:  16px;   /* cards */
--radius-xl:  24px;   /* cards grandes, modales */
--radius-2xl: 32px;   /* hero panels */
--radius-full: 9999px;
```

### Sombras

Diseñadas para tema oscuro (sombras sutiles + glow turquesa).

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
--shadow-md: 0 4px 12px rgba(0,0,0,0.35);
--shadow-lg: 0 12px 32px rgba(0,0,0,0.45);
--shadow-xl: 0 24px 64px rgba(0,0,0,0.5);

--shadow-glow-turquesa: 0 0 32px rgba(43,212,201,0.25);
--shadow-glow-cobre:    0 0 32px rgba(217,120,71,0.20);
```

### Glassmorphism (uso moderado)

```css
--glass-bg:     rgba(15,31,61,0.6);
--glass-border: rgba(43,212,201,0.15);
--glass-blur:   blur(16px);
```

---

## Componentes

`packages/ui` exporta los siguientes componentes (todos en TypeScript, todos accesibles según WCAG 2.1 AA):

### Base

- `Button` — variantes: `primary`, `secondary`, `ghost`, `outline`, `danger`. Tamaños: `sm`, `md`, `lg`.
- `Input` — text, email, password, search.
- `Textarea`
- `Select` — base-ui (no Radix). Soporta `null` en `onValueChange`.
- `Checkbox` / `Radio` / `Switch`
- `Badge` — variantes: `neutral`, `success`, `warning`, `danger`, `info`, `turquesa`, `cobre`.
- `Avatar` — con fallback a iniciales.

### Layout

- `Card` — variantes: `default`, `glass`, `elevated`.
- `Sidebar` — colapsable, con sub-items, estado activo.
- `Topbar` — con search, notifications, user menu.
- `Container` — max-width responsive.
- `Stack` / `HStack` / `VStack` — wrappers de flexbox.

### Datos

- `Table` — sortable, filterable, paginable.
- `Stat` — KPI grande con label, value, delta.
- `Timeline` — para historia clínica.
- `Empty` — empty state premium con ilustración.
- `Loading` — skeleton + spinner sutil.
- `ErrorState` — recuperable.

### Salud (específicos Pulso)

- `EmergencyCard` — tarjeta crítica con QR + datos vitales.
- `ConsentBanner` — banner para solicitar consentimiento explícito.
- `VitalSign` — métrica clínica con rango normal.
- `MedicationItem` — item de medicación con dosis, frecuencia, alerta.
- `MicaBubble` — burbuja de chat de Mica con indicador "no es consejo médico".

### Gráficos

- `LineChart` / `AreaChart` / `BarChart` / `DonutChart` — wrappers sobre `recharts` con paleta Pulso.
- `MapaArgentina` — SVG con datos por provincia (epidemiológico).

---

## Microinteracciones

- **Hover en cards**: lift de 2-4px + sombra incrementada (transición 200ms ease-out).
- **Focus ring**: outline turquesa 2px con offset 2px. Visible siempre por accesibilidad.
- **Loading shimmer**: gradiente sutil neutral-700 → neutral-600 → neutral-700 (no banding).
- **Page transitions**: fade 150ms (no slide).
- **GSAP**: solo en landing pública (hero, secciones scroll-trigger). Respetar `prefers-reduced-motion`.

---

## Accesibilidad

- WCAG 2.1 AA mínimo, AAA donde sea posible.
- Contraste 4.5:1 mínimo en body, 3:1 en textos grandes.
- Navegación por teclado completa.
- ARIA labels en componentes interactivos.
- `prefers-reduced-motion` respetado en todas las animaciones.
- `prefers-color-scheme` respetado (default oscuro).
- Tamaño táctil mínimo 44x44px.

---

## Voz y tono

- **Voz**: institucional, cálida, clara. No técnica, no marketinera, no jerga clínica innecesaria.
- **Tono**: español argentino. Vos, no tú. Pero formal cuando comunica con instituciones o gobierno.
- **Microcopy**:
  - Botón primario: verbo de acción claro. "Generar QR", "Compartir con profesional", "Subir estudio".
  - Empty states: humanos. "Acá vas a ver tu medicación habitual cuando un profesional la cargue."
  - Errores: explican qué pasó y qué hacer. "No pudimos verificar tu DNI. Probá ingresarlo sin puntos ni guiones."
  - Consentimiento: serio y educativo. "Estás autorizando al Dr. González (M.N. 12345) a ver tu perfil clínico durante 24 horas. Podés revocar este acceso en cualquier momento."

---

## Recursos visuales

- **Fotografía**: documental, real, argentina. Personas reales (no stock obvio), profesionales reales (no actores), escenarios reales (consultorios, guardias, farmacias del país).
- **3D médico**: corazón, neuronas, células — cuando aporten al storytelling. Estilo realista, no caricaturesco.
- **Mapas**: mapas reales de Argentina por provincia. Líneas topográficas sutiles como decoración (no protagonista).
- **Iconografía**: stroke 1.5px, esquinas redondeadas suaves. Familia: **Lucide** (con `Globe` reemplazando `Instagram` ya removido).
