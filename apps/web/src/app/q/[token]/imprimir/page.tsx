import { notFound } from 'next/navigation';

interface EmergencyData {
  nombre: string;
  apellido: string;
  edad: number;
  grupoSanguineo: string;
  alergias: string[];
  condicionesCriticas: string[];
  medicacionHabitual: string[];
  contactoEmergencia: { nombre: string; telefono: string; relacion: string } | null;
  cobertura: { tipo: string; obraSocial: string | null; numeroAfiliado: string | null } | null;
  emitidoEn: string;
}

async function fetchEmergency(token: string): Promise<EmergencyData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  try {
    const res = await fetch(`${apiUrl}/api/emergency/public/${token}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as EmergencyData;
  } catch {
    return null;
  }
}

export default async function QrPrintable({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const data = await fetchEmergency(token);
  if (!data) notFound();

  const grupo = data.grupoSanguineo.replace('_POSITIVO', '+').replace('_NEGATIVO', '-').replace('DESCONOCIDO', '?');

  return (
    <html lang="es-AR">
      <head>
        <title>QR Pulso · {data.nombre} {data.apellido}</title>
        <style>{`
          @page { size: A4; margin: 16mm; }
          @media print { .no-print { display: none !important; } body { background: #ffffff !important; } }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background: #f5f1ea;
            color: #0a1628;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .sheet {
            max-width: 720px;
            margin: 24px auto;
            background: #ffffff;
            border: 2px solid #d97847;
            border-radius: 16px;
            overflow: hidden;
          }
          .sheet header {
            background: linear-gradient(135deg, #0a1628, #14807a);
            color: #f5f1ea;
            padding: 24px 32px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .sheet header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: 0.04em;
          }
          .sheet header .badge {
            background: #d97847;
            color: #050b14;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
          }
          .sheet main { padding: 24px 32px 32px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
          .stat {
            border: 1px solid #d97847;
            border-radius: 10px;
            padding: 12px 16px;
          }
          .stat .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #6b7a93; }
          .stat .value { font-size: 22px; font-weight: 700; margin-top: 4px; color: #0a1628; }
          .section { margin-top: 24px; }
          .section h2 {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            color: #14807a;
            margin: 0 0 8px 0;
          }
          .section ul { margin: 0; padding-left: 18px; }
          .section li { margin-bottom: 4px; font-size: 14px; }
          .footer {
            border-top: 1px solid #e0d5c5;
            padding: 16px 32px;
            background: #fbf6ed;
            font-size: 11px;
            color: #6b7a93;
            display: flex;
            justify-content: space-between;
          }
          .toolbar {
            max-width: 720px;
            margin: 0 auto 16px auto;
            text-align: right;
          }
          .toolbar button {
            background: #2bd4c9;
            color: #050b14;
            border: 0;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
          }
        `}</style>
      </head>
      <body>
        <div className="toolbar no-print">
          <button onClick={typeof window !== 'undefined' ? () => window.print() : undefined}>
            Imprimir esta hoja
          </button>
        </div>

        <article className="sheet">
          <header>
            <h1>PULSO</h1>
            <span className="badge">Datos de emergencia</span>
          </header>
          <main>
            <h1 style={{ margin: 0, fontSize: '32px', color: '#0a1628' }}>
              {data.nombre} {data.apellido}
            </h1>
            <div style={{ marginTop: 4, fontSize: 13, color: '#6b7a93' }}>
              {data.edad} años · Emitido {new Date(data.emitidoEn).toLocaleString('es-AR')}
            </div>

            <div className="grid">
              <div className="stat">
                <div className="label">Grupo sanguíneo</div>
                <div className="value">{grupo}</div>
              </div>
              <div className="stat">
                <div className="label">Alergias críticas</div>
                <div className="value" style={{ fontSize: 14 }}>
                  {data.alergias.length === 0 ? 'Sin registrar' : data.alergias.join(' · ')}
                </div>
              </div>
              <div className="stat">
                <div className="label">Condiciones críticas</div>
                <div className="value" style={{ fontSize: 14 }}>
                  {data.condicionesCriticas.length === 0 ? 'Sin registrar' : data.condicionesCriticas.join(' · ')}
                </div>
              </div>
              <div className="stat">
                <div className="label">Cobertura</div>
                <div className="value" style={{ fontSize: 14 }}>
                  {data.cobertura
                    ? `${data.cobertura.obraSocial ?? data.cobertura.tipo}${data.cobertura.numeroAfiliado ? ' · ' + data.cobertura.numeroAfiliado : ''}`
                    : 'Sin registrar'}
                </div>
              </div>
            </div>

            {data.medicacionHabitual.length > 0 ? (
              <div className="section">
                <h2>Medicación habitual</h2>
                <ul>
                  {data.medicacionHabitual.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {data.contactoEmergencia ? (
              <div className="section">
                <h2>Contacto de emergencia</h2>
                <p style={{ margin: 0, fontSize: 14 }}>
                  <strong>{data.contactoEmergencia.nombre}</strong> · {data.contactoEmergencia.relacion} · {data.contactoEmergencia.telefono}
                </p>
              </div>
            ) : null}

            <div className="section">
              <h2>Verificable en línea</h2>
              <p style={{ margin: 0, fontSize: 13, color: '#475873' }}>
                Escaneá el QR digital o ingresá a la URL pública para datos en tiempo real.
                Cualquier acceso queda registrado en el log de auditoría del ciudadano.
              </p>
            </div>
          </main>
          <div className="footer">
            <span>Pulso · Plataforma de salud digital argentina</span>
            <span>Por Nativos Consultora Digital</span>
          </div>
        </article>
      </body>
    </html>
  );
}
