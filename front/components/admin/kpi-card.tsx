'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  icon?: React.ReactNode;
}

export function KPICard({ title, value, change, subtitle, icon }: KPICardProps) {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      {change && (
        <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm">
          {change.isPositive ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
          <span className={change.isPositive ? 'text-green-600' : 'text-red-600'}>
            {change.isPositive ? '+' : '-'}
            {Math.abs(change.value).toFixed(1)}%
          </span>
        </div>
      )}
    </Card>
  );
}
