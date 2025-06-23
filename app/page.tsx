"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog-slow"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, MapPin, Phone, Clock, Star, Heart, Sparkles, Check, Instagram, X } from "lucide-react"
import { TurnosCalendario } from "./components/turnos-calendario"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import * as DialogPrimitive from "@radix-ui/react-dialog"

// Importar las fuentes de Google Fonts
import { Libre_Baskerville, Raleway } from "next/font/google"

// Configurar las fuentes
const libreBaskerville = Libre_Baskerville({ subsets: ["latin"], weight: ["700"] })
const raleway = Raleway({ subsets: ["latin"], weight: ["400"] })

export default function Home() {
  const { toast } = useToast()
  const [scrolled, setScrolled] = useState(false)
  const [limpiezaDialogOpen, setLimpiezaDialogOpen] = useState(false)
  const [antiedadDialogOpen, setAntiedadDialogOpen] = useState(false)
  const [hidratacionDialogOpen, setHidratacionDialogOpen] = useState(false)
  const [contactFormOpen, setContactFormOpen] = useState(false)
  const [mapDialogOpen, setMapDialogOpen] = useState(false)

  // Paleta de colores ampliada
  const colors = {
    primary: "#3d0d04",
    primaryLight: "#571306",
    primaryDark: "#2d0a02",
    secondary: "#f9e5d0",
    secondaryLight: "#fdf1e6",
    secondaryDark: "#f0d0b0",
    accent1: "#d4a373",
    accent2: "#ccd5ae",
    accent3: "#e9edc9",
  }

  // Estado para el formulario de contacto
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setScrolled(scrollPosition > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Manejar cambios en el formulario
  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target

    // Para el campo de teléfono, solo permitir números
    if (id === "phone") {
      const numericValue = value.replace(/\D/g, "")
      setContactForm((prev) => ({
        ...prev,
        [id]: numericValue,
      }))
    } else {
      setContactForm((prev) => ({
        ...prev,
        [id]: value,
      }))
    }
  }

  // Manejar envío del formulario
  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Crear un ID único para la consulta
      const consultaId = Date.now().toString()

      // Obtener consultas existentes del localStorage
      const consultasGuardadas = JSON.parse(localStorage.getItem("consultasTurnos") || "[]")

      // Agregar la nueva consulta
      const nuevaConsulta = {
        id: consultaId,
        ...contactForm,
        fechaCreacion: new Date().toISOString(),
        estado: "Pendiente",
      }

      consultasGuardadas.push(nuevaConsulta)

      // Guardar en localStorage
      localStorage.setItem("consultasTurnos", JSON.stringify(consultasGuardadas))

      // Mostrar mensaje de éxito
      toast({
        title: "Consulta enviada",
        description: "Tu consulta ha sido enviada correctamente. Nos pondremos en contacto contigo pronto.",
      })

      // Limpiar formulario y cerrar diálogo
      setContactForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      })
      setContactFormOpen(false)
    } catch (error) {
      console.error("Error al guardar consulta:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar tu consulta. Por favor, intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled ? "bg-white/95 shadow-md border-b border-[#3d0d04]/10 py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative transition-transform duration-500 transform-gpu">
              <Image
                src="/logo-transparent.png"
                alt="Glow up Logo"
                width={scrolled ? 50 : 60}
                height={scrolled ? 50 : 60}
                className={`object-contain brightness-0 sepia-[.5] hue-rotate-[300deg] saturate-[8] transition-all duration-500`}
              />
            </div>
            <div>
              <div
                className={`text-xl font-bold text-[#3d0d04] ${libreBaskerville.className} transition-all duration-500`}
              >
                Glow up
              </div>
              <div className={`text-[0.65rem] text-[#3d0d04] tracking-wide ${raleway.className}`}>
                Estética Cosmiátrica
              </div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#servicios"
              className="text-sm font-medium text-[#3d0d04] hover:text-[#571306] relative group transition-all duration-300"
            >
              Servicios
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3d0d04] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#nosotros"
              className="text-sm font-medium text-[#3d0d04] hover:text-[#571306] relative group transition-all duration-300"
            >
              Nosotros
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3d0d04] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#contacto"
              className="text-sm font-medium text-[#3d0d04] hover:text-[#571306] relative group transition-all duration-300"
            >
              Contacto
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3d0d04] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-10 md:py-16 overflow-hidden">
          {/* Fondo con gradiente mejorado */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f9e5d0] via-[#fdf1e6] to-[#f9e5d0] w-full h-full"></div>

          {/* Elementos decorativos */}
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#d4a373]/10 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#ccd5ae]/10 blur-3xl"></div>

          {/* PARCHE ÚNICO PARA LA MANCHA - Ajustado a la posición correcta y tamaño reducido */}
          <div
            className="absolute z-30"
            style={{
              right: "28%",
              top: "45%",
              width: "70px",
              height: "70px",
              backgroundColor: "#fdf1e6",
              boxShadow: "0 0 15px 15px #fdf1e6",
            }}
          ></div>

          {/* Contenedor principal con z-index para estar por encima del fondo pero debajo de los parches */}
          <div className="container relative z-20">
            <div className="flex-1 space-y-6 text-center">
              {/* Contenedor para la imagen y el texto con posición relativa */}
              <div className="relative flex justify-center items-center flex-col gap-2 mb-2">
                {/* Contenedor específico para la imagen con overflow hidden para evitar que se salga cualquier parte de la imagen */}
                <div className="relative w-[455px] h-[455px] flex items-center justify-center overflow-hidden animate-fade-in">
                  <Image
                    src="/images/ojo-glow-up.png"
                    alt="Glow up Eye Logo"
                    width={455}
                    height={455}
                    className="object-contain brightness-0 sepia-[.5] hue-rotate-[300deg] saturate-[8] animate-float"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                </div>

                {/* Texto del logo con animación */}
                <div
                  className={`text-6xl text-[#3d0d04] font-bold tracking-wider ${libreBaskerville.className} animate-fade-in-up`}
                >
                  Glow up
                </div>
                <div
                  className={`text-2xl text-[#3d0d04] font-bold mb-6 tracking-wider ${raleway.className} animate-fade-in-up animation-delay-100`}
                >
                  Estética Cosmiátrica
                </div>
                <h1 className="font-['Great_Vibes',cursive] text-6xl md:text-7xl lg:text-8xl font-normal text-[#3d0d04] leading-tight animate-fade-in-up animation-delay-200">
                  Descubre tu Belleza Natural
                </h1>
              </div>

              <p className="text-lg text-gray-600 max-w-xl mx-auto animate-fade-in-up animation-delay-300">
                Estudio cosmiátrico especializado en tratamientos personalizados para realzar tu belleza natural y
                cuidar tu piel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center animate-fade-in-up animation-delay-400">
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-[#3d0d04] text-[#3d0d04] hover:bg-[#f9e5d0]/50 transition-all duration-300"
                >
                  <Link href="#servicios">Nuestros Servicios</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section - Movida aquí */}
        <section id="nosotros" className="py-20 relative">
          {/* Imagen de fondo con transparencia y overlay mejorado */}
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/70"></div>
            <Image
              src="/images/tratamiento-estetico.jpg"
              alt="Tratamiento estético profesional"
              fill
              className="object-cover opacity-40"
            />
          </div>

          {/* Contenido superpuesto */}
          <div className="container relative z-10">
            <div className="max-w-2xl">
              <div className="w-20 h-1 bg-[#d4a373] mb-6"></div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#2d0a02] mb-4 relative">
                Expertos en belleza y cuidado de la piel
                <span className="absolute -bottom-3 left-0 w-16 h-1 bg-[#ccd5ae]"></span>
              </h2>
              <p className="text-lg text-gray-800 mt-8 mb-8">
                En Glow up, nos dedicamos a realzar tu belleza natural a través de tratamientos personalizados y de alta
                calidad.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/80 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-[#571306] flex items-center justify-center mt-1 shadow-md">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg">Experiencia Profesional</h3>
                    <p className="text-gray-800">
                      Dirigido por Carina Sánchez, Técnica Universitaria Cosmiatra y Esteticista con amplia experiencia.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/80 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-[#571306] flex items-center justify-center mt-1 shadow-md">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg">Tratamientos Personalizados</h3>
                    <p className="text-gray-800">
                      Nuestro enfoque se basa en entender las necesidades únicas de cada cliente.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/80 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-[#571306] flex items-center justify-center mt-1 shadow-md">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg">Productos de Calidad</h3>
                    <p className="text-gray-800">
                      Utilizamos productos de primera calidad para garantizar los mejores resultados.
                    </p>
                  </div>
                </div>
              </div>

              {/* Badge de estrellas mejorado */}
              <div className="absolute bottom-4 right-4 w-36 h-20 bg-white rounded-lg shadow-lg flex items-center justify-center p-3 z-20 transform rotate-3 hover:rotate-0 transition-all duration-300">
                <div className="text-center">
                  <div className="flex justify-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-xs text-gray-600 mt-1 font-medium">Profesional certificada</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección con los cuatro elementos */}
        <div className="container mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 px-8 bg-white rounded-xl shadow-lg">
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-[#f9e5d0] flex items-center justify-center mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#d4a373]">
                <Sparkles className="h-7 w-7 text-[#3d0d04]" />
              </div>
              <h3 className="font-medium">Productos Premium</h3>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-[#f9e5d0] flex items-center justify-center mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#ccd5ae]">
                <Heart className="h-7 w-7 text-[#3d0d04]" />
              </div>
              <h3 className="font-medium">Atención Personalizada</h3>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-[#f9e5d0] flex items-center justify-center mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#e9edc9]">
                <Star className="h-7 w-7 text-[#3d0d04]" />
              </div>
              <h3 className="font-medium">Profesional Certificada</h3>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-[#f9e5d0] flex items-center justify-center mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#f0d0b0]">
                <Clock className="h-7 w-7 text-[#3d0d04]" />
              </div>
              <h3 className="font-medium">Horarios Flexibles</h3>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <section id="servicios" className="py-8 pt-24 bg-white">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="w-20 h-1 bg-[#d4a373] mx-auto mb-6"></div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#3d0d04] mb-4">Tratamientos Especializados</h2>
              <p className="text-gray-600">
                Ofrecemos una amplia gama de tratamientos diseñados para realzar tu belleza natural y cuidar tu piel con
                los mejores productos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Limpieza Facial */}
              <Card className="border-none rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 group overflow-hidden flex flex-col transform hover:-translate-y-2">
                <div className="overflow-hidden">
                  <Image
                    src="/images/limpieza-facial.jpeg"
                    alt="Limpieza Facial"
                    width={400}
                    height={200}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <CardContent className="p-6 flex flex-col flex-1 relative z-10">
                  <div className="flex-1">
                    <div className="w-12 h-1 bg-[#d4a373] mb-4 transition-all duration-300 group-hover:w-20"></div>
                    <h3 className="text-2xl font-semibold text-[#3d0d04] mb-3">Limpieza Facial</h3>
                    <p className="text-gray-600">
                      Tratamiento profundo para eliminar impurezas y revitalizar la piel de tu rostro, dejándola
                      radiante y saludable.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      className="text-[#3d0d04] p-0 hover:bg-transparent hover:text-[#450f05] group"
                      onClick={() => setLimpiezaDialogOpen(true)}
                    >
                      <span>Ver detalles</span>
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tratamientos Anti-edad */}
              <Card className="border-none rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 group overflow-hidden flex flex-col transform hover:-translate-y-2">
                <div className="overflow-hidden">
                  <Image
                    src="/images/tratamiento-antiedad.jpeg"
                    alt="Tratamientos Anti-edad"
                    width={400}
                    height={200}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <CardContent className="p-6 flex flex-col flex-1 relative z-10">
                  <div className="flex-1">
                    <div className="w-12 h-1 bg-[#ccd5ae] mb-4 transition-all duration-300 group-hover:w-20"></div>
                    <h3 className="text-2xl font-semibold text-[#3d0d04] mb-3">Tratamientos Anti-edad</h3>
                    <p className="text-gray-600">
                      Técnicas avanzadas para reducir líneas de expresión y mejorar la elasticidad, rejuveneciendo tu
                      piel.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      className="text-[#3d0d04] p-0 hover:bg-transparent hover:text-[#450f05] group"
                      onClick={() => setAntiedadDialogOpen(true)}
                    >
                      <span>Ver detalles</span>
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Hidratación Profunda */}
              <Card className="border-none rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 group overflow-hidden flex flex-col transform hover:-translate-y-2">
                <div className="overflow-hidden">
                  <Image
                    src="/images/limpieza-facial.jpeg"
                    alt="Hidratación Profunda"
                    width={400}
                    height={200}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <CardContent className="p-6 flex flex-col flex-1 relative z-10">
                  <div className="flex-1">
                    <div className="w-12 h-1 bg-[#e9edc9] mb-4 transition-all duration-300 group-hover:w-20"></div>
                    <h3 className="text-2xl font-semibold text-[#3d0d04] mb-3">Hidratación Profunda</h3>
                    <p className="text-gray-600">
                      Recupera la hidratación natural de tu piel con nuestros tratamientos especializados para todo tipo
                      de piel.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      className="text-[#3d0d04] p-0 hover:bg-transparent hover:text-[#450f05] group"
                      onClick={() => setHidratacionDialogOpen(true)}
                    >
                      <span>Ver detalles</span>
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contacto" className="py-20 bg-gradient-to-tr from-[#f9e5d0]/50 to-white">
          <div className="container">
            <div className="text-center mb-12">
              <div className="w-20 h-1 bg-[#d4a373] mx-auto mb-6"></div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#3d0d04] mb-4">Contacto</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Estamos aquí para responder tus preguntas y ayudarte a reservar tu próximo tratamiento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden group">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#f9e5d0] flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#d4a373]">
                    <Phone className="h-7 w-7 text-[#3d0d04]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#3d0d04]">Contacto</h3>
                  <p className="text-gray-600">Escribenos por consultas y te responderemos a la brevedad.</p>
                  <Button
                    variant="outline"
                    className="border-[#3d0d04] text-[#3d0d04] hover:bg-[#f9e5d0]/20 mt-2 px-6"
                    onClick={() => setContactFormOpen(true)}
                  >
                    Escribenos Aquí
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden group">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#f9e5d0] flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#ccd5ae]">
                    <MapPin className="h-7 w-7 text-[#3d0d04]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#3d0d04]">Dirección</h3>
                  <p className="text-gray-600">Visítanos en nuestra ubicación en San Miguel, Buenos Aires.</p>
                  <Button
                    variant="outline"
                    className="border-[#3d0d04] text-[#3d0d04] hover:bg-[#f9e5d0]/20 px-6"
                    onClick={() => setMapDialogOpen(true)}
                  >
                    Ver en mapa
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Eliminado el recuadro blanco de fondo */}
            <div className="flex justify-center">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg w-full max-w-2xl">
                <h3 className="text-2xl font-semibold text-[#3d0d04] mb-6 text-center">Reserva tu turno</h3>
                <TurnosCalendario />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Diálogos para los servicios */}
      <Dialog open={limpiezaDialogOpen} onOpenChange={setLimpiezaDialogOpen}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden border-none max-h-[90vh] flex flex-col">
          <div className="flex flex-col md:flex-row h-full overflow-auto">
            {/* Imagen de fondo a la izquierda */}
            <div className="relative h-64 md:h-auto md:w-2/5 flex-shrink-0">
              <Image src="/images/limpieza-facial.jpeg" alt="Limpieza Facial" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>

            {/* Contenido a la derecha */}
            <div className="p-6 md:w-3/5 overflow-y-auto">
              <DialogHeader className="pb-2">
                <div className="w-12 h-1 bg-[#d4a373] mb-4"></div>
                <DialogTitle className="text-2xl font-semibold text-[#3d0d04]">Limpieza Facial</DialogTitle>
                <DialogDescription className="text-gray-500">
                  Tratamiento revitalizante para todo tipo de piel
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-[#3d0d04]">Descripción</h4>
                  <p className="text-gray-700 text-sm">
                    Procedimiento cosmiátrico que comienza con una evaluación dermocosmética para determinar el biotipo
                    y estado cutáneo. Incluye higienización superficial, exfoliación mecánica o enzimática, extracción
                    de comedones, aplicación de alta frecuencia (según criterio profesional), máscara específica según
                    necesidad cutánea y finalización con principios activos hidratantes y descongestivos.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-[#3d0d04]">Beneficios</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#d4a373] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Elimina impurezas y células muertas</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#d4a373] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Mejora la textura y luminosidad de la piel</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#d4a373] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Previene la aparición de acné y puntos negros</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#d4a373] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Prepara la piel para otros tratamientos</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1.5 bg-white/90 text-gray-500 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogContent>
      </Dialog>

      <Dialog open={antiedadDialogOpen} onOpenChange={setAntiedadDialogOpen}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden border-none max-h-[90vh] flex flex-col">
          <div className="flex flex-col md:flex-row h-full overflow-auto">
            {/* Imagen de fondo a la izquierda */}
            <div className="relative h-64 md:h-auto md:w-2/5 flex-shrink-0">
              <Image
                src="/images/tratamiento-antiedad.jpeg"
                alt="Tratamientos Anti-edad"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>

            {/* Contenido a la derecha */}
            <div className="p-6 md:w-3/5 overflow-y-auto">
              <DialogHeader className="pb-2">
                <div className="w-12 h-1 bg-[#ccd5ae] mb-4"></div>
                <DialogTitle className="text-2xl font-semibold text-[#3d0d04]">Tratamientos Anti-edad</DialogTitle>
                <DialogDescription className="text-gray-500">Rejuvenecimiento y firmeza para tu piel</DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-[#3d0d04]">Descripción</h4>
                  <p className="text-gray-700 text-sm">
                    Incluimos procedimientos personalizados según el fototipo y grado de envejecimiento cutáneo.
                    Estimulamos la síntesis de colágeno y elastina, mejoramos la firmeza tisular y atenúamos signos del
                    fotoenvejecimiento. Sumamos acciones específicas para pieles con pérdida de tonicidad, arrugas finas
                    y deshidratación profunda.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-[#3d0d04]">Beneficios</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ccd5ae] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Reduce líneas de expresión y arrugas</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ccd5ae] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Mejora la elasticidad y firmeza de la piel</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ccd5ae] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Estimula la producción natural de colágeno</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#ccd5ae] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Atenúa manchas y unifica el tono de la piel</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1.5 bg-white/90 text-gray-500 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogContent>
      </Dialog>

      <Dialog open={hidratacionDialogOpen} onOpenChange={setHidratacionDialogOpen}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden border-none max-h-[90vh] flex flex-col">
          <div className="flex flex-col md:flex-row h-full overflow-auto">
            {/* Imagen de fondo a la izquierda */}
            <div className="relative h-64 md:h-auto md:w-2/5 flex-shrink-0">
              <Image src="/images/limpieza-facial.jpeg" alt="Hidratación Profunda" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>

            {/* Contenido a la derecha */}
            <div className="p-6 md:w-3/5 overflow-y-auto">
              <DialogHeader className="pb-2">
                <div className="w-12 h-1 bg-[#e9edc9] mb-4"></div>
                <DialogTitle className="text-2xl font-semibold text-[#3d0d04]">Hidratación Profunda</DialogTitle>
                <DialogDescription className="text-gray-500">
                  Restaura el equilibrio natural de tu piel
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-[#3d0d04]">Descripción</h4>
                  <p className="text-gray-700 text-sm">
                    Realizamos tratamiento cosmiátrico indicado para restaurar el equilibrio hidrolipídico cutáneo. Se
                    aplica tras una evaluación del estado de hidratación de la piel y puede incluir limpieza previa,
                    exfoliación suave y técnicas de vehiculización de activos. Mejoramos la textura, elasticidad y
                    luminosidad de la piel, previniendo la deshidratación transdérmica y reforzando la función barrera.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-[#3d0d04]">Beneficios</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#e9edc9] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Restaura los niveles óptimos de hidratación</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#e9edc9] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Mejora la textura y suavidad de la piel</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#e9edc9] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Refuerza la barrera cutánea natural</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-[#e9edc9] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Previene el envejecimiento prematuro</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1.5 bg-white/90 text-gray-500 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogContent>
      </Dialog>

      {/* Diálogo para el formulario de contacto */}
      <Dialog open={contactFormOpen} onOpenChange={setContactFormOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#3d0d04]">Contáctanos</DialogTitle>
            <DialogDescription>
              Completa el formulario y nos pondremos en contacto contigo a la brevedad.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-3 mt-2" onSubmit={handleContactFormSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre y Apellido</Label>
              <Input
                id="name"
                placeholder="Tu nombre y apellido"
                required
                value={contactForm.name}
                onChange={handleContactFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Tu email"
                required
                value={contactForm.email}
                onChange={handleContactFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Celular (opcional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Tu número de celular"
                value={contactForm.phone}
                onChange={handleContactFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea
                id="message"
                placeholder="¿En qué podemos ayudarte?"
                className="min-h-[80px]"
                required
                value={contactForm.message}
                onChange={handleContactFormChange}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setContactFormOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#571306] hover:bg-[#450f05]">
                Enviar mensaje
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para el mapa */}
      <Dialog open={mapDialogOpen} onOpenChange={setMapDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#3d0d04]">Nuestra Ubicación</DialogTitle>
            <DialogDescription>
              Angel D' Elía entre Pringles y Güemes, San Miguel, provincia de Buenos Aires
            </DialogDescription>
          </DialogHeader>
          <div className="w-full h-[400px] mt-4 rounded-md overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d821.0988566535096!2d-58.71756397078046!3d-34.54432499483096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcbd0d3d6e053f%3A0x8f7d458af82b7d10!2sAngel%20D&#39;%20El%C3%ADa%20%26%20Pringles%2C%20San%20Miguel%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1714936118093!5m2!1ses-419!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Glow Up"
              className="rounded-md"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="py-4 bg-gradient-to-r from-[#571306] to-[#6a1807] text-white relative shadow-[0_-5px_15px_rgba(0,0,0,0.1)]">
        {/* Línea decorativa superior */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#d4a373]/80 via-[#f9e5d0]/60 to-[#d4a373]/80"></div>

        {/* Sombra interna superior */}
        <div className="absolute top-0 left-0 w-full h-[8px] bg-gradient-to-b from-black/20 to-transparent"></div>

        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="relative flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
                aria-label="Acceso para administradores"
              >
                <div className="relative">
                  <Image
                    src="/logo-transparent.png"
                    alt="Glow up Logo"
                    width={40}
                    height={40}
                    className="object-contain brightness-0 invert"
                  />
                </div>
                <div>
                  <div className={`text-lg font-bold text-white ${libreBaskerville.className}`}>Glow up</div>
                  <div className={`text-[0.6rem] text-white tracking-wide ${raleway.className}`}>
                    Estética Cosmiátrica
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex flex-col justify-center">
              <h4 className="text-sm font-semibold mb-2 text-white/90">Contacto</h4>
              <ul className="space-y-1">
                <li
                  className="flex items-center gap-2 text-xs text-white/70 cursor-pointer hover:text-white transition-colors"
                  onClick={() => setContactFormOpen(true)}
                >
                  <Phone className="h-3 w-3" />
                  <span>Contacto y Turnos</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-white/70">
                  <MapPin className="h-3 w-3" />
                  <span>Maestro Angel D' Elía 0000, San Miguel, GBA</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-end">
              <a
                href="https://www.instagram.com/glowestetica.ba/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="text-xs">@glowestetica.ba</span>
              </a>
            </div>
          </div>

          <div className="border-t border-white/20 pt-3">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-xs text-white/60">
                © {new Date().getFullYear()} <span className={libreBaskerville.className}>Glow up</span>. Todos los
                derechos reservados.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
