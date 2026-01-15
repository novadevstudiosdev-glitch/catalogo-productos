'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, RefreshCw, Trash2, AlertTriangle, Download } from 'lucide-react';
import type { Order, Product } from '@/lib/types';
import { KPICard } from './kpi-card';
import { SimpleChart } from './simple-chart';
import { DataTable } from './data-table';
import { ConfirmDialog } from './confirm-dialog';
import { computeKPIs, computeOrdersPerDay, computeRevenuePerDay, computePurchasesByHour, computeViewsByHour, computeTopProducts, computeLowStockProducts, clearMetricsCache } from '@/lib/adminMetrics';
import { ShoppingCart, BarChart3, TrendingUp, Users, Package } from 'lucide-react';

interface OverviewTabProps {
  products: Product[];
  orders: Order[];
  onCreateProduct: () => void;
}

export function OverviewTab({ products, orders, onCreateProduct }: OverviewTabProps) {
  const [kpis, setKpis] = useState<any>(null);
  const [ordersPerDay, setOrdersPerDay] = useState<any[]>([]);
  const [revenuePerDay, setRevenuePerDay] = useState<any[]>([]);
  const [purchasesByHour, setPurchasesByHour] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Limpiar cache y forzar refresco cada vez que se monta o cambian los datos
    clearMetricsCache();
    setKpis(computeKPIs(products, orders, []));
    setOrdersPerDay(computeOrdersPerDay(orders, 14));
    setRevenuePerDay(computeRevenuePerDay(orders, 14));
    setPurchasesByHour(computePurchasesByHour(orders));
    setTopProducts(computeTopProducts(products, [], orders, 'revenue', 10));
    setLowStockProducts(computeLowStockProducts(products));
  }, [products, orders]);

  const downloadCSV = (data: any[], filename: string) => {
    const csv = [Object.keys(data[0]).join(','), ...data.map((row) => Object.values(row).join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!kpis) {
    return <div className="text-center py-8">Cargando...</div>;
  }
  return (
    <ScrollArea className="w-full h-full">
      <div className="space-y-6 p-4 sm:p-6">
        {/* KPI Cards */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Métricas Clave</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Ingresos totales" value={`$${kpis.totalRevenue?.toLocaleString('es-AR', { maximumFractionDigits: 0 }) || 0}`} icon={<TrendingUp className="h-5 w-5" />} />
            <KPICard title="Últimos 30 días" value={`$${kpis.revenue30d?.toLocaleString('es-AR', { maximumFractionDigits: 0 }) || 0}`} icon={<ShoppingCart className="h-5 w-5" />} />
            <KPICard title="Órdenes (7 días)" value={kpis.orders7d} icon={<BarChart3 className="h-5 w-5" />} />
            <KPICard title="Tasa de conversión" value={`${kpis.conversionRate?.toFixed(2)}%`} icon={<TrendingUp className="h-5 w-5" />} />
            <KPICard title="Valor promedio orden" value={`$${kpis.avgOrderValue?.toLocaleString('es-AR', { maximumFractionDigits: 0 }) || 0}`} icon={<ShoppingCart className="h-5 w-5" />} />
            <KPICard title="Clientes retornantes" value={kpis.returningCustomers} subtitle={`de ${kpis.totalCustomers} total`} icon={<Users className="h-5 w-5" />} />
            <KPICard title="Productos" value={products.length} icon={<Package className="h-5 w-5" />} />
            <KPICard title="Órdenes totales" value={kpis.ordersAll} icon={<ShoppingCart className="h-5 w-5" />} />
          </div>
        </div>

        <Separator />

        {/* Charts */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Gráficos de Actividad</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SimpleChart title="Órdenes por día (14 días)" data={ordersPerDay} type="bar" dataKey="count" xAxisKey="label" />
            <SimpleChart title="Ingresos por día (14 días)" data={revenuePerDay} type="line" dataKey="revenue" xAxisKey="label" />
            <SimpleChart title="Compras por hora" data={purchasesByHour} type="bar" dataKey="count" xAxisKey="label" />
          </div>
        </div>

        <Separator />

        {/* Top Products & Low Stock */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Productos y Inventario</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DataTable
              title="Top 10 Productos (Ingresos)"
              columns={[
                {
                  key: 'name',
                  label: 'Nombre',
                  render: (val) => <span className="truncate">{val}</span>,
                },
                {
                  key: 'revenue',
                  label: 'Ingresos',
                  render: (val) => `$${val?.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`,
                },
                {
                  key: 'purchases',
                  label: 'Compras',
                },
              ]}
              data={topProducts}
              maxHeight="max-h-[300px]"
            />
            <DataTable
              title="Bajo Stock"
              columns={[
                {
                  key: 'name',
                  label: 'Producto',
                  render: (val) => <span className="truncate">{val}</span>,
                },
                {
                  key: 'stock',
                  label: 'Stock',
                  render: (val) => <span className={val <= 5 ? 'text-red-600 font-semibold' : val <= 10 ? 'text-yellow-600' : ''}>{val}</span>,
                },
                {
                  key: 'category',
                  label: 'Categoría',
                },
              ]}
              data={lowStockProducts.map((p) => ({
                ...p,
                category: p.category || 'N/A',
              }))}
              maxHeight="max-h-[300px]"
            />
          </div>
        </div>

        <Separator />

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={onCreateProduct} className="gap-2">
              <Plus className="h-4 w-4" />
              Crear Producto
            </Button>
            <Button variant="outline" onClick={() => downloadCSV(orders, 'orders.csv')} className="gap-2">
              <Download className="h-4 w-4" />
              Descargar Órdenes (CSV)
            </Button>
            <Button variant="outline" onClick={() => downloadCSV(topProducts, 'products.csv')} className="gap-2">
              <Download className="h-4 w-4" />
              Descargar Productos (CSV)
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
