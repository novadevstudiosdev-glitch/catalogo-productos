import { CheckCircle, Sparkles, Truck, Users } from "lucide-react"

const benefits = [
  {
    icon: Users,
    title: "Para Tu Equipo",
    description: "Ideales para equipos amateur, torneos de barrio, ligas locales y clubes de la zona.",
  },
  {
    icon: Sparkles,
    title: "Diseño 100% Tuyo",
    description: "Vos elegís colores, tipografía, número, nombre y escudo. Armamos el diseño juntos.",
  },
  {
    icon: CheckCircle,
    title: "Calidad Premium",
    description: "Telas de primera calidad, sublimación duradera y terminaciones profesionales.",
  },
  {
    icon: Truck,
    title: "Envíos a Todo el País",
    description: "Llegamos a toda Argentina. Consulta tiempos y costos de envío a tu zona.",
  },
]

export function BenefitsSection() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">¿Por qué elegir MOK?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Somos especialistas en camisetas personalizadas para equipos de fútbol
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-lg border border-border bg-card p-8 transition-shadow hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-foreground text-primary-foreground">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">{benefit.title}</h3>
              <p className="mt-2 text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
