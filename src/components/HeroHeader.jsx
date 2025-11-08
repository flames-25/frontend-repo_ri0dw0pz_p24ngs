import { Flame, Shield, Droplets, Zap } from 'lucide-react';

export default function HeroHeader({ started, onStart }) {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-amber-50 to-sky-50 pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 ring-1 ring-black/5 shadow-sm">
            <Shield className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-medium text-slate-700">AquaShield · Wildfire-Resilient Farm Simulator</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-900">
            Plan your farm’s wildfire resilience in minutes
          </h1>
          <p className="max-w-2xl text-slate-600 text-sm md:text-base">
            Model water, power, and fire scenarios. Discover weak points before the next red flag warning.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-2">
            <FeatureBadge icon={<Flame className="h-4 w-4 text-orange-600" />} label="Fire scenarios" />
            <FeatureBadge icon={<Zap className="h-4 w-4 text-yellow-600" />} label="Grid outages" />
            <FeatureBadge icon={<Droplets className="h-4 w-4 text-sky-600" />} label="Tank depletion" />
            <FeatureBadge icon={<Shield className="h-4 w-4 text-emerald-600" />} label="Actionable advice" />
          </div>

          <div className="mt-6">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-white shadow hover:bg-emerald-700 active:bg-emerald-800 transition"
            >
              {started ? 'Update setup' : 'Start setup wizard'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function FeatureBadge({ icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 ring-1 ring-black/5 shadow-sm text-xs md:text-sm text-slate-700">
      {icon}
      <span>{label}</span>
    </div>
  );
}
