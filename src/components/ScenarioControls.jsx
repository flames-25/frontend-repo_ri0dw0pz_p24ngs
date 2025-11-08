import { useEffect, useState } from 'react';
import { Flame, Zap, Droplets, Wind } from 'lucide-react';

export default function ScenarioControls({ params, onChange, onRun }) {
  const [local, setLocal] = useState(
    params || {
      fireIntensity: 2, // 1 mild, 2 severe, 3 extreme
      outageHours: 4,
      diversion: 0.25, // 0..1
      wind: false,
      rain: false,
    }
  );

  useEffect(() => {
    onChange?.(local);
  }, [local]);

  return (
    <aside className="mx-auto max-w-6xl px-6 pb-6">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2 text-slate-700"><Flame className="h-4 w-4 text-orange-600" /><span className="text-sm font-medium">Scenario controls</span></div>
          <button onClick={() => onRun?.(local)} className="rounded-md bg-emerald-600 px-3 py-1.5 text-white text-sm hover:bg-emerald-700">Run simulation</button>
        </div>
        <div className="p-4 grid md:grid-cols-4 gap-4">
          <SliderField
            label={<span className="inline-flex items-center gap-2"><Flame className="h-4 w-4 text-orange-600" /> Fire intensity</span>}
            min={1}
            max={3}
            step={1}
            value={local.fireIntensity}
            valueLabel={['Mild', 'Severe', 'Extreme'][local.fireIntensity - 1]}
            onChange={(v) => setLocal((s) => ({ ...s, fireIntensity: v }))}
          />
          <SliderField
            label={<span className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-yellow-600" /> Outage (hrs)</span>}
            min={0}
            max={24}
            step={1}
            value={local.outageHours}
            valueLabel={`${local.outageHours}h`}
            onChange={(v) => setLocal((s) => ({ ...s, outageHours: v }))}
          />
          <SliderField
            label={<span className="inline-flex items-center gap-2"><Droplets className="h-4 w-4 text-sky-600" /> Water diversion</span>}
            min={0}
            max={1}
            step={0.05}
            value={local.diversion}
            valueLabel={`${Math.round(local.diversion * 100)}%`}
            onChange={(v) => setLocal((s) => ({ ...s, diversion: v }))}
          />
          <div className="space-y-2">
            <Toggle label={<span className="inline-flex items-center gap-2"><Wind className="h-4 w-4" /> High wind</span>} checked={local.wind} onChange={(b) => setLocal((s) => ({ ...s, wind: b }))} />
            <Toggle label="Rain event" checked={local.rain} onChange={(b) => setLocal((s) => ({ ...s, rain: b }))} />
          </div>
        </div>
      </div>
    </aside>
  );
}

function SliderField({ label, min, max, step, value, onChange, valueLabel }) {
  return (
    <label className="block text-sm">
      <div className="mb-1 text-slate-700 font-medium">{label}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="mt-1 text-xs text-slate-600">{valueLabel}</div>
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
