import React, { useRef } from 'react';
import { Upload, FileJson, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Dataset } from '../types/dashboard';

interface DataUploaderProps {
  onDatasetUpload: (dataset: Dataset) => void;
}

export function DataUploader({ onDatasetUpload }: DataUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input value so the same file can be uploaded again
    event.target.value = '';

    const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const jsonData = JSON.parse(content);
            
            // Basic validation
            if (!Array.isArray(jsonData)) {
              alert('Invalid format: JSON must be an array of records.');
              return;
            }

        // Enhanced normalization: Find most likely keys for name and value
        const normalizedData = jsonData.map((item, idx) => {
          // Handle primitive values
          if (typeof item !== 'object' || item === null) {
            return {
              name: `Point ${idx}`,
              value: typeof item === 'number' ? item : 0
            };
          }

          // If already has name/value, use them
          if ('name' in item && 'value' in item) {
            return {
              ...item,
              name: String(item.name),
              value: Number(item.value)
            };
          }

          // Otherwise, find first string field for name and first numeric field for value
          let name = `Item ${idx}`;
          let value = 0;

          const entries = Object.entries(item);
          
          // Find value (first number)
          const numEntry = entries.find(([k, v]) => typeof v === 'number');
          if (numEntry) value = numEntry[1] as number;

          // Find name (first string that isn't the value key)
          const strEntry = entries.find(([k, v]) => typeof v === 'string' && k !== (numEntry?.[0]));
          if (strEntry) name = strEntry[1] as string;

          return {
            ...item,
            name,
            value
          };
        });

        const newDataset: Dataset = {
          id: `uploaded-${Date.now()}`,
          name: file.name.replace('.json', ''),
          description: `Uploaded dataset with ${jsonData.length} records.`,
          data: normalizedData,
          color: '#6366f1',
          secondaryColor: '#d946ef'
        };

        onDatasetUpload(newDataset);
      } catch (error) {
        alert('Failed to parse JSON. Please ensure it follows the correct format [ { "name": "...", "value": 123 }, ... ]');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
        ref={fileInputRef}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="group relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-2xl hover:border-indigo-500/50 hover:bg-white/5 transition-all w-full cursor-pointer"
      >
        <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:scale-110 transition-transform mb-3">
          <Upload className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-white">Upload Dataset</p>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">JSON only supported</p>
        </div>
      </button>

      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-3">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
        <p className="text-[10px] text-amber-500/80 leading-relaxed font-medium">
          Note: This app processes data locally. Large files ({'>'}5MB) may affect system performance. 
          AI Analysis sends a sample of your data to Google Gemini.
        </p>
      </div>
    </div>
  );
}
