'use client';

import { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  hint?: string;
  showStrength?: boolean;
  rightSlot?: React.ReactNode;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      name,
      label,
      placeholder = '',
      required,
      minLength = 8,
      autoComplete = 'current-password',
      defaultValue,
      value,
      onChange,
      hint,
      showStrength = false,
      rightSlot,
    },
    ref,
  ) => {
    const [shown, setShown] = useState(false);
    const [internal, setInternal] = useState(defaultValue ?? '');
    const id = useId();
    const current = value ?? internal;

    const handleChange = (next: string) => {
      if (onChange) onChange(next);
      else setInternal(next);
    };

    const strength = showStrength ? computeStrength(current) : null;

    return (
      <div className="block">
        {label ? (
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor={id} className="text-sm font-medium">
              {label}
            </label>
            {rightSlot ? <div className="text-xs">{rightSlot}</div> : null}
          </div>
        ) : null}
        <div className="relative">
          <input
            id={id}
            ref={ref}
            name={name}
            type={shown ? 'text' : 'password'}
            required={required}
            minLength={minLength}
            autoComplete={autoComplete}
            placeholder={placeholder}
            value={current}
            onChange={(e) => handleChange(e.target.value)}
            className="h-12 w-full rounded-md border border-white/10 bg-pulso-azul-medianoche/60 px-4 pr-12 text-base text-pulso-blanco-calido placeholder:text-pulso-niebla/60 focus:border-pulso-turquesa focus:outline-none focus:ring-2 focus:ring-pulso-turquesa/30"
          />
          <button
            type="button"
            onClick={() => setShown((s) => !s)}
            tabIndex={-1}
            aria-label={shown ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="press absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-pulso-niebla transition-colors hover:bg-white/5 hover:text-pulso-turquesa"
          >
            {shown ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {hint ? <p className="mt-1.5 text-xs text-pulso-niebla">{hint}</p> : null}
        {strength ? <StrengthBar strength={strength} /> : null}
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';

interface Strength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
}

function computeStrength(pwd: string): Strength {
  if (!pwd) return { score: 0, label: 'Escribí tu contraseña', color: 'bg-white/10' };
  let s = 0;
  if (pwd.length >= 8) s++;
  if (pwd.length >= 12) s++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) s++;
  if (/\d/.test(pwd) || /[^a-zA-Z0-9]/.test(pwd)) s++;
  const score = Math.min(4, s) as 0 | 1 | 2 | 3 | 4;
  switch (score) {
    case 0:
    case 1:
      return { score, label: 'Muy corta — agregá más caracteres', color: 'bg-danger' };
    case 2:
      return { score, label: 'Aceptable', color: 'bg-pulso-cobre' };
    case 3:
      return { score, label: 'Buena 👍', color: 'bg-pulso-turquesa' };
    case 4:
      return { score, label: 'Excelente 🛡️', color: 'bg-success' };
  }
}

function StrengthBar({ strength }: { strength: Strength }) {
  const filled = strength.score;
  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= filled ? strength.color : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      <p
        className={`mt-1.5 text-xs ${
          filled <= 1
            ? 'text-danger'
            : filled === 2
              ? 'text-pulso-cobre'
              : filled === 3
                ? 'text-pulso-turquesa'
                : 'text-success'
        }`}
      >
        {strength.label}
      </p>
    </div>
  );
}
