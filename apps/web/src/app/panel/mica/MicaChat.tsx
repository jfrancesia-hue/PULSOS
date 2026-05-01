'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Button, Badge } from '@pulso/ui';
import { Send, Sparkles, AlertTriangle } from 'lucide-react';
import { sendMicaMessage } from './actions';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  triage?: 'INFORMATIVO' | 'CONSULTA_NO_URGENTE' | 'CONSULTA_PRIORITARIA' | 'GUARDIA_INMEDIATA';
}

const SUGERENCIAS = [
  '¿Qué significa que mi colesterol total es 215?',
  'Recordame tomar enalapril a las 21h',
  '¿Qué hago si me olvido una dosis?',
];

export function MicaChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        '¡Hola! Soy Mica, tu acompañante sanitaria de Pulso. ¿En qué te puedo ayudar hoy?\n\nRecordá: Mica no reemplaza a un profesional médico.',
      triage: 'INFORMATIVO',
    },
  ]);
  const [input, setInput] = useState('');
  const [pending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  function send(text: string) {
    if (!text.trim() || pending) return;
    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    startTransition(async () => {
      const conversation = newMessages.map((m) => ({ role: m.role, content: m.content }));
      const res = await sendMicaMessage(conversation);
      if (res.ok) {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: res.data.texto, triage: res.data.triage },
        ]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: `Hubo un problema técnico: ${res.error.message}. Probá de nuevo en unos segundos.`,
          },
        ]);
      }
    });
  }

  return (
    <div className="flex h-[480px] flex-col">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <Bubble key={i} message={m} />
        ))}
        {pending ? (
          <div className="flex items-center gap-2 text-xs text-pulso-niebla">
            <Sparkles size={12} className="animate-pulse text-pulso-turquesa" />
            Mica está pensando…
          </div>
        ) : null}
      </div>

      <div className="mt-3">
        <div className="mb-2 flex flex-wrap gap-2">
          {SUGERENCIAS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              disabled={pending}
              className="rounded-md border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs text-pulso-niebla hover:border-pulso-turquesa/30 hover:text-pulso-blanco-calido"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Escribí a Mica…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={pending}
            className="h-11 flex-1 rounded-md border border-white/10 bg-pulso-azul-medianoche/60 px-4 text-sm text-pulso-blanco-calido placeholder:text-pulso-niebla/60 focus:border-pulso-turquesa focus:outline-none"
          />
          <Button type="submit" variant="primary" size="md" disabled={pending || !input.trim()}>
            <Send size={14} />
          </Button>
        </form>
      </div>
    </div>
  );
}

function Bubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const isUrgent = message.triage === 'GUARDIA_INMEDIATA';
  return (
    <div
      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'ml-12 bg-pulso-turquesa/15 text-pulso-blanco-calido'
          : isUrgent
            ? 'mr-12 border border-pulso-cobre/30 bg-pulso-cobre/10 text-pulso-blanco-calido'
            : 'mr-12 bg-pulso-azul-noche text-pulso-blanco-calido'
      }`}
    >
      {isUrgent ? (
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle size={14} className="text-pulso-cobre" />
          <Badge variant="cobre">Atención inmediata</Badge>
        </div>
      ) : null}
      {message.content.split('\n\n').map((p, i) => (
        <p key={i} className={i > 0 ? 'mt-2 text-xs italic text-pulso-niebla' : ''}>
          {p}
        </p>
      ))}
    </div>
  );
}
