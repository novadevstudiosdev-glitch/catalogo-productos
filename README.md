# MOK Store 🛍️

Una tienda online moderna y minimalista construida con **Next.js** y **Node.js**, diseñada para ofrecer una experiencia de compra elegante y responsiva.

## 🎨 Características

- ✨ **Diseño Minimalista** - Interfaz limpia y elegante con paleta de colores personalizada
- 🛒 **Carrito Dinámico** - Gestión de carrito con persistencia en localStorage
- 🔍 **Búsqueda Avanzada** - Filtrado y búsqueda de productos en tiempo real
- 📱 **Completamente Responsivo** - Funciona perfecto en móvil, tablet y desktop
- 🎬 **Animaciones Fluidas** - Transiciones elegantes y preloader personalizado
- 🔐 **Admin Panel** - Gestor de productos con CRUD completo
- 📦 **Gestión de Stock** - Control automático de inventario
- 🎯 **Validaciones Forma** - Validación en tiempo real de datos de usuario

## 🚀 Stack Tecnológico

### Frontend
- **Next.js 14+** - React framework moderno
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling utility-first
- **Shadcn/UI** - Componentes accesibles
- **Lucide Icons** - Iconografía moderna

### Backend
- **Node.js + Express** - Servidor robusto
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **CORS** - Manejo de solicitudes cross-origin

## 📦 Instalación

### Prerequisites
- Node.js 18+ 
- MongoDB local o Atlas
- npm o pnpm

### Backend Setup

```bash
cd backend
npm install
npm run seed    # Cargar datos de ejemplo
npm run start   # Iniciar servidor
```

El servidor correrá en `http://localhost:5000`

### Frontend Setup

```bash
cd front
npm install
npm run dev     # Modo desarrollo
npm run build   # Producción
npm run start   # Iniciar servidor
```

La app correrá en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
catalogo-productos/
├── backend/
│   ├── config/
│   │   └── db.js              # Conexión MongoDB
│   ├── controllers/
│   │   ├── orderController.js # Lógica de órdenes
│   │   └── productController.js # Lógica de productos
│   ├── models/
│   │   ├── Order.js          # Schema de órdenes
│   │   └── Product.js        # Schema de productos
│   ├── routes/
│   │   ├── orders.js         # Rutas de órdenes
│   │   └── products.js       # Rutas de productos
│   ├── data/
│   │   ├── seedData.js       # Script de seed
│   │   └── seedProducts.json # Datos de ejemplo
│   ├── server.js             # Entry point
│   ├── package.json
│   └── .env.example
│
└── front/
    ├── app/
    │   ├── page.tsx          # Home con preloader
    │   ├── productos/        # Página de productos
    │   ├── carrito/          # Página del carrito
    │   ├── admin/            # Panel de administración
    │   ├── contacto/         # Página de contacto
    │   └── ordenes/          # Historial de órdenes
    ├── components/
    │   ├── product-card.tsx  # Tarjeta de producto
    │   ├── preloader.tsx     # Pantalla de carga
    │   ├── header.tsx        # Navegación
    │   └── ui/               # Componentes Shadcn
    ├── hooks/
    │   ├── useProducts.ts    # Hook de productos
    │   └── useOrders.ts      # Hook de órdenes
    ├── lib/
    │   ├── cart-context.tsx  # Context del carrito
    │   └── products.ts       # Utilidades
    ├── package.json
    └── .env.example
```

## 🔧 Variables de Entorno

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/mok-store
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🎯 Características Principales

### Gestión de Productos
- Crear, editar y eliminar productos
- Sistema de descuentos con cálculo automático
- Control de stock con validación
- Categorización automática
- Imágenes optimizadas (quality 95)

### Carrito de Compras
- Agregar/remover productos
- Actualizar cantidades
- Persistencia con localStorage
- Validación de stock en checkout
- Cálculo automático de totales

### Admin Panel
- Dashboard de productos con filtros
- Gestión completa del catálogo
- Visualización de órdenes
- Cambio de estado de pedidos
- Estadísticas de stock

### Validaciones
- **Formularios**: Nombre, email, teléfono, dirección
- **Productos**: Stock, precios, descuentos
- **Órdenes**: Validación en tiempo real
- **Imágenes**: URLs válidas

## 🎨 Paleta de Colores

```
Púrpura Oscuro:  #76647C (Primary)
Púrpura Suave:   #7D6470 (Secondary)
Marrón Oscuro:   #986459 (Accent)
Taupe:           #987977 (Accent 2)
```

## 🎬 Animaciones

- **Preloader**: 3.2s con fade out elegante
- **Transiciones de página**: Fade + slide suave
- **Botones**: Colores con hover personalizado
- **Carrito**: Bounce animation al agregar
- **Imágenes**: Zoom en hover

## 📝 Scripts Disponibles

### Backend
```bash
npm run start    # Iniciar servidor
npm run seed     # Cargar datos de ejemplo
npm run dev      # Modo desarrollo con nodemon
```

### Frontend
```bash
npm run dev      # Desarrollo
npm run build    # Build para producción
npm run start    # Iniciar servidor de producción
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Orders
- `GET /api/orders` - Obtener todas las órdenes
- `POST /api/orders` - Crear orden
- `PUT /api/orders/:id` - Actualizar estado de orden

## 💡 Tips

1. **Imágenes de alta calidad**: Las imágenes se optimizan automáticamente a quality 95
2. **Búsqueda en tiempo real**: Usa useMemo para performance
3. **Validación automática**: Los formularios validan mientras escribes
4. **Stock en tiempo real**: Se actualiza automáticamente en órdenes

## 📱 Responsividad

- Mobile: Colapsable nav, grid single column
- Tablet: Grid 2 columnas, nav optimizado
- Desktop: Grid 3+ columnas, navegación completa

## 🚀 Deploy

### Vercel (Frontend)
```bash
npm install -g vercel
vercel
```

### Heroku (Backend)
```bash
heroku create your-app-name
heroku config:set MONGO_URI=your_mongodb_uri
git push heroku main
```

## 📄 Licencia

MIT - Libre para usar y modificar

## 👨‍💻 Desarrollo

Hecho con ❤️ usando las mejores prácticas modernas de web development.

---

**¿Preguntas?** Abre un issue en GitHub o contacta al equipo.
