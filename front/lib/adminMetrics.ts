import type { Order, AnalyticsEvent, Product } from './types';

// Memoization cache
const cache = new Map<string, { timestamp: number; value: any }>();
const CACHE_TTL = 1000 * 60; // 1 minute

function memoizedCompute<T>(key: string, fn: () => T): T {
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.value;
  }
  const value = fn();
  cache.set(key, { timestamp: now, value });
  return value;
}

export function clearMetricsCache() {
  cache.clear();
}

// ============================================================================
// BASIC AGGREGATIONS
// ============================================================================

export function computeProductMetrics(products: Product[], events: AnalyticsEvent[], orders: Order[]) {
  return memoizedCompute('productMetrics', () => {
    const viewsByProduct = new Map<string, number>();
    const addsByProduct = new Map<string, number>();
    const purchasesByProduct = new Map<string, number>();
    const revenueByProduct = new Map<string, number>();

    events.forEach((e) => {
      if (!e.productId) return;
      if (e.type === 'product_view') viewsByProduct.set(e.productId, (viewsByProduct.get(e.productId) || 0) + 1);
      if (e.type === 'add_to_cart') addsByProduct.set(e.productId, (addsByProduct.get(e.productId) || 0) + 1);
    });

    orders.forEach((o) => {
      o.items.forEach((item) => {
        const productId = item.productId;
        purchasesByProduct.set(productId, (purchasesByProduct.get(productId) || 0) + item.qty);
        revenueByProduct.set(productId, (revenueByProduct.get(productId) || 0) + item.price * item.qty);
      });
    });

    return { viewsByProduct, addsByProduct, purchasesByProduct, revenueByProduct };
  });
}

export function computeCategoryMetrics(events: AnalyticsEvent[], orders: Order[]) {
  return memoizedCompute('categoryMetrics', () => {
    const viewsByCategory = new Map<string, number>();
    const addsByCategory = new Map<string, number>();
    const purchasesByCategory = new Map<string, number>();
    const revenueByCategory = new Map<string, number>();

    events.forEach((e) => {
      if (!e.category) return;
      if (e.type === 'product_view') viewsByCategory.set(e.category, (viewsByCategory.get(e.category) || 0) + 1);
      if (e.type === 'add_to_cart') addsByCategory.set(e.category, (addsByCategory.get(e.category) || 0) + 1);
    });

    orders.forEach((o) => {
      o.items.forEach((item) => {
        const category = item.productId; // TODO: Get category from product lookup
        purchasesByCategory.set(category, (purchasesByCategory.get(category) || 0) + item.qty);
        revenueByCategory.set(category, (revenueByCategory.get(category) || 0) + item.price * item.qty);
      });
    });

    return { viewsByCategory, addsByCategory, purchasesByCategory, revenueByCategory };
  });
}

// ============================================================================
// KPI CALCULATIONS
// ============================================================================

export function computeKPIs(products: Product[], orders: Order[], events: AnalyticsEvent[]) {
  return memoizedCompute('kpis', () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total revenue (all time)
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    // Revenue last 30 days
    const revenue30d = orders.filter((o) => new Date(o.createdAt) >= thirtyDaysAgo).reduce((sum, o) => sum + o.total, 0);

    // Orders
    const ordersAll = orders.length;
    const orders7d = orders.filter((o) => new Date(o.createdAt) >= sevenDaysAgo).length;
    const orders30d = orders.filter((o) => new Date(o.createdAt) >= thirtyDaysAgo).length;

    // Conversions (views → purchase)
    const totalViews = events.filter((e) => e.type === 'product_view').length;
    const totalPurchases = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);
    const conversionRate = totalViews > 0 ? (totalPurchases / totalViews) * 100 : 0;

    // Avg order value
    const avgOrderValue = ordersAll > 0 ? totalRevenue / ordersAll : 0;

    // Avg items per order
    const totalItems = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);
    const avgItemsPerOrder = ordersAll > 0 ? totalItems / ordersAll : 0;

    // Returning vs new customers (approximated by email repeat)
    const customerEmails = new Map<string, number>();
    orders.forEach((o) => {
      const email = o.customer.email;
      customerEmails.set(email, (customerEmails.get(email) || 0) + 1);
    });
    const returningCustomers = Array.from(customerEmails.values()).filter((count) => count > 1).length;
    const newCustomers = customerEmails.size - returningCustomers;

    return {
      totalRevenue,
      revenue30d,
      ordersAll,
      orders7d,
      orders30d,
      conversionRate,
      avgOrderValue,
      avgItemsPerOrder,
      returningCustomers,
      newCustomers,
      totalCustomers: customerEmails.size,
      totalViews,
      totalPurchases,
    };
  });
}

// ============================================================================
// CHART DATA
// ============================================================================

