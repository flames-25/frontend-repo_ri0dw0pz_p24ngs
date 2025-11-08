import { useState } from 'react';
import HeroHeader from './components/HeroHeader';
import SetupWizard from './components/SetupWizard';
import ScenarioControls from './components/ScenarioControls';
import ResultsPanel from './components/ResultsPanel';

function FarmGrid({ setup }) {
  const size = 6;
  const cells = Array.from({ length: size * size });
  return (
    <div className="mx-auto max-w-6xl px-6 pb-6">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-slate-700">Farm layout</p>
          <div className="text-xs text-slate-500">{setup?.tanks ?? 0} tanks · {setup?.pumps ?? 0} pumps · {setup?.solarKw ?? 0} kW solar</div>
        </div>
        <div className="grid grid-cols-6 gap-1">
          {cells.map((_, i) => (
            <div key={i} className="aspect-square rounded-md bg-gradient-to-br from-slate-50 to-slate-100 ring-1 ring-slate-200 flex items-center justify-center text-[10px] text-slate-500">{i + 1}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [setup, setSetup] = useState();
  const [params, setParams] = useState();
  const [result, setResult] = useState();

  const runSimulation = (p) => {
    const current = p || params;
    setParams(current);
    const payload = { setup, params: current };
    // For MVP, compute basic results on the client. Backend can replace later.
    setResult(payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <HeroHeader started={!!setup} onStart={() => window.scrollTo({ top: window.innerHeight * 0.5, behavior: 'smooth' })} />
      <SetupWizard value={setup} onChange={setSetup} />
      <FarmGrid setup={setup} />
      <ScenarioControls params={params} onChange={setParams} onRun={runSimulation} />
      <ResultsPanel setup={setup} params={params} result={result} />
      <footer className="mx-auto max-w-6xl px-6 py-10 text-center text-xs text-slate-500">© {new Date().getFullYear()} AquaShield MVP</footer>
    </div>
  );
}
