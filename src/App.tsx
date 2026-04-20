/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  AreaChart as AreaIcon, 
  LineChart as LineIcon, 
  PieChart as PieIcon, 
  Activity, 
  LayoutDashboard, 
  Settings2,
  Database,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { ChartWrapper } from './components/ChartWrapper';
import { StatCard } from './components/StatCard';
import { MOCK_DATASETS } from './data/mockDatasets';
import { ChartType, DashboardState } from './types/dashboard';
import { cn } from './lib/utils';

export default function App() {
  const [state, setState] = useState<DashboardState>({
    selectedDatasetId: MOCK_DATASETS[0].id,
    chartType: 'area',
    showGrid: true,
    isAnimationActive: true,
  });

  const selectedDataset = useMemo(() => 
    MOCK_DATASETS.find(d => d.id === state.selectedDatasetId) || MOCK_DATASETS[0],
    [state.selectedDatasetId]
  );

  const stats = useMemo(() => {
    const data = selectedDataset.data;
    const lastValue = data[data.length - 1].value;
    const firstValue = data[0].value;
    const average = Math.round(data.reduce((acc, curr) => acc + curr.value, 0) / data.length);
    const growth = Math.round(((lastValue - firstValue) / firstValue) * 100);
    
    return [
      { label: 'Current Value', value: lastValue.toLocaleString(), change: growth, suffix: '' },
      { label: 'Average Output', value: average.toLocaleString(), change: undefined, suffix: '' },
      { label: 'Peak Efficiency', value: '98.2', change: 2.4, suffix: '%' },
      { label: 'System Load', value: '14', change: -8, suffix: 'ms' },
    ];
  }, [selectedDataset]);

  return (
    <div className="relative min-h-screen text-slate-200 overflow-hidden font-sans">
      <div className="mesh-bg" />
      
      <div className="flex h-screen w-full overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 glass-panel flex flex-col p-6 space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              N
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Nexus.io</span>
          </div>

          <nav className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">
              Datasets
            </div>
            <div className="flex flex-col gap-1">
              {MOCK_DATASETS.map((dataset) => (
                <button
                  key={dataset.id}
                  onClick={() => setState(s => ({ ...s, selectedDatasetId: dataset.id }))}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-sm font-medium",
                    state.selectedDatasetId === dataset.id 
                      ? "bg-white/10 text-white" 
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  <Database className={cn(
                    "w-4 h-4 opacity-70",
                    state.selectedDatasetId === dataset.id ? "text-indigo-400" : ""
                  )} />
                  {dataset.name}
                </button>
              ))}
            </div>
          </nav>

          <nav className="space-y-1 pt-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">
              Visualization
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['area', 'bar', 'line', 'pie', 'composed'] as ChartType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setState(s => ({ ...s, chartType: type }))}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-1.5",
                    state.chartType === type 
                      ? "bg-indigo-500/10 border-indigo-500/30 text-white" 
                      : "bg-white/3 border-white/5 text-slate-400 hover:bg-white/5"
                  )}
                >
                  {type === 'area' && <AreaIcon className="w-4 h-4" />}
                  {type === 'bar' && <BarChart3 className="w-4 h-4" />}
                  {type === 'line' && <LineIcon className="w-4 h-4" />}
                  {type === 'pie' && <PieIcon className="w-4 h-4" />}
                  {type === 'composed' && <LayoutDashboard className="w-4 h-4" />}
                  <span className="text-[10px] uppercase font-bold tracking-tight">{type}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="mt-auto">
            <div className="glass-card p-4 rounded-2xl bg-indigo-500/10 border-indigo-500/20">
              <p className="text-xs text-indigo-300 font-medium mb-1">Pro Plan</p>
              <p className="text-sm text-slate-300 leading-relaxed">Unlock modular widgets and custom data connectors.</p>
              <button className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-indigo-600/20">
                Upgrade
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col p-8 overflow-y-auto">
          <header className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-white tracking-tight">System Performance</h1>
              <p className="text-slate-400 text-sm">Real-time metrics from {selectedDataset.name}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel text-sm text-slate-300">
                <Settings2 className="w-4 h-4" />
                <button 
                  onClick={() => setState(s => ({ ...s, showGrid: !s.showGrid }))}
                  className="hover:text-white transition-colors"
                >
                  Grid: {state.showGrid ? 'On' : 'Off'}
                </button>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <StatCard 
                key={idx} 
                label={stat.label} 
                value={stat.value} 
                change={stat.change} 
                suffix={stat.suffix}
              />
            ))}
          </div>

          {/* Main Chart Card */}
          <div className="flex-1 glass-card rounded-3xl p-8 relative flex flex-col min-h-[450px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-white">
                Historical Overview <span className="text-slate-500 font-normal ml-2 text-sm italic">/ Last Cycle</span>
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", "bg-indigo-500")} />
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Primary</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-400">
                   <Maximize2 className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
               <AnimatePresence mode="wait">
                <motion.div
                  key={`${state.selectedDatasetId}-${state.chartType}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full"
                >
                  <ChartWrapper 
                    dataset={selectedDataset} 
                    type={state.chartType} 
                    showGrid={state.showGrid}
                  />
                </motion.div>
               </AnimatePresence>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-500 font-bold">
               <div className="flex items-center gap-4">
                 <span>Cycle Start</span>
                 <div className="w-12 h-px bg-white/10" />
                 <span>Cycle End</span>
               </div>
               <div className="text-indigo-400/50">Verified Metric Stream v4.2</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