export function computeOrdersPerDay(orders: Order[], days: number = 14) {
  return memoizedCompute(`ordersPerDay_${days}`, () => {
    const data = new Map<string, number>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // El rango va desde hoy menos (days-1) hasta hoy (incluye hoy)
    for (let i = 0; i < days; i++) {
      const date = new Date(today.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      data.set(dateStr, 0);
    }

    // Contar órdenes por día
    orders.forEach((o) => {
      const orderDate = new Date(o.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      const orderDateStr = orderDate.toISOString().split('T')[0];
      if (data.has(orderDateStr)) {
        data.set(orderDateStr, (data.get(orderDateStr) || 0) + 1);
      }
    });

    return Array.from(data.entries()).map(([date, count]) => ({
      date,
      count,
      label: new Date(date).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' }),
    }));
  });
}

export function computeRevenuePerDay(orders: Order[], days: number = 14) {
  return memoizedCompute(`revenuePerDay_${days}`, () => {
    const data = new Map<string, number>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      data.set(dateStr, 0);
    }

    // Sumar ingresos por día
    orders.forEach((o) => {
      const orderDate = new Date(o.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      const orderDateStr = orderDate.toISOString().split('T')[0];
      if (data.has(orderDateStr)) {
        data.set(orderDateStr, (data.get(orderDateStr) || 0) + o.total);
      }
    });

    return Array.from(data.entries()).map(([date, revenue]) => ({
      date,
      revenue,
      label: new Date(date).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' }),
    }));
  });
}

export function computePurchasesByHour(orders: Order[]) {
  return memoizedCompute('purchasesByHour', () => {
    const data = new Map<number, number>();
    for (let i = 0; i < 24; i++) data.set(i, 0);

    orders.forEach((o) => {
      const hour = new Date(o.createdAt).getHours();
      data.set(hour, (data.get(hour) || 0) + 1);
    });

    return Array.from(data.entries())
      .map(([hour, count]) => ({
        hour,
        count,
        label: `${String(hour).padStart(2, '0')}:00`,
      }))
      .sort((a, b) => a.hour - b.hour);
  });
}

export function computeViewsByHour(events: AnalyticsEvent[]) {
  return memoizedCompute('viewsByHour', () => {
    const data = new Map<number, number>();
    for (let i = 0; i < 24; i++) data.set(i, 0);

    events
      .filter((e) => e.type === 'product_view')
      .forEach((e) => {
        const hour = new Date(e.ts).getHours();
        data.set(hour, (data.get(hour) || 0) + 1);
      });

    return Array.from(data.entries())
      .map(([hour, count]) => ({
        hour,
        count,
        label: `${String(hour).padStart(2, '0')}:00`,
      }))
      .sort((a, b) => a.hour - b.hour);
  });
}

export function computePurchasesByWeekday(orders: Order[]) {
  return memoizedCompute('purchasesByWeekday', () => {
    const data = new Map<number, number>();
    const labels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'];

    for (let i = 0; i < 7; i++) data.set(i, 0);

    orders.forEach((o) => {
      const day = new Date(o.createdAt).getDay();
      data.set(day, (data.get(day) || 0) + 1);
    });

    return Array.from(data.entries())
      .map(([day, count]) => ({
        day,
        count,
        label: labels[day],
      }))
      .sort((a, b) => a.day - b.day);
  });
}

// ============================================================================
// TOP PRODUCTS
// ============================================================================

export function computeTopProducts(products: Product[], events: AnalyticsEvent[], orders: Order[], metric: 'views' | 'purchases' | 'revenue', limit: number = 10) {
  return memoizedCompute(`topProducts_${metric}_${limit}`, () => {
    const { viewsByProduct, purchasesByProduct, revenueByProduct } = computeProductMetrics(products, events, orders);

    const metricsMap = metric === 'views' ? viewsByProduct : metric === 'purchases' ? purchasesByProduct : revenueByProduct;

    return Array.from(metricsMap.entries())
      .map(([productId, value]) => {
        const product = products.find((p) => p.id === productId);
        return {
          productId,
          name: product?.name || 'Unknown',
          value,
          views: viewsByProduct.get(productId) || 0,
          purchases: purchasesByProduct.get(productId) || 0,
          revenue: revenueByProduct.get(productId) || 0,
          conversionRate: (viewsByProduct.get(productId) || 0) > 0 ? ((purchasesByProduct.get(productId) || 0) / (viewsByProduct.get(productId) || 1)) * 100 : 0,
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  });
}

export function computeAbandonedProducts(products: Product[], events: AnalyticsEvent[], orders: Order[], limit: number = 10) {
  return memoizedCompute(`abandonedProducts_${limit}`, () => {
    const { viewsByProduct, addsByProduct, purchasesByProduct } = computeProductMetrics(products, events, orders);

    return Array.from(viewsByProduct.entries())
      .filter(([, views]) => views >= 5) // Only products with at least 5 views
      .map(([productId, views]) => {
        const adds = addsByProduct.get(productId) || 0;
        const purchases = purchasesByProduct.get(productId) || 0;
        const product = products.find((p) => p.id === productId);

        return {
          productId,
          name: product?.name || 'Unknown',
          views,
          adds,
          purchases,
          abandonmentScore: views + adds - purchases * 2, // Higher score = more abandoned
        };
      })
      .sort((a, b) => b.abandonmentScore - a.abandonmentScore)
      .slice(0, limit);
  });
}

export function computeLowStockProducts(products: Product[], threshold: number = 10) {
  return memoizedCompute(`lowStockProducts_${threshold}`, () => {
    return products.filter((p) => p.stock <= threshold).sort((a, b) => a.stock - b.stock);
  });
}

// ============================================================================
// ANALYTICS FUNNEL
// ============================================================================

export function computeGlobalFunnel(events: AnalyticsEvent[], orders: Order[]) {
  return memoizedCompute('globalFunnel', () => {
    const views = events.filter((e) => e.type === 'product_view').length;
    const adds = events.filter((e) => e.type === 'add_to_cart').length;
    const purchases = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);

    return {
      views,
      adds,
      purchases,
      viewToAddConversion: views > 0 ? ((adds / views) * 100).toFixed(2) : '0',
      addToPurchaseConversion: adds > 0 ? ((purchases / adds) * 100).toFixed(2) : '0',
      viewToPurchaseConversion: views > 0 ? ((purchases / views) * 100).toFixed(2) : '0',
    };
  });
}

export function computeProductFunnel(products: Product[], events: AnalyticsEvent[], orders: Order[]) {
  return memoizedCompute('productFunnel', () => {
    const { viewsByProduct, addsByProduct, purchasesByProduct } = computeProductMetrics(products, events, orders);

    const productIds = new Set([...viewsByProduct.keys(), ...addsByProduct.keys(), ...purchasesByProduct.keys()]);

    return Array.from(productIds)
      .map((productId) => {
        const views = viewsByProduct.get(productId) || 0;
        const adds = addsByProduct.get(productId) || 0;
        const purchases = purchasesByProduct.get(productId) || 0;

        return {
          productId,
          name: products.find((p) => p.id === productId)?.name || 'Unknown',
          views,
          adds,
          purchases,
          viewToAddConversion: views > 0 ? ((adds / views) * 100).toFixed(2) : '0',
          addToPurchaseConversion: adds > 0 ? ((purchases / adds) * 100).toFixed(2) : '0',
          viewToPurchaseConversion: views > 0 ? ((purchases / views) * 100).toFixed(2) : '0',
        };
      })
      .filter((p) => p.views > 0) // Only show products with at least 1 view
      .sort((a, b) => b.views - a.views);
  });
}

// ============================================================================
// CATEGORY ANALYTICS
// ============================================================================

export function computeTopCategories(events: AnalyticsEvent[], orders: Order[], metric: 'views' | 'purchases' | 'revenue' = 'revenue') {
  return memoizedCompute(`topCategories_${metric}`, () => {
    const { viewsByCategory, purchasesByCategory, revenueByCategory } = computeCategoryMetrics(events, orders);

    const metricsMap = metric === 'views' ? viewsByCategory : metric === 'purchases' ? purchasesByCategory : revenueByCategory;

    return Array.from(metricsMap.entries())
      .map(([category, value]) => ({
        category,
        value,
        views: viewsByCategory.get(category) || 0,
        purchases: purchasesByCategory.get(category) || 0,
        revenue: revenueByCategory.get(category) || 0,
      }))
      .sort((a, b) => b.value - a.value);
  });
}

// ============================================================================
// COMMERCE INSIGHTS
// ============================================================================

export function computePaymentMethodDistribution(orders: Order[]) {
  return memoizedCompute('paymentMethodDist', () => {
    const data = new Map<string, { count: number; revenue: number }>();

    orders.forEach((o) => {
      const method = o.paymentMethod;
      const current = data.get(method) || { count: 0, revenue: 0 };
      data.set(method, {
        count: current.count + 1,
        revenue: current.revenue + o.total,
      });
    });

    return Array.from(data.entries()).map(([method, stats]) => ({
      method,
      ...stats,
    }));
  });
}

export function computeShippingZoneDistribution(orders: Order[]) {
  return memoizedCompute('shippingZoneDist', () => {
    const data = new Map<string, { count: number; revenue: number }>();

    orders.forEach((o) => {
      const zone = o.shipping.zone;
      const current = data.get(zone) || { count: 0, revenue: 0 };
      data.set(zone, {
        count: current.count + 1,
        revenue: current.revenue + o.total,
      });
    });

    return Array.from(data.entries()).map(([zone, stats]) => ({
      zone,
      ...stats,
    }));
  });
}

export function computeAverageBasketSizeTrend(orders: Order[], days: number = 14) {
  return memoizedCompute(`basketSizeTrend_${days}`, () => {
    const data = new Map<string, { total: number; count: number }>();
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Initialize all days
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      data.set(dateStr, { total: 0, count: 0 });
    }

    // Aggregate by day
    orders.forEach((o) => {
      const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
      const current = data.get(orderDate);
      if (current) {
        const itemCount = o.items.reduce((sum, i) => sum + i.qty, 0);
        data.set(orderDate, {
          total: current.total + itemCount,
          count: current.count + 1,
        });
      }
    });

    return Array.from(data.entries()).map(([date, { total, count }]) => ({
      date,
      avgBasketSize: count > 0 ? (total / count).toFixed(2) : '0',
      label: new Date(date).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' }),
    }));
  });
}
