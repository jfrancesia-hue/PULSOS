'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Button } from '@pulso/ui';
import { CheckCheck, Bell, AlertTriangle, ShieldCheck, FileText, Sparkles } from 'lucide-react';
import { markReadAction, markAllReadAction } from './actions';

interface NotificationItem {
  id: string;
  channel: string;
  category: string;
  status: string;
  title: string;
  body: string;
  payload: Record<string, unknown> | null;
  createdAt: string;
  readAt: string | null;
}

const CATEGORY_ICON: Record<string, typeof Bell> = {
  EMERGENCY_QR_ACCESSED: AlertTriangle,
  CONSENT_REQUEST: ShieldCheck,
  CONSENT_GRANTED: ShieldCheck,
  CLINICAL_RECORD_ADDED: FileText,
  PRESCRIPTION_ISSUED: FileText,
  MEDICATION_REMINDER: Bell,
  EMAIL_VERIFICATION: CheckCheck,
  PASSWORD_RESET: ShieldCheck,
  WELCOME: Sparkles,
};

const CATEGORY_ACCENT: Record<string, 'turquesa' | 'cobre'> = {
  EMERGENCY_QR_ACCESSED: 'cobre',
  PRESCRIPTION_ISSUED: 'turquesa',
};

export function NotificationsList({ items }: { items: NotificationItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function open(item: NotificationItem) {
    startTransition(async () => {
      await markReadAction(item.id);
      const url = (item.payload as Record<string, string> | null)?.actionUrl;
      if (url) {
        router.push(url);
      } else {
        router.refresh();
      }
    });
  }

  function markAll() {
    startTransition(async () => {
      await markAllReadAction();
      router.refresh();
    });
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button variant="ghost" size="sm" onClick={markAll} disabled={pending}>
          <CheckCheck size={12} />
          Marcar todo como leído
        </Button>
      </div>
      <ul className="divide-y divide-white/5">
        {items.map((n) => {
          const Icon = CATEGORY_ICON[n.category] ?? Bell;
          const accent = CATEGORY_ACCENT[n.category] ?? 'turquesa';
          const unread = !n.readAt;
          return (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => open(n)}
                className={`flex w-full items-start gap-3 px-1 py-3 text-left transition-colors hover:bg-white/[0.02] ${unread ? '' : 'opacity-70'}`}
              >
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md ${
                    accent === 'cobre'
                      ? 'bg-pulso-cobre/15 text-pulso-cobre'
                      : 'bg-pulso-turquesa/15 text-pulso-turquesa'
                  }`}
                >
                  <Icon size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-pulso-blanco-calido">{n.title}</div>
                    <div className="text-2xs text-pulso-niebla">
                      {new Date(n.createdAt).toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-xs text-pulso-niebla">{n.body}</div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge variant="neutral">{n.channel.toLowerCase()}</Badge>
                    {unread ? <Badge variant="turquesa">Nueva</Badge> : null}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
