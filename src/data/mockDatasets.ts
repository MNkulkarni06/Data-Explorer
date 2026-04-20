import { Dataset } from '../types/dashboard';

export const MOCK_DATASETS: Dataset[] = [
  {
    id: 'revenue-2024',
    name: 'Q1 Revenue Streams',
    description: 'Quarterly financial distribution across primary business units.',
    color: '#000000',
    secondaryColor: '#6366f1',
    data: [
      { name: 'Jan', value: 4500, secondary: 2400, growth: 12 },
      { name: 'Feb', value: 5200, secondary: 1398, growth: 15 },
      { name: 'Mar', value: 6100, secondary: 9800, growth: 18 },
      { name: 'Apr', value: 4800, secondary: 3908, growth: -5 },
      { name: 'May', value: 5900, secondary: 4800, growth: 10 },
      { name: 'Jun', value: 7200, secondary: 3800, growth: 22 },
    ]
  },
  {
    id: 'user-growth',
    name: 'Active User Retention',
    description: 'Monthly active user metrics and engagement conversion rates.',
    color: '#10b981',
    secondaryColor: '#f59e0b',
    data: [
      { name: 'Week 1', value: 1200, secondary: 800, growth: 4 },
      { name: 'Week 2', value: 1900, secondary: 967, growth: 58 },
      { name: 'Week 3', value: 1600, secondary: 1098, growth: -15 },
      { name: 'Week 4', value: 2400, secondary: 1200, growth: 50 },
      { name: 'Week 5', value: 3200, secondary: 1100, growth: 33 },
      { name: 'Week 6', value: 3100, secondary: 1700, growth: -3 },
    ]
  },
  {
    id: 'infrastructure-load',
    name: 'System Latency (ms)',
    description: 'P99 values for core API endpoints over time.',
    color: '#ef4444',
    secondaryColor: '#3b82f6',
    data: [
      { name: 'T-60', value: 120, secondary: 140, growth: 16 },
      { name: 'T-45', value: 115, secondary: 135, growth: -4 },
      { name: 'T-30', value: 145, secondary: 155, growth: 26 },
      { name: 'T-15', value: 130, secondary: 145, growth: -10 },
      { name: 'T-05', value: 125, secondary: 140, growth: -3 },
      { name: 'Now', value: 118, secondary: 138, growth: -5 },
    ]
  }
];
