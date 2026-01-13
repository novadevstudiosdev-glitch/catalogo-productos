import { ContactForm } from "@/components/contact-form"
import { MessageCircle, Clock, MapPin } from "lucide-react"
import Link from "next/link"

export default function ContactoPage() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contactanos</h1>
          <p className="mt-4 text-lg text-muted-foreground">¿Tenés preguntas? Escribinos y te respondemos al toque</p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          {/* WhatsApp CTA - Primary */}
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-green-500 bg-card p-8 text-center lg:p-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white">
              <MessageCircle className="h-10 w-10" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">WhatsApp Directo</h2>
            <p className="mt-3 text-muted-foreground">
              La forma más rápida de contactarnos. Te respondemos en minutos, no en días.
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Lunes a Sábados de 9 a 20hs</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Envíos a toda Argentina</span>
              </div>
            </div>
            <Link
              href="https://wa.me/5491112345678?text=Hola%20MOK!%20Quiero%20consultar%20por%20camisetas%20personalizadas"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-green-500 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-green-600"
            >
              <MessageCircle className="h-5 w-5" />
              Escribinos Ahora
            </Link>
            <p className="mt-4 text-xs text-muted-foreground">+54 9 11 1234-5678</p>
          </div>

          {/* Contact Form - Secondary */}
          <div className="rounded-xl border border-border bg-card p-8">
            <h2 className="text-xl font-bold">Formulario de Contacto</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Si preferís, dejanos tu consulta acá y te respondemos por mail
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
