import React from 'react';

const DIMENSIONS = [
  { key: 'capital_fit', label: 'Capital Fit', max: 20 },
  { key: 'stage_fit', label: 'Stage Fit', max: 15 },
  { key: 'sector_fit', label: 'Sector Fit', max: 15 },
  { key: 'impact_fit', label: 'Impact Fit', max: 15 },
  { key: 'geography_fit', label: 'Geography', max: 10 },
  { key: 'risk_fit', label: 'Risk Fit', max: 10 },
  { key: 'involvement_fit', label: 'Involvement', max: 10 },
  { key: 'momentum_fit', label: 'Momentum', max: 5 },
];

export default function MatchBreakdownBar({ match }) {
  return (
    <div className="space-y-2">
      {DIMENSIONS.map(d => {
        const val = match[d.key] || 0;
        const pct = Math.round((val / d.max) * 100);
        return (
          <div key={d.key} className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground w-20 shrink-0">{d.label}</span>
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] font-medium text-foreground w-7 text-right">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}