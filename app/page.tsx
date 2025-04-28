"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, MapPin, Phone, CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <Image src="/logo-transparent.png" alt="Glow up Logo" width={70} height={70} className="object-contain" />
            </div>
          </div>
          <nav className="flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Inicio
            </Link>
            <Link href="#servicios" className="text-sm font-medium hover:text-primary">
              Servicios
            </Link>
            <Link href="#nosotros" className="text-sm font-medium hover:text-primary">
              Nosotros
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-[#FBE8E0]">
          <div className="container flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-[#8B4240]">Descubre tu belleza natural con Glow up</h1>
              <p className="text-lg text-muted-foreground">
                Estudio cosmiátrico especializado en tratamientos personalizados para realzar tu belleza natural.
              </p>
              <div className="flex gap-4 pt-4">
                <Button asChild size="lg" className="bg-[#8B4240] hover:bg-[#7A3A38]">
                  <Link href="/login">Ficha cosmetológica</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-[#8B4240] text-[#8B4240]">
                  <Link href="#servicios">
                    Nuestros Servicios
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <div className="relative">
                <Image
                  src="/logo-transparent.png"
                  alt="Glow up"
                  width={400}
                  height={400}
                  className="object-contain mb-4"
                />
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-semibold text-[#8B4240]">Glow up</span>
                  <span className="text-sm text-[#8B4240]">"Centro de Estética"</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicios" className="py-16 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#8B4240]">Nuestros Servicios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-[#FBE8E0] flex items-center justify-center">
                    <span className="text-2xl text-[#8B4240]">✨</span>
                  </div>
                  <h3 className="text-xl font-semibold">Limpieza Facial</h3>
                  <p className="text-muted-foreground">
                    Tratamiento profundo para eliminar impurezas y revitalizar la piel de tu rostro.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-[#FBE8E0] flex items-center justify-center">
                    <span className="text-2xl text-[#8B4240]">💆‍♀️</span>
                  </div>
                  <h3 className="text-xl font-semibold">Tratamientos Anti-edad</h3>
                  <p className="text-muted-foreground">
                    Técnicas avanzadas para reducir líneas de expresión y mejorar la elasticidad.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-[#FBE8E0] flex items-center justify-center">
                    <span className="text-2xl text-[#8B4240]">🌿</span>
                  </div>
                  <h3 className="text-xl font-semibold">Hidratación Profunda</h3>
                  <p className="text-muted-foreground">
                    Recupera la hidratación natural de tu piel con nuestros tratamientos especializados.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-10">
              <Button asChild variant="outline" className="border-[#8B4240] text-[#8B4240]">
                <Link href="/servicios">Ver todos los servicios</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="nosotros" className="py-16 bg-[#FBE8E0]/30">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="Caro Sanz"
                  width={400}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-bold text-[#8B4240]">Sobre Nosotros</h2>
                <p className="text-lg">
                  En Glow up, nos dedicamos a realzar tu belleza natural a través de tratamientos personalizados y de
                  alta calidad.
                </p>
                <p>
                  Dirigido por Carina Sánchez, Técnica Universitaria Cosmiatra y Esteticista con amplia experiencia en
                  el cuidado de la piel.
                </p>
                <p>
                  Nuestro enfoque se basa en entender las necesidades únicas de cada cliente para ofrecer soluciones
                  efectivas y resultados visibles.
                </p>
                <Button variant="outline" asChild className="border-[#8B4240] text-[#8B4240]">
                  <Link href="/nosotros">Conocer más</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contacto" className="py-16 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#8B4240]">Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <Phone className="h-8 w-8 text-[#8B4240] mb-2" />
                  <h3 className="text-xl font-semibold">Teléfono</h3>
                  <p className="text-muted-foreground">+54 11 1234-5678</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <MapPin className="h-8 w-8 text-[#8B4240] mb-2" />
                  <h3 className="text-xl font-semibold">Dirección</h3>
                  <p className="text-muted-foreground">Av. Ejemplo 1234, Buenos Aires</p>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-10">
              <TurnosCalendario />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 bg-[#8B4240] text-white">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image src="/logo-transparent.png" alt="Glow up Logo" width={50} height={50} className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold">Glow up</span>
              <span className="text-xs">"Centro de Estética"</span>
            </div>
          </div>
          <div className="text-sm text-white/80 mt-4 md:mt-0">
            © {new Date().getFullYear()} Glow up. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

function TurnosCalendario() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [step, setStep] = useState(1) // 1: seleccionar fecha, 2: seleccionar hora, 3: formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    edad: "",
  })
  const [turnoConfirmado, setTurnoConfirmado] = useState(false)

  // Horarios fijos disponibles
  const availableTimes = ["8:00", "9:30", "11:00"]

  // Días disponibles (lunes a viernes)
  const isDayAvailable = (date: Date) => {
    const day = date.getDay()
    // 1: lunes, 2: martes, 3: miércoles, 4: jueves, 5: viernes
    return day >= 1 && day <= 5
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setSelectedTime(null)
    if (selectedDate) {
      setStep(2)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(3)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí podrías implementar la lógica para enviar los datos del turno
    setTurnoConfirmado(true)
    setIsCalendarOpen(false)
  }

  const resetForm = () => {
    setDate(undefined)
    setSelectedTime(null)
    setStep(1)
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      edad: "",
    })
    setTurnoConfirmado(false)
  }

  return (
    <div className="flex flex-col items-center">
      <Popover
        open={isCalendarOpen}
        onOpenChange={(open) => {
          setIsCalendarOpen(open)
          if (!open) {
            // Si se cierra el popover sin confirmar, resetear
            if (!turnoConfirmado) {
              resetForm()
            }
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button className="bg-[#8B4240] hover:bg-[#7A3A38] mb-4">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Elegí un turno
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          {step === 1 && (
            <div className="p-4">
              <h3 className="text-center font-medium mb-4">Selecciona un día disponible</h3>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  // Deshabilitar días pasados
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)

                  // Deshabilitar días no disponibles (fines de semana)
                  return date < today || !isDayAvailable(date)
                }}
                initialFocus
                locale={es}
                className="border rounded-md"
              />
              <p className="text-xs text-center mt-2 text-muted-foreground">Disponible de lunes a viernes</p>
            </div>
          )}

          {step === 2 && date && (
            <div className="p-4">
              <div className="flex items-center mb-4">
                <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="mr-2">
                  ← Volver
                </Button>
                <h3 className="font-medium">{format(date, "EEEE d 'de' MMMM", { locale: es })}</h3>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Horarios disponibles:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && date && selectedTime && (
            <div className="p-4 w-80">
              <div className="flex items-center mb-4">
                <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="mr-2">
                  ← Volver
                </Button>
                <h3 className="font-medium">Completa tus datos</h3>
              </div>

              <div className="mb-2 text-sm">
                <p>
                  Turno: {format(date, "EEEE d 'de' MMMM", { locale: es })} a las {selectedTime}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edad">Edad</Label>
                  <Input
                    id="edad"
                    name="edad"
                    type="number"
                    min="18"
                    max="120"
                    value={formData.edad}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-[#8B4240] hover:bg-[#7A3A38] mt-4">
                  Confirmar Turno
                </Button>
              </form>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {turnoConfirmado && (
        <div className="text-center p-4 bg-green-50 rounded-md border border-green-200 mt-2">
          <p className="text-green-800 font-medium">¡Turno confirmado!</p>
          <p className="text-sm text-green-700">
            {formData.nombre} {formData.apellido}, tu turno para el {format(date!, "d 'de' MMMM", { locale: es })} a las{" "}
            {selectedTime} ha sido reservado.
          </p>
          <p className="text-xs text-green-600 mt-1">Te enviaremos un recordatorio a {formData.email}</p>
          <Button variant="outline" size="sm" onClick={resetForm} className="mt-2 text-green-700 border-green-300">
            Reservar otro turno
          </Button>
        </div>
      )}
    </div>
  )
}
