import { useMemo } from 'react';
import { AlertTriangle, Clock, Droplets, BatteryCharging, ShieldCheck } from 'lucide-react';

export default function ResultsPanel({ setup, params, result }) {
  const summary = useMemo(() => summarize(setup, params, result), [setup, params, result]);

  return (
    <section className="mx-auto max-w-6xl px-6 pb-10">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 text-slate-700">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-medium">Scenario results</h3>
        </div>
        <div className="p-4 grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <KPICard icon={<Clock className="h-4 w-4" />} label="Time to first failure" value={summary.firstFailure} tone="amber" />
            <KPICard icon={<Droplets className="h-4 w-4" />} label="Water autonomy" value={summary.waterHours} tone="sky" />
            <KPICard icon={<BatteryCharging className="h-4 w-4" />} label="Power autonomy" value={summary.powerHours} tone="violet" />
          </div>
          <div className="md:col-span-2">
            <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-700">
              <p className="font-medium mb-2">Recommendations</p>
              <ul className="list-disc pl-5 space-y-1">
                {summary.recs.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              {summary.riskNote && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-amber-50 text-amber-800 px-3 py-2 ring-1 ring-amber-200">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs">{summary.riskNote}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function KPICard({ icon, label, value, tone = 'emerald' }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    amber: 'bg-amber-50 text-amber-800 ring-amber-200',
    sky: 'bg-sky-50 text-sky-700 ring-sky-200',
    violet: 'bg-violet-50 text-violet-700 ring-violet-200',
  };
  return (
    <div className={`rounded-lg ${tones[tone]} ring-1 p-3 flex items-center justify-between`}>
      <div className="flex items-center gap-2 text-sm font-medium">{icon}{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function summarize(setup, params, result) {
  if (!setup || !params) {
    return { firstFailure: '—', waterHours: '—', powerHours: '—', recs: [], riskNote: '' };
  }
  const pumps = setup?.pumps ?? 1;
  const tanks = setup?.tanks ?? 1;
  const tankSize = setup?.tankSize ?? 1000;
  const solarKw = setup?.solarKw ?? 0;
  const pumpDrawKw = 1.5 * pumps;
  const pumpRateGpm = 20 * pumps * (1 - (params?.diversion ?? 0));
  const totalGal = tanks * tankSize;
  const waterHours = pumpRateGpm > 0 ? Math.max(0, Math.round((totalGal / (pumpRateGpm * 60)) * 10) / 10) : Infinity;
  const powerHours = solarKw > 0 ? Math.round((solarKw / pumpDrawKw) * 6) : 0; // 6h usable daylight
  const firstFailure = Math.min(waterHours || Infinity, (params?.outageHours ?? 0) > 0 ? params.outageHours : powerHours || Infinity);

  const recs = [];
  if (waterHours < 4) recs.push('Increase tank capacity or reduce irrigation rate to achieve at least 4 hours of autonomy.');
  if (powerHours < 4) recs.push('Add solar or backup power to keep pumps running for a minimum of 4 hours.');
  if ((params?.fireIntensity ?? 1) >= 3) recs.push('Prepare fire breaks and non-combustible zones near tanks and pump houses.');
  if ((params?.wind ?? false)) recs.push('High winds detected: secure loose equipment and consider additional water staging.');

  return {
    firstFailure: isFinite(firstFailure) ? `${firstFailure} h` : '—',
    waterHours: isFinite(waterHours) ? `${waterHours} h` : '—',
    powerHours: isFinite(powerHours) ? `${powerHours} h` : '—',
    recs: recs.length ? recs : ['Configuration looks balanced for this scenario.'],
    riskNote: params?.outageHours > powerHours ? 'Grid outage exceeds on-site power autonomy.' : '',
  };
}
