const steps = [
  {
    number: '1',
    title: 'Explorá Nuestro Catálogo',
    description: 'Descubrí cientos de productos: tecnología, ropa, juegos, regalos y más en MOK Store.',
  },
  {
    number: '2',
    title: 'Agregá al Carrito',
    description: 'Elegí lo que te gusta, revisa los precios y agregá a tu carrito de compras.',
  },
  {
    number: '3',
    title: 'Recibí en tu Casa',
    description: 'Completá tu compra, pagá de forma segura y recibí tu pedido en toda Argentina.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-secondary py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">¿Cómo funciona?</h2>
          <p className="mt-4 text-lg text-muted-foreground">En 3 simples pasos completás tu compra en MOK Store</p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-3xl font-bold text-primary-foreground">{step.number}</div>
              <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
