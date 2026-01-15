# Unified Admin Dashboard Implementation

## Overview

Successfully unified the admin panel into a single, comprehensive dashboard at `/admin` with four main tabs: Overview, Orders, Products, and Analytics. All tabs load instantly on the same page, with data persisted to localStorage and existing stores.

## Key Files Created/Modified

### New Files Created

#### 1. `/front/lib/adminMetrics.ts` (Metrics Computation Engine)

- **Purpose**: Central hub for all dashboard metrics calculations with memoization
- **Key Functions**:
  - `computeKPIs()`: Calculates total revenue, orders, conversion rates, avg order value, customer segments
  - `computeOrdersPerDay()`, `computeRevenuePerDay()`: 14-day trend data
  - `computePurchasesByHour()`, `computeViewsByHour()`: Hourly patterns
  - `computeTopProducts()`: Revenue/views/purchases ranking
  - `computeAbandonedProducts()`: High-view, low-purchase items
  - `computeLowStockProducts()`: Inventory alerts
  - `computeGlobalFunnel()`, `computeProductFunnel()`: Conversion tracking
  - `computeTopCategories()`: Category performance
  - `computePaymentMethodDistribution()`, `computeShippingZoneDistribution()`: Commerce insights
  - `computeAverageBasketSizeTrend()`: 14-day basket trend
  - `clearMetricsCache()`: Memoization cache management

#### 2. `/front/components/admin/` (Component Library)

- **kpi-card.tsx**: Displays KPI metrics with optional trend indicators
- **simple-chart.tsx**: Reusable Recharts wrapper for line/bar charts
- **data-table.tsx**: Scrollable data table with custom renderers
- **confirm-dialog.tsx**: Confirmation dialog for dangerous actions
- **overview-tab.tsx**: Overview tab with KPIs, charts, top products, and quick actions
- **orders-tab.tsx**: Orders management with search, filters, bulk actions, and detail drawer
- **products-tab.tsx**: Products CRUD with search, filters, and inline actions
- **analytics-tab.tsx**: Advanced analytics with funnels, categories, and commerce insights

### Modified Files

#### `/front/app/admin/page.tsx`

- **Changes**: Replaced static layout with unified Tabs-based dashboard
- **Features**:
  - Loads all data on mount (products, orders, events)
  - Manages product CRUD operations
  - Handles tab navigation
  - Product form modal integration
  - Data reset functionality
- **Structure**: Header → Tabs → Content Areas

#### `/front/components/header.tsx`

- **Changes**: Simplified admin menu from dropdown to single link
- **Before**: Admin menu with submenu for Products/Orders/Analytics
- **After**: Single "Admin" link pointing to unified `/admin` dashboard

## Architecture

### Data Flow

```
localStorage (omar_products, omar_orders, omar_events, omar_settings)
        ↓
   /lib/api.ts (read/write)
        ↓
 useProducts, useOrders hooks
        ↓
/app/admin/page.tsx (state management)
        ↓
Tab Components (Overview, Orders, Products, Analytics)
        ↓
Child Components (KPI Cards, Tables, Charts)
        ↓
    adminMetrics.ts (computation with memoization)
```

### Component Hierarchy

```
/app/admin/page.tsx (Main Dashboard)
├── Tabs
│   ├── OverviewTab
│   │   ├── KPICard (×8)
│   │   ├── SimpleChart (×4)
│   │   ├── DataTable (×2)
│   │   └── ConfirmDialog
│   ├── OrdersTab
│   │   ├── Input + Select filters
│   │   ├── Table
│   │   └── Sheet (Order Details)
│   ├── ProductsTab
│   │   ├── Input + Select filters
│   │   ├── Table
│   │   └── ConfirmDialog
│   └── AnalyticsTab
│       ├── KPI Cards (Funnel)
│       ├── DataTable (Product Funnel)
│       ├── SimpleChart (×2)
│       ├── DataTable (×3)
│       └── ConfirmDialog
└── ProductFormModal (Shared)
```

## Tab Features

### 1. Overview Tab

**KPI Cards (Row 1):**

- Total revenue (all time)
- Revenue (last 30 days)
- Orders (last 7 days)
- Conversion rate (views→purchase %)
- Average order value
- Returning customers count
- Total products
- Total orders

**Charts:**

- Orders per day (14-day trend, bar)
- Revenue per day (14-day trend, line)
- Purchases by hour (0-23 bar)
- Views by hour (0-23 bar)

**Tables:**

- Top 10 products by revenue
- Low stock products (< 10 units)

**Quick Actions:**

- Create Product button
- Download Orders CSV
- Download Products CSV
- Reset all data (danger zone)

### 2. Orders Tab

**Search & Filters:**

- Full-text search (ID, customer name, email, phone)
- Status filter (all, new, paid, in_production, shipped, delivered, cancelled)
- Date range (7 days, 30 days, all)
- Sort by (newest, highest total)

**Bulk Actions:**

- Mark as shipped (for unshipped orders)

**Order Table:**

- ID (truncated hash)
- Customer name
- Total amount
- Status badge (color-coded)
- Date
- View button

**Detail Sheet (on row click):**

