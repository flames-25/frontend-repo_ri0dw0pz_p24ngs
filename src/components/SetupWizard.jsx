import { useState } from 'react';
import { Map, Factory, Leaf, Droplets, Wind } from 'lucide-react';

export default function SetupWizard({ value, onChange }) {
  const [local, setLocal] = useState(
    value || {
      name: '',
      region: 'California',
      farmType: 'mixed',
      tanks: 2,
      tankSize: 5000,
      pumps: 1,
      solarKw: 5,
    }
  );

  const update = (patch) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onChange?.(next);
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Location & type" icon={<Map className="h-4 w-4" />}> 
          <div className="space-y-3">
            <Field label="Farm name">
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g., Riverbend Ranch"
                value={local.name}
                onChange={(e) => update({ name: e.target.value })}
              />
            </Field>
            <Field label="Region">
              <select
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={local.region}
                onChange={(e) => update({ region: e.target.value })}
              >
                <option>California</option>
                <option>Oregon</option>
                <option>Washington</option>
                <option>Arizona</option>
                <option>Texas</option>
              </select>
            </Field>
            <Field label="Farm type">
              <div className="grid grid-cols-3 gap-2 text-sm">
                {[
                  { key: 'orchard', label: 'Orchard', icon: <Leaf className="h-4 w-4" /> },
                  { key: 'livestock', label: 'Livestock', icon: <Factory className="h-4 w-4" /> },
                  { key: 'mixed', label: 'Mixed', icon: <Factory className="h-4 w-4" /> },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => update({ farmType: t.key })}
                    className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 ${
                      local.farmType === t.key
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </Card>

        <Card title="Water & power" icon={<Droplets className="h-4 w-4" />}> 
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Tanks"
              value={local.tanks}
              min={0}
              max={10}
              onChange={(v) => update({ tanks: v })}
            />
            <NumberField
              label="Tank size (gal)"
              value={local.tankSize}
              step={500}
              min={0}
              onChange={(v) => update({ tankSize: v })}
            />
            <NumberField
              label="Pumps"
              value={local.pumps}
              min={0}
              max={10}
              onChange={(v) => update({ pumps: v })}
            />
            <NumberField
              label="Solar (kW)"
              value={local.solarKw}
              step={1}
              min={0}
              onChange={(v) => update({ solarKw: v })}
            />
          </div>
        </Card>

        <Card title="Assumptions" icon={<Wind className="h-4 w-4" />}> 
          <ul className="text-sm text-slate-600 list-disc pl-4 space-y-2">
            <li>Default pump draw: 1.5 kW per pump</li>
            <li>Default irrigation rate: 20 gal/min per pump</li>
            <li>Solar usable during daytime only</li>
          </ul>
        </Card>
      </div>
    </section>
  );
}

function Card({ title, icon, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 text-slate-700">
        {icon}
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm">
      <div className="mb-1 text-slate-700 font-medium">{label}</div>
      {children}
    </label>
  );
}

function NumberField({ label, value, onChange, min = 0, max = 1000, step = 1 }) {
  const clamp = (n) => Math.max(min, Math.min(max, n));
  return (
    <Field label={label}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        min={min}
        max={max}
        step={step}
      />
    </Field>
  );
}
