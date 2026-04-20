import React from 'react';
import Markdown from 'react-markdown';
import { Bot, Sparkles, BrainCircuit, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface InsightsPanelProps {
  insights: string | null;
  isLoading: boolean;
  onGenerate: () => void;
}

export function InsightsPanel({ insights, isLoading, onGenerate }: InsightsPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-white tracking-tight">AI Data Insights</h2>
        </div>
        
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
            "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          {isLoading ? 'Analyzing...' : 'Generate Insights'}
        </button>
      </div>

      <div className="glass-card rounded-2xl p-6 min-h-[200px] relative overflow-hidden border-indigo-500/20">
        {!insights && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 opacity-40">
            <BrainCircuit className="w-12 h-12 mb-4" />
            <p className="text-sm font-serif italic max-w-[240px]">
              Click the button above to have Gemini AI analyze your active dataset for trends and recommendations.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col gap-4 py-4">
            <div className="h-4 w-3/4 bg-white/5 rounded-full animate-pulse" />
            <div className="h-4 w-1/2 bg-white/5 rounded-full animate-pulse" />
            <div className="h-4 w-2/3 bg-white/5 rounded-full animate-pulse" />
            <div className="h-4 w-5/6 bg-white/5 rounded-full animate-pulse leading-none mt-4 text-[10px] text-indigo-400 uppercase font-serif italic">
              Quantum processors calculating potential energy states...
            </div>
          </div>
        )}

        {insights && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-headings:text-indigo-400 prose-li:text-slate-300"
          >
            <Markdown>{insights}</Markdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
