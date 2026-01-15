'use client';

import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface SimpleChartProps {
  title: string;
  data: any[];
  type?: 'line' | 'bar';
  dataKey: string;
  xAxisKey: string;
  height?: number;
  loading?: boolean;
}

export function SimpleChart({ title, data, type = 'line', dataKey, xAxisKey, height = 300, loading = false }: SimpleChartProps) {
  if (loading) {
    return (
      <Card className="p-4 sm:p-6">
        <h3 className="text-sm sm:text-base font-semibold mb-4">{title}</h3>
        <Skeleton className="w-full" style={{ height: `${height}px` }} />
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-sm sm:text-base font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={xAxisKey} stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
              }}
            />
            <Line type="monotone" dataKey={dataKey} stroke="hsl(var(--primary))" dot={{ fill: 'hsl(var(--primary))' }} isAnimationActive={false} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={xAxisKey} stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
              }}
            />
            <Bar dataKey={dataKey} fill="hsl(var(--primary))" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}
