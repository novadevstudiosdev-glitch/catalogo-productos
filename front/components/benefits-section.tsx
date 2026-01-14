import { CheckCircle, Sparkles, Truck, Users } from 'lucide-react';

const benefits = [
  {
    icon: Users,
    title: 'Para Todos',
    description: 'Productos variados para vos, tu familia, amigos y cualquier ocasión especial.',
  },
  {
    icon: Sparkles,
    title: 'Variedad Garantizada',
    description: 'Tecnología, ropa, juegos, rompecabezas, regalos y mucho más en un solo lugar.',
  },
  {
    icon: CheckCircle,
    title: 'Calidad Confiable',
    description: 'Productos verificados de marcas reconocidas con garantía en cada compra.',
  },
  {
    icon: Truck,
    title: 'Envíos Rápidos',
    description: 'Entrega en toda Argentina. Seguimiento en tiempo real de tu pedido.',
  },
];

export function BenefitsSection() {
  const colors = ['#986459', '#987977', '#7D6470', '#76647C'];

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">¿Por qué elegir MOK Store?</h2>
          <p className="mt-4 text-lg text-muted-foreground">Tu tienda online de confianza con productos variados y envíos a todo el país</p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div key={benefit.title} className="rounded-lg border border-border/30 bg-card p-8 transition-shadow hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg text-white" style={{ backgroundColor: colors[index] }}>
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">{benefit.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
