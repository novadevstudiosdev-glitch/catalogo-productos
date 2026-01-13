const steps = [
  {
    number: "1",
    title: "Escribinos por WhatsApp",
    description: "Contanos qué necesitás: cantidad de camisetas, colores, idea de diseño y presupuesto.",
  },
  {
    number: "2",
    title: "Armamos el Diseño",
    description: "Te enviamos propuestas de diseño con los colores, número, nombre y escudo de tu equipo.",
  },
  {
    number: "3",
    title: "Recibí en Casa",
    description: "Una vez aprobado, producimos y enviamos las camisetas a tu domicilio en toda Argentina.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-secondary py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">¿Cómo funciona?</h2>
          <p className="mt-4 text-lg text-muted-foreground">En 3 simples pasos tenés las camisetas de tu equipo</p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-3xl font-bold text-primary-foreground">
                {step.number}
              </div>
              <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