- Status dropdown (change status)
- Customer info (name, email, phone)
- Shipping info (address, city, province, zone)
- Items list (with size/options, qty, price)
- Pricing breakdown (subtotal, shipping, total)
- Payment method and notes
- Copy to WhatsApp button
- Print packing slip button

### 3. Products Tab

**Search & Filters:**

- Name search
- Category filter
- OnSale status filter
- Stock status (all, in stock, low <10, out of stock)
- Sort by (name A-Z, price high-low, stock high-low)

**Product Table:**

- Product name
- Category badge
- Price
- Stock (color-coded by level)
- Status badges (Oferta, Sin stock)
- Edit/Delete buttons

**Actions:**

- Create new product
- Edit product (opens form modal)
- Delete product (with confirmation)

### 4. Analytics Tab

**Global Funnel (KPI Cards):**

- Total views
- Total adds to cart
- Total purchases
- View→Add conversion %
- Add→Purchase conversion %

**Product Funnel Table:**

- Product name
- Views, Adds, Purchases
- View→Add %
- View→Purchase %

**Category Analytics:**

- Category name
- Revenue, Purchases, Views by category

**Time Analytics:**

- Purchases by day of week (bar chart)
- Average basket size trend (14-day line chart)

**Commerce Insights:**

- Payment method distribution (method, transaction count, revenue)
- Shipping zone distribution (zone, count, revenue)

**Danger Zone:**

- Reset analytics events

## Data Persistence

### localStorage Keys

- `omar_products`: Product catalog
- `omar_orders`: Order records
- `omar_events`: Analytics events
- `omar_settings`: Store settings

### Event Types Tracked

- `product_view`: Product page visited
- `add_to_cart`: Item added to cart
- `purchase`: Order completed
- Other: `custom_quote_opened`, `contact_whatsapp_click`, etc.

## Performance Optimizations

1. **Memoization**: All metric calculations cached with 1-minute TTL
2. **useMemo**: Filter/sort operations memoized in each tab
3. **Lazy Loading**: Charts and tables render only in active tabs
4. **ScrollArea**: Long tables are scrollable, preventing layout shift
5. **Skeleton Loading**: Placeholders during initial data load

## UX Enhancements

1. **Responsive Design**: Mobile-first with Tailwind breakpoints
2. **Sticky Headers**: Table headers remain visible when scrolling
3. **Bulk Actions**: Mark multiple orders as shipped
4. **CSV Export**: Download orders and products as CSV
5. **Color Coding**:
   - Status badges (blue/purple/yellow/cyan/green/red)
   - Stock warnings (red critical, yellow low)
6. **Confirmation Dialogs**: Dangerous actions require confirmation
7. **Toast Notifications**: Real-time feedback for all actions
8. **Skeleton Loaders**: Smooth content loading transitions

## TypeScript Types

Uses existing `/lib/types.ts`:

- `Product`: Full product schema with id, slug, name, price, stock, category, etc.
- `Order`: Order schema with customer, shipping, items, payment, status
- `AnalyticsEvent`: Event schema with type, timestamp, productId, payload
- `Settings`: Store settings (WhatsApp, shipping costs, hours)

## Routing

### Current Routes

- `/admin` → Unified dashboard (primary)
- `/admin/orders`, `/admin/products`, `/admin/analytics` → Can redirect to `/admin?tab=orders|products|analytics` (optional implementation)
- `/admin/settings` → Can keep as separate page (not consolidated)

### No Breaking Changes

- All existing routes remain functional
- `/admin` becomes the main entry point
- Old routes can redirect to tabs or coexist

## Installation & Running

### Prerequisites

```bash
npm install  # (already done in your project)
```

### Run Development Server

```bash
npm run dev
# Navigate to http://localhost:3000/admin
```

### Available Commands

- `npm run dev`: Development server
- `npm run build`: Production build
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Testing Checklist

- [ ] Load admin dashboard (`/admin`)
- [ ] Verify Overview tab shows KPIs and charts
- [ ] Create a new product via form modal
- [ ] Search/filter products in Products tab
- [ ] Edit and delete products
- [ ] Search/filter orders in Orders tab
- [ ] Click order row to see detail sheet
- [ ] Change order status via dropdown
- [ ] Copy order summary to clipboard
- [ ] View Analytics tab with all charts
- [ ] Download CSV files
- [ ] Test mobile responsiveness (Tailwind breakpoints)
- [ ] Verify data persists after page reload

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live order updates
2. **Advanced Filters**: Date range picker, multi-select filters
3. **Export**: PDF report generation
4. **Webhooks**: Stripe/Mercado Pago integrations
5. **Inventory Management**: Stock level alerts via email
6. **Customer Profiles**: Detailed customer analytics
7. **Custom Reports**: Saveabled filtered views
8. **Role-based Access**: Admin/Moderator permission levels

---

## Implementation Summary

✅ All metrics computed with memoization for performance
✅ Single-page dashboard with 4 main tabs
✅ Rich KPI cards, charts, and data tables
✅ Full CRUD for products
✅ Advanced order management with bulk actions
✅ Comprehensive analytics with funnels and insights
✅ Responsive design with Tailwind CSS
✅ TypeScript type-safe throughout
✅ shadcn/ui components for consistency
✅ localStorage persistence (existing implementation)
✅ Toast notifications for user feedback
✅ Confirmation dialogs for dangerous actions
✅ CSV export functionality
