import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import type { Product, Order, AnalyticsEvent } from '@/lib/types';
import { SimpleChart } from './simple-chart';
import { DataTable } from './data-table';
import { ConfirmDialog } from './confirm-dialog';
import { computeGlobalFunnel, computeProductFunnel, computeTopCategories, computePaymentMethodDistribution, computeShippingZoneDistribution, computeAverageBasketSizeTrend, computePurchasesByWeekday } from '@/lib/adminMetrics';

interface AnalyticsTabProps {
  products: Product[];
  orders: Order[];
  events: AnalyticsEvent[];
  onResetAnalytics: () => Promise<void>;
}

export function AnalyticsTab({ products, orders, events, onResetAnalytics }: AnalyticsTabProps) {
  const [globalFunnel, setGlobalFunnel] = useState<any>(null);
  const [productFunnel, setProductFunnel] = useState<any[]>([]);
  const [topCategories, setTopCategories] = useState<any[]>([]);
  const [paymentDist, setPaymentDist] = useState<any[]>([]);
  const [shippingDist, setShippingDist] = useState<any[]>([]);
  const [basketTrend, setBasketTrend] = useState<any[]>([]);
  const [purchasesByWeekday, setPurchasesByWeekday] = useState<any[]>([]);
  // No reset: backend only

  useEffect(() => {
    setGlobalFunnel(computeGlobalFunnel(events, orders));
    setProductFunnel(computeProductFunnel(products, events, orders));
    setTopCategories(computeTopCategories(events, orders, 'revenue'));
    setPaymentDist(computePaymentMethodDistribution(orders));
    setShippingDist(computeShippingZoneDistribution(orders));
    setBasketTrend(computeAverageBasketSizeTrend(orders));
    setPurchasesByWeekday(computePurchasesByWeekday(orders));
  }, [products, orders, events]);

  if (!globalFunnel) {
    return <div className="text-center py-8">Cargando analíticas...</div>;
  }

  return (
    <ScrollArea className="w-full h-full">
      <div className="space-y-6 p-4 sm:p-6">
        {/* Global Funnel */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Embudo de Conversión Global</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold">{globalFunnel.views}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Vistas</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold">{globalFunnel.adds}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Agregados al carrito</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold">{globalFunnel.purchases}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Compras</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold">{globalFunnel.viewToAddConversion}%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Conversión Vista→Carrito</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold">{globalFunnel.addToPurchaseConversion}%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Conversión Carrito→Compra</div>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Product Funnel Table */}
        <DataTable
          title="Embudo por Producto"
          columns={[
            {
              key: 'name',
              label: 'Producto',
              render: (val) => <span className="truncate">{val}</span>,
            },
            {
              key: 'views',
              label: 'Vistas',
            },
            {
              key: 'adds',
              label: 'Carritos',
            },
            {
              key: 'purchases',
              label: 'Compras',
            },
            {
              key: 'viewToAddConversion',
              label: 'V→C %',
            },
            {
              key: 'viewToPurchaseConversion',
              label: 'V→P %',
            },
          ]}
          data={productFunnel.slice(0, 20)}
          maxHeight="max-h-[400px]"
        />

        <Separator />

        {/* Category Analytics */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Desempeño por Categoría</h2>
          <DataTable
            title="Categorías por Ingresos"
            columns={[
              {
                key: 'category',
                label: 'Categoría',
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
              {
                key: 'views',
                label: 'Vistas',
              },
            ]}
            data={topCategories}
            maxHeight="max-h-[300px]"
          />
        </div>

        <Separator />

        {/* Time Analytics */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Análisis de Tiempo</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SimpleChart title="Compras por Día de la Semana" data={purchasesByWeekday} type="bar" dataKey="count" xAxisKey="label" height={250} />
            <SimpleChart title="Tamaño Promedio de Canasta (14 días)" data={basketTrend} type="line" dataKey="avgBasketSize" xAxisKey="label" height={250} />
          </div>
        </div>

        <Separator />

        {/* Commerce Insights */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Información Comercial</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DataTable
              title="Métodos de Pago"
              columns={[
                {
                  key: 'method',
                  label: 'Método',
                },
                {
                  key: 'count',
                  label: 'Transacciones',
                },
                {
                  key: 'revenue',
                  label: 'Ingresos',
                  render: (val) => `$${val?.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`,
                },
              ]}
              data={paymentDist}
              maxHeight="max-h-[250px]"
            />
            <DataTable
              title="Zonas de Envío"
              columns={[
                {
                  key: 'zone',
                  label: 'Zona',
                },
                {
                  key: 'count',
                  label: 'Envíos',
                },
                {
                  key: 'revenue',
                  label: 'Ingresos',
                  render: (val) => `$${val?.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`,
                },
              ]}
              data={shippingDist}
              maxHeight="max-h-[250px]"
            />
          </div>
        </div>

        <Separator />

        {/* ...existing code... */}
      </div>
    </ScrollArea>
  );
}
