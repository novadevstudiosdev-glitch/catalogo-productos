"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MessageCircle, ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

const colorMap: Record<string, string> = {
  Celeste: "bg-sky-400",
  Blanco: "bg-white border border-gray-300",
  "Azul Marino": "bg-blue-900",
  Azul: "bg-blue-600",
  Dorado: "bg-yellow-500",
  Negro: "bg-black",
  Rojo: "bg-red-600",
  Verde: "bg-green-600",
  Gris: "bg-gray-500",
  Amarillo: "bg-yellow-400",
}

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState(product.sizes[2] || "M")
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [personalized, setPersonalized] = useState(false)
  const [playerName, setPlayerName] = useState("")
  const [playerNumber, setPlayerNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      customization: {
        size: selectedSize,
        color: selectedColor,
        personalized,
        name: personalized ? playerName : undefined,
        number: personalized ? playerNumber : undefined,
        notes: notes || undefined,
      },
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const whatsappMessage = `Hola MOK! Quiero pedir un diseño 100% personalizado para mi equipo`

  return (
    <section className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/productos"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a productos
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Product Info & Customization */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
            <p className="mt-2 text-2xl font-bold">{product.priceFormatted}</p>
            <p className="mt-4 text-muted-foreground">{product.description}</p>

            {/* Size Selector */}
            <div className="mt-8">
              <Label className="text-sm font-medium">Talle</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex h-10 w-12 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "border-foreground bg-foreground text-primary-foreground"
                        : "border-border bg-card hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="mt-6">
              <Label className="text-sm font-medium">Color: {selectedColor}</Label>
              <div className="mt-2 flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative h-10 w-10 rounded-full ${colorMap[color] || "bg-gray-400"} transition-transform ${
                      selectedColor === color ? "ring-2 ring-foreground ring-offset-2" : "hover:scale-110"
                    }`}
                    title={color}
                  >
                    {selectedColor === color && (
                      <Check
                        className={`absolute inset-0 m-auto h-5 w-5 ${color === "Blanco" || color === "Amarillo" || color === "Dorado" ? "text-black" : "text-white"}`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Personalization Toggle */}
            <div className="mt-6 flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <Label htmlFor="personalization" className="text-sm font-medium">
                  Personalización
                </Label>
                <p className="text-sm text-muted-foreground">Agregar nombre y número en la espalda</p>
              </div>
              <Switch id="personalization" checked={personalized} onCheckedChange={setPersonalized} />
            </div>

            {/* Personalization Fields */}
            {personalized && (
              <div className="mt-4 space-y-4 rounded-lg border border-border bg-card p-4">
                <div>
                  <Label htmlFor="playerName" className="text-sm font-medium">
                    Nombre en la espalda
                  </Label>
                  <Input
                    id="playerName"
                    placeholder="Ej: MESSI"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                    maxLength={15}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="playerNumber" className="text-sm font-medium">
                    Número en la espalda
                  </Label>
                  <Input
                    id="playerNumber"
                    placeholder="Ej: 10"
                    value={playerNumber}
                    onChange={(e) => setPlayerNumber(e.target.value.replace(/\D/g, "").slice(0, 2))}
                    maxLength={2}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Notas adicionales (opcional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Instrucciones especiales, pedidos extra..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">* La personalización puede afectar el precio final</p>
              </div>
            )}

            {/* Add to Cart Button */}
            <Button onClick={handleAddToCart} size="lg" className="mt-6 w-full gap-2" disabled={added}>
              {added ? (
                <>
                  <Check className="h-5 w-5" />
                  Agregado al carrito
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  Agregar al carrito
                </>
              )}
            </Button>

            {/* Custom Design CTA */}
            <div className="mt-6 rounded-lg border border-dashed border-border p-4 text-center">
              <p className="text-sm text-muted-foreground">¿Querés un diseño 100% a medida para tu equipo?</p>
              <Link
                href={`https://wa.me/5491112345678?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600"
              >
                <MessageCircle className="h-4 w-4" />
                Pedir diseño 100% personalizado
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
