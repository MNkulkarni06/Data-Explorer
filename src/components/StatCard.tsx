import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  suffix?: string;
  className?: string;
  key?: React.Key;
}

export function StatCard({ label, value, change, suffix, className }: StatCardProps) {
  const isPositive = change && change > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 rounded-2xl glass-card group hover:border-white/20 transition-all duration-300",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start mb-4">
          <div className={cn(
            "p-2 rounded-lg",
            isPositive ? "bg-emerald-500/20" : "bg-rose-500/20"
          )}>
            {isPositive ? (
              <ArrowUpRight className={cn("w-5 h-5", isPositive ? "text-emerald-400" : "text-rose-400")} />
            ) : (
              <ArrowDownRight className={cn("w-5 h-5", isPositive ? "text-emerald-400" : "text-rose-400")} />
            )}
          </div>
          {change !== undefined && (
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full",
              isPositive ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
            )}>
              {isPositive ? '+' : ''}{change}%
            </span>
          )}
        </div>
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          {label}
        </h3>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-bold text-white tracking-tight">
            {value}
          </span>
          {suffix && <span className="text-lg text-slate-500">{suffix}</span>}
        </div>
      </div>
    </motion.div>
  );
}
