'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, Button, Input, Badge } from '@pulso/ui';
import { Save, Plus, X } from 'lucide-react';
import { saveProfileAction } from './actions';

interface AlergiaItem { sustancia: string; severidad: string; notas?: string }
interface MedicacionItem { nombre: string; presentacion?: string; posologia?: string; motivo?: string }
interface CondicionItem { codigo?: string; nombre: string; notas?: string }

interface CitizenProfile {
  nombre: string;
  apellido: string;
  localidad: string | null;
  telefono: string | null;
  alergias: AlergiaItem[];
  medicacionHabitual: MedicacionItem[];
  condicionesCriticas: CondicionItem[];
  contactoEmergencia: { nombre: string; telefono: string; relacion: string } | null;
}

export function ProfileForm({ profile }: { profile: CitizenProfile }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const [nombre, setNombre] = useState(profile.nombre);
  const [apellido, setApellido] = useState(profile.apellido);
  const [localidad, setLocalidad] = useState(profile.localidad ?? '');
  const [telefono, setTelefono] = useState(profile.telefono ?? '');

  const [alergias, setAlergias] = useState<AlergiaItem[]>(profile.alergias);
  const [medicacion, setMedicacion] = useState<MedicacionItem[]>(profile.medicacionHabitual);
  const [condiciones, setCondiciones] = useState<CondicionItem[]>(profile.condicionesCriticas);

  const [contactoNombre, setContactoNombre] = useState(profile.contactoEmergencia?.nombre ?? '');
  const [contactoTel, setContactoTel] = useState(profile.contactoEmergencia?.telefono ?? '');
  const [contactoRel, setContactoRel] = useState(profile.contactoEmergencia?.relacion ?? 'OTRO');

  function save() {
    setFeedback(null);
    startTransition(async () => {
      const res = await saveProfileAction({
        basic: { nombre, apellido, localidad, telefono },
        alergias,
        medicacion,
        condiciones,
        contacto: contactoNombre
          ? { nombre: contactoNombre, telefono: contactoTel, relacion: contactoRel }
          : null,
      });
      setFeedback(res);
      if (res.ok) router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
          <CardDescription>Esta información viaja en tu QR de emergencia.</CardDescription>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre"><Input value={nombre} onChange={(e) => setNombre(e.target.value)} /></Field>
          <Field label="Apellido"><Input value={apellido} onChange={(e) => setApellido(e.target.value)} /></Field>
          <Field label="Localidad"><Input value={localidad} onChange={(e) => setLocalidad(e.target.value)} /></Field>
          <Field label="Teléfono"><Input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+54 9 11 …" /></Field>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Contacto de emergencia</CardTitle>
              <CardDescription>A quién llamar si pasa algo serio.</CardDescription>
            </div>
            <Badge variant="cobre">Crítico</Badge>
          </div>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Nombre"><Input value={contactoNombre} onChange={(e) => setContactoNombre(e.target.value)} /></Field>
          <Field label="Teléfono"><Input value={contactoTel} onChange={(e) => setContactoTel(e.target.value)} /></Field>
          <Field label="Relación">
            <select
              value={contactoRel}
              onChange={(e) => setContactoRel(e.target.value)}
              className="h-11 w-full rounded-md border border-white/10 bg-pulso-azul-medianoche/60 px-4 text-sm text-pulso-blanco-calido focus:border-pulso-turquesa focus:outline-none"
            >
              {['PADRE', 'MADRE', 'HIJO', 'CONYUGE', 'HERMANO', 'AMIGO', 'OTRO'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </Field>
        </div>
      </Card>

      <ListEditor<AlergiaItem>
        title="Alergias"
        description="Sustancias y la severidad. Crítico para emergencias."
        accent="cobre"
        items={alergias}
        onChange={setAlergias}
        empty={{ sustancia: '', severidad: 'LEVE' }}
        renderItem={(item, set) => (
          <>
            <Input
              placeholder="Sustancia (Penicilina, Polen…)"
              value={item.sustancia}
              onChange={(e) => set({ ...item, sustancia: e.target.value })}
            />
            <select
              value={item.severidad}
              onChange={(e) => set({ ...item, severidad: e.target.value })}
              className="h-11 rounded-md border border-white/10 bg-pulso-azul-medianoche/60 px-4 text-sm text-pulso-blanco-calido focus:border-pulso-turquesa focus:outline-none"
            >
              {['LEVE', 'MODERADA', 'SEVERA', 'ANAFILACTICA'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </>
        )}
      />

      <ListEditor<CondicionItem>
        title="Condiciones críticas"
        description="Patologías relevantes que un profesional necesita conocer."
        accent="turquesa"
        items={condiciones}
        onChange={setCondiciones}
        empty={{ codigo: '', nombre: '' }}
        renderItem={(item, set) => (
          <>
            <Input
              placeholder="Nombre (Hipertensión, Diabetes T2…)"
              value={item.nombre}
              onChange={(e) => set({ ...item, nombre: e.target.value })}
            />
            <Input
              placeholder="Código CIE-10 (opcional)"
              value={item.codigo ?? ''}
              onChange={(e) => set({ ...item, codigo: e.target.value })}
            />
          </>
        )}
      />

      <ListEditor<MedicacionItem>
        title="Medicación habitual"
        description="Lo que tomás regularmente."
        accent="turquesa"
        items={medicacion}
        onChange={setMedicacion}
        empty={{ nombre: '' }}
        renderItem={(item, set) => (
          <>
            <Input
              placeholder="Nombre (Enalapril, Metformina…)"
              value={item.nombre}
              onChange={(e) => set({ ...item, nombre: e.target.value })}
            />
            <Input
              placeholder="Presentación (10mg, 850mg…)"
              value={item.presentacion ?? ''}
              onChange={(e) => set({ ...item, presentacion: e.target.value })}
            />
            <Input
              placeholder="Posología (1 cada 12 hs…)"
              value={item.posologia ?? ''}
              onChange={(e) => set({ ...item, posologia: e.target.value })}
            />
          </>
        )}
      />

      <div className="sticky bottom-6 flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-pulso-azul-noche/95 p-4 backdrop-blur-xl">
        <div className="text-xs text-pulso-niebla">
          Tus cambios quedan registrados con timestamp en el log de auditoría.
        </div>
        <div className="flex items-center gap-3">
          {feedback ? (
            <span className={feedback.ok ? 'text-success text-xs' : 'text-danger text-xs'}>
              {feedback.msg}
            </span>
          ) : null}
          <Button onClick={save} disabled={pending} size="md" variant="primary">
            <Save size={14} />
            {pending ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-pulso-niebla">
        {label}
      </span>
      {children}
    </label>
  );
}

interface ListEditorProps<T> {
  title: string;
  description: string;
  accent: 'turquesa' | 'cobre';
  items: T[];
  onChange: (items: T[]) => void;
  empty: T;
  renderItem: (item: T, set: (item: T) => void) => React.ReactNode;
}

function ListEditor<T>({ title, description, accent, items, onChange, empty, renderItem }: ListEditorProps<T>) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant={accent}>{items.length}</Badge>
        </div>
      </CardHeader>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-md border border-white/5 bg-white/[0.02] p-3"
          >
            <div className="grid flex-1 gap-3 sm:grid-cols-3">
              {renderItem(item, (next) => {
                const copy = [...items];
                copy[i] = next;
                onChange(copy);
              })}
            </div>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md text-pulso-niebla hover:bg-white/[0.05] hover:text-danger"
              aria-label={`Quitar ${i + 1}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, empty])}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-white/10 px-4 py-3 text-sm text-pulso-niebla hover:border-pulso-turquesa/30 hover:text-pulso-turquesa"
        >
          <Plus size={14} />
          Agregar
        </button>
      </div>
    </Card>
  );
}
