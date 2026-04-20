/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
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
  Maximize2,
  Cpu,
  Table as TableIcon,
  Upload
} from 'lucide-react';
import { ChartWrapper } from './components/ChartWrapper';
import { StatCard } from './components/StatCard';
import { DataUploader } from './components/DataUploader';
import { InsightsPanel } from './components/InsightsPanel';
import { MOCK_DATASETS } from './data/mockDatasets';
import { ChartType, DashboardState, Dataset } from './types/dashboard';
import { analyzeDataset } from './services/aiService';
import { cn } from './lib/utils';

type ActiveTab = 'visualize' | 'data' | 'insights';

export default function App() {
  const [datasets, setDatasets] = useState<Dataset[]>(MOCK_DATASETS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('visualize');
  const [aiInsights, setAiInsights] = useState<Record<string, string>>({});
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [state, setState] = useState<DashboardState>({
    selectedDatasetId: MOCK_DATASETS[0].id,
    chartType: 'area',
    showGrid: true,
    isAnimationActive: true,
  });

  const selectedDataset = useMemo(() => 
    datasets.find(d => d.id === state.selectedDatasetId) || datasets[0],
    [state.selectedDatasetId, datasets]
  );

  const handleDataUpload = useCallback((newDataset: Dataset) => {
    setDatasets(prev => [newDataset, ...prev]);
    setState(s => ({ ...s, selectedDatasetId: newDataset.id }));
    setActiveTab('visualize');
  }, []);

  const handleGenerateInsights = async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    try {
      const result = await analyzeDataset(selectedDataset.name, selectedDataset.data);
      if (result) {
        setAiInsights(prev => ({ ...prev, [selectedDataset.id]: result }));
        setActiveTab('insights');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'AI Analysis failed');
    } finally {
      setIsAiLoading(false);
    }
  };

  const stats = useMemo(() => {
    const data = selectedDataset.data;
    if (!data.length) return [];
    
    const lastValue = data[data.length - 1].value;
    const firstValue = data[0].value;
    const average = Math.round(data.reduce((acc, curr) => acc + curr.value, 0) / data.length);
    const growth = firstValue !== 0 ? Math.round(((lastValue - firstValue) / firstValue) * 100) : 0;
    
    return [
      { label: 'Current Metric', value: lastValue.toLocaleString(), change: growth, suffix: '' },
      { label: 'Session Average', value: average.toLocaleString(), change: undefined, suffix: '' },
      { label: 'Data Density', value: data.length, change: undefined, suffix: ' pts' },
      { label: 'Processor Entropy', value: '41.2', change: 2, suffix: '°C' },
    ];
  }, [selectedDataset]);

  return (
    <div className="relative min-h-screen text-slate-200 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      <div className="mesh-bg" />
      
      <div className="flex h-screen w-full overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 glass-panel flex flex-col p-6 space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30 transform hover:rotate-12 transition-transform cursor-pointer">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white leading-none">Nexus</span>
              <span className="text-[10px] uppercase font-bold text-indigo-400/80 mt-1 tracking-widest">Explorer Core</span>
            </div>
          </div>

          <nav className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">Main Terminal</div>
            <div className="flex flex-col gap-1">
              {[
                { id: 'visualize', label: 'Monitor', icon: LayoutDashboard },
                { id: 'data', label: 'Storage', icon: Database },
                { id: 'insights', label: 'Insights', icon: SparklesIcon }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold",
                      activeTab === tab.id 
                        ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10" 
                        : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", activeTab === tab.id ? "text-indigo-400" : "opacity-50")} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </nav>

          <nav className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">Selected Stream</div>
            <div className="flex flex-col gap-1 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
              {datasets.map((dataset) => (
                <button
                  key={dataset.id}
                  onClick={() => {
                    setState(s => ({ ...s, selectedDatasetId: dataset.id }));
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-[11px] font-medium text-left",
                    state.selectedDatasetId === dataset.id 
                      ? "bg-indigo-500/10 text-indigo-200 border border-indigo-500/20" 
                      : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                  )}
                >
                  <ChevronRight className={cn(
                    "w-3 h-3 transition-transform",
                    state.selectedDatasetId === dataset.id ? "rotate-90 text-indigo-400" : "opacity-30"
                  )} />
                  <span className="truncate">{dataset.name}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="mt-auto">
            <div className="glass-card p-5 rounded-2xl bg-indigo-500/5 border-indigo-500/10 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] uppercase font-bold text-slate-400">System Link Verified</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-serif italic">
                Cross-referencing active metrics with Gemini 3 Neural Engine.
              </p>
            </div>
          </div>
        </aside>

        {/* content Area */}
        <main className="flex-1 flex flex-col p-8 overflow-y-auto bg-slate-950/20">
          <header className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <div className="flex items-center gap-3 mb-1">
                 <div className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400 uppercase tracking-tighter">
                   Operational Mode
                 </div>
                 <div className="text-[10px] text-slate-600 font-mono tracking-widest px-2 border-l border-slate-800">
                    ID: {selectedDataset.id.toUpperCase()}
                 </div>
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tighter uppercase leading-none">
                {activeTab === 'visualize' ? 'Data Monitor' : activeTab === 'data' ? 'Storage Hub' : 'AI Analysis'}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer" onClick={handleGenerateInsights}>
                <SparklesIcon className={cn("w-4 h-4", isAiLoading ? "animate-spin" : "text-indigo-400")} />
                <span>Quick Insight</span>
              </div>
              <div className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-white transition-colors cursor-pointer backdrop-blur-2xl">
                <Settings2 className="w-5 h-5" />
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'visualize' && (
              <motion.div 
                key="visualize"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-8"
              >
                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                {/* Main Viewport */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between bg-white/3 p-2 rounded-2xl border border-white/5">
                    <div className="flex gap-1 p-1 bg-black/20 rounded-xl">
                      {[
                        { id: 'area', icon: AreaIcon },
                        { id: 'bar', icon: BarChart3 },
                        { id: 'line', icon: LineIcon },
                        { id: 'pie', icon: PieIcon },
                        { id: 'composed', icon: LayoutDashboard }
                      ].map((t) => {
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setState(s => ({ ...s, chartType: t.id as ChartType }))}
                            className={cn(
                              "p-2.5 rounded-lg transition-all",
                              state.chartType === t.id ? "bg-white/10 text-white shadow-xl" : "text-slate-500 hover:text-slate-300"
                            )}
                            title={t.id}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-4 px-4">
                      <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-400 transition-colors">
                          <input 
                            type="checkbox" 
                            checked={state.showGrid} 
                            onChange={() => setState(s => ({ ...s, showGrid: !s.showGrid }))}
                            className="w-3 h-3 rounded bg-white/5 border-white/10 checked:bg-indigo-500"
                          />
                          Render Grid
                        </label>
                      </div>
                      <div className="h-4 w-px bg-white/10" />
                      <Maximize2 className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer" />
                    </div>
                  </div>

                  <div className="glass-card rounded-[2.5rem] p-10 min-h-[500px] flex flex-col border-indigo-500/10 shadow-2xl relative group">
                    <div className="absolute top-8 right-8 flex items-center gap-2 group-hover:opacity-100 transition-opacity">
                       <span className="font-mono text-[10px] text-indigo-400/50 uppercase font-bold tracking-widest">
                         Stream Sync: {Math.floor(Math.random() * 100)}ms
                       </span>
                    </div>

                    <div className="mb-8 flex items-baseline gap-3">
                      <h2 className="text-xl font-bold tracking-tight text-white uppercase italic">{selectedDataset.name}</h2>
                      <span className="text-slate-500 text-sm font-semibold tracking-widest uppercase">/ Real-time Buffer</span>
                    </div>

                    <div className="flex-1 w-full mt-4">
                      {/* Force remount on dataset change to clear charts correctly */}
                      <ChartWrapper 
                        key={selectedDataset.id}
                        dataset={selectedDataset} 
                        type={state.chartType} 
                        showGrid={state.showGrid}
                      />
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-6">
                         <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-bold text-slate-500 mb-1">Source Topology</span>
                            <span className="text-xs font-mono text-slate-400">Localhost::8080/primary_feed</span>
                         </div>
                         <div className="w-px h-8 bg-white/5" />
                         <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-bold text-slate-500 mb-1">Normalization</span>
                            <span className="text-xs font-mono text-slate-400">Linear 64-bit IEEE 754</span>
                         </div>
                       </div>
                       
                       <div className="flex gap-1">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className={cn("w-1 h-4 rounded-full", i % 2 === 0 ? "bg-indigo-500/40" : "bg-white/5")} />
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'data' && (
              <motion.div 
                key="data"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-1 space-y-8">
                  <div className="glass-card rounded-3xl p-8 border-indigo-500/10">
                    <h2 className="text-lg font-semibold text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                      <Upload className="w-5 h-5 text-indigo-400" />
                      Dataset Ingestion
                    </h2>
                    <DataUploader onDatasetUpload={handleDataUpload} />
                  </div>

                  <div className="glass-card rounded-3xl p-8 bg-indigo-500/5 border-indigo-500/10 relative overflow-hidden">
                    <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-indigo-500/10 blur-3xl rounded-full" />
                    <h3 className="text-sm font-bold text-indigo-300 mb-4 uppercase tracking-wider">Storage Stats</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                         <span className="text-xs text-slate-400 font-medium font-serif italic">Total Streams</span>
                         <span className="text-lg font-mono font-bold text-white">{datasets.length}</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 w-[60%]" />
                      </div>
                      <div className="flex justify-between items-end pt-2">
                         <span className="text-xs text-slate-400 font-medium font-serif italic">Allocated Mem</span>
                         <span className="text-lg font-mono font-bold text-white">12.4 MB</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 glass-card rounded-3xl p-8 overflow-hidden flex flex-col border-[#ffffff08]">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-semibold text-white uppercase tracking-tight flex items-center gap-3">
                      <TableIcon className="w-5 h-5 text-slate-500" />
                      Stream Raw Data
                    </h2>
                    <span className="text-[10px] font-mono text-slate-600 bg-black/20 px-3 py-1 rounded-full uppercase">
                      Page 1 of {Math.ceil(selectedDataset.data.length / 10)}
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left font-mono text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-slate-500 uppercase tracking-widest font-bold">
                          <th className="pb-4 pr-4 pl-2">Idx</th>
                          <th className="pb-4 pr-4">Identifer</th>
                          <th className="pb-4 pr-4">Primary Value</th>
                          <th className="pb-4 pr-4">Relational Delta</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        {selectedDataset.data.slice(0, 15).map((row, i) => (
                          <tr key={i} className="border-b border-white/[0.03] hover:bg-white/5 transition-colors group">
                            <td className="py-4 pr-4 pl-2 font-bold opacity-30">#0{i + 1}</td>
                            <td className="py-4 pr-4 font-bold text-white group-hover:text-indigo-300 transition-colors">{row.name}</td>
                            <td className="py-4 pr-4">{row.value.toLocaleString()}</td>
                            <td className="py-4 pr-4 font-mono">
                               <div className="flex items-center gap-2">
                                  <div className="w-8 h-1 bg-white/5 rounded-full overflow-hidden">
                                     <div className="h-full bg-emerald-500/50" style={{ width: `${Math.random() * 100}%` }} />
                                  </div>
                                  <span className="text-[9px] opacity-40">OK_STATE</span>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-8 text-[10px] text-slate-600 font-serif italic text-right">
                    Showing first 15 of {selectedDataset.data.length} records in active buffer.
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'insights' && (
              <motion.div 
                key="insights"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="max-w-4xl mx-auto w-full"
              >
                <InsightsPanel 
                  insights={aiInsights[selectedDataset.id] || null} 
                  isLoading={isAiLoading} 
                  onGenerate={handleGenerateInsights}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg 
      {...props}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
    </svg>
  );
}
