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
  rightSlot?: React.ReactNode;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ name, label, placeholder = '', required, minLength = 8, autoComplete = 'current-password', defaultValue, rightSlot }, ref) => {
    const [shown, setShown] = useState(false);
    const id = useId();

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
            defaultValue={defaultValue}
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
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
