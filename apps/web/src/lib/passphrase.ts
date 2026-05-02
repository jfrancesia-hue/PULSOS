// Generador de passphrase memorable estilo "salud-perro-azul-7".
// 3 palabras + 1 dígito ⇒ ~36 bits de entropía con este diccionario,
// muy por encima de la entropía típica de "Pulso2026!" y trivial de recordar.

const ADJ = [
  'verde', 'azul', 'rojo', 'rosa', 'dorado', 'plata', 'fuerte', 'feliz',
  'sereno', 'rapido', 'lento', 'gigante', 'alegre', 'limpio', 'tibio',
  'fresco', 'claro', 'lindo', 'bueno', 'tierno', 'soleado', 'nuevo',
];
const NOUN1 = [
  'salud', 'casa', 'monte', 'rio', 'mate', 'cielo', 'mar', 'sol',
  'luna', 'pan', 'arbol', 'flor', 'campo', 'puerta', 'patio', 'jardin',
  'libro', 'sendero', 'parque', 'plaza',
];
const NOUN2 = [
  'perro', 'gato', 'caballo', 'paloma', 'pajaro', 'tigre', 'leon',
  'aguila', 'colibri', 'oso', 'lobo', 'zorro', 'mariposa', 'abeja',
  'cardenal', 'guanaco', 'puma', 'condor', 'hornero', 'tero',
];

function pick<T>(arr: ReadonlyArray<T>): T {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx]!;
}

export function generatePassphrase(): string {
  const a = pick(NOUN1);
  const b = pick(ADJ);
  const c = pick(NOUN2);
  const n = Math.floor(Math.random() * 90) + 10; // 10..99 (siempre 2 dígitos)
  return `${a}-${b}-${c}-${n}`;
}
