export type ChartType = 'area' | 'bar' | 'line' | 'pie' | 'composed';

export interface DataPoint {
  name: string;
  value: number;
  secondary?: number;
  growth?: number;
  category?: string;
  [key: string]: any;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  data: DataPoint[];
  color: string;
  secondaryColor?: string;
}

export interface DashboardState {
  selectedDatasetId: string;
  chartType: ChartType;
  showGrid: boolean;
  isAnimationActive: boolean;
}
