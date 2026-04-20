import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, Area, 
  BarChart, Bar, 
  LineChart, Line, 
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, Pie, Cell,
  ComposedChart,
} from 'recharts';
import { Dataset, ChartType } from '../types/dashboard';

interface ChartWrapperProps {
  dataset: Dataset;
  type: ChartType;
  showGrid?: boolean;
}

export function ChartWrapper({ dataset, type, showGrid = true }: ChartWrapperProps) {
  const chartData = useMemo(() => dataset.data, [dataset]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/2">
        <p className="text-slate-500 font-serif italic">No data points available in this stream buffer.</p>
      </div>
    );
  }

  const commonProps = {
    data: chartData,
    margin: { top: 10, right: 10, left: -20, bottom: 0 },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 text-white p-3 font-sans text-xs shadow-2xl rounded-xl">
          <p className="border-b border-white/10 pb-1 mb-2 text-slate-400 uppercase tracking-widest font-bold text-[10px]">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-8 mb-1 items-center">
              <span className="text-slate-300">{entry.name}:</span>
              <span className="font-bold font-mono" style={{ color: entry.color }}>
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const gridStroke = "rgba(255, 255, 255, 0.05)";
    const axisColor = "#64748b";

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={dataset.color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={dataset.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />}
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: axisColor, fontWeight: 600 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: axisColor, fontWeight: 600 }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={dataset.color} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              strokeWidth={3}
              animationDuration={1000}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />}
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: axisColor, fontWeight: 600 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: axisColor, fontWeight: 600 }} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar 
              dataKey="value" 
              fill={dataset.color} 
              radius={[6, 6, 0, 0]} 
              barSize={32}
              animationDuration={1000}
            />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />}
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: axisColor, fontWeight: 600 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: axisColor, fontWeight: 600 }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={dataset.color} 
              strokeWidth={4} 
              dot={{ r: 0 }} 
              activeDot={{ r: 6, strokeWidth: 0, fill: 'white' }}
              animationDuration={1000}
            />
          </LineChart>
        );
      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />}
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: axisColor, fontWeight: 600 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: axisColor, fontWeight: 600 }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="secondary" barSize={16} fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} animationDuration={800} />
            <Line type="monotone" dataKey="value" stroke={dataset.color} strokeWidth={3} dot={false} animationDuration={1000} />
          </ComposedChart>
        );
      case 'pie':
        const COLORS = ['#6366f1', '#d946ef', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationDuration={1000}
            >
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart() as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}
