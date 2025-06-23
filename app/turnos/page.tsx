"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ChevronLeft, Loader2, HelpCircle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

export default function TurnosPage() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    direccion: "",
    fechaNac: "",
    celular: "",
    email: "",
    biotipo: "normal",
    fototipo: "i",
    alteraciones: {
      hipercromias: false,
      rosacea: false,
      acne: false,
    },
    datosClinicosChecked: {
      cardiacas: false,
      renales: false,
      circulatorias: false,
      pulmonares: false,
      digestivas: false,
      hematologicas: false,
      endocrinas: false,
      neurologicas: false,
      hipertension: false,
      alergias: false,
    },
    observaciones: "",
    servicio: "",
    horario: "",
    comentarios: "",
  })

  // Validar el formulario según el paso actual
  const validateStep = (currentStep: number) => {
    const errors: { [key: string]: string } = {}

    if (currentStep === 1) {
      if (!formData.dni) {
        errors.dni = "El DNI es obligatorio"
      } else if (formData.dni.length !== 8) {
        errors.dni = "El DNI debe tener 8 dígitos"
      }

      if (!formData.nombre) {
        errors.nombre = "El nombre es obligatorio"
      }

      if (!formData.direccion) {
        errors.direccion = "La dirección es obligatoria"
      }

      if (!date) {
        errors.fechaNac = "La fecha de nacimiento es obligatoria"
      }

      if (!formData.celular) {
        errors.celular = "El celular es obligatorio"
      } else if (formData.celular.length < 8) {
        errors.celular = "Número de celular inválido"
      }

      if (!formData.email) {
        errors.email = "El email es obligatorio"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Email inválido"
      }
    } else if (currentStep === 3) {
      if (!formData.servicio) {
        errors.servicio = "Debe seleccionar un servicio"
      }

      if (!date) {
        errors.fecha = "Debe seleccionar una fecha"
      }

      if (!formData.horario) {
        errors.horario = "Debe seleccionar un horario"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target

    // Limpiar el error cuando el usuario comienza a escribir
    setFormErrors({
      ...formErrors,
      [id]: "",
    })

    // Para el campo de teléfono, solo permitir números
    if (id === "celular") {
      const numericValue = value.replace(/\D/g, "")
      setFormData((prev) => ({
        ...prev,
        [id]: numericValue,
      }))
    } else if (id === "dni") {
      // Solo permitir números y limitar a 8 dígitos
      const numericValue = value.replace(/\D/g, "").slice(0, 8)
      setFormData((prev) => ({
        ...prev,
        [id]: numericValue,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }))
    }
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormErrors({
      ...formErrors,
      [id]: "",
    })

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleCheckboxChange = (category: string, id: string, checked: boolean) => {
    if (category === "alteraciones") {
      setFormData((prev) => ({
        ...prev,
        alteraciones: {
          ...prev.alteraciones,
          [id]: checked,
        },
      }))
    } else if (category === "datosClinicosChecked") {
      setFormData((prev) => ({
        ...prev,
        datosClinicosChecked: {
          ...prev.datosClinicosChecked,
          [id]: checked,
        },
      }))
    }
  }

  const handleRadioChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
      // Scroll to top when changing steps
      window.scrollTo(0, 0)
    } else {
      toast({
        title: "Error en el formulario",
        description: "Por favor, complete todos los campos obligatorios correctamente.",
        variant: "destructive",
      })
    }
  }

  const handlePrevStep = () => {
    setStep(step - 1)
    // Scroll to top when changing steps
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(step)) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, complete todos los campos obligatorios correctamente.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simular tiempo de procesamiento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Aquí iría la lógica para enviar el formulario
      toast({
        title: "Ficha enviada con éxito",
        description: "Nos pondremos en contacto contigo pronto para confirmar tu turno.",
      })

      // Redirigir a la página principal después de un breve retraso
      setTimeout(() => {
        window.location.href = "/"
      }, 2000)
    } catch (error) {
      console.error("Error al enviar formulario:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar el formulario. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex items-center mb-8">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image src="/logo-transparent.png" alt="Glow up Logo" width={70} height={70} className="object-contain" />
          </div>
          <div>
            <div className="text-xl font-semibold text-[#8B4240]">Glow up</div>
            <div className="text-xs text-[#8B4240] tracking-wide">Estética Cosmiátrica</div>
          </div>
          <h1 className="text-3xl font-bold text-[#8B4240] ml-2">Ficha cosmetológica</h1>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-[#8B4240] text-white" : "bg-gray-200"}`}
          >
            1
          </div>
          <div className={`w-20 h-1 ${step >= 2 ? "bg-[#8B4240]" : "bg-gray-200"}`}></div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-[#8B4240] text-white" : "bg-gray-200"}`}
          >
            2
          </div>
          <div className={`w-20 h-1 ${step >= 3 ? "bg-[#8B4240]" : "bg-gray-200"}`}></div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-[#8B4240] text-white" : "bg-gray-200"}`}
          >
            3
          </div>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto shadow-lg border-[#f0d0b0]/50">
        <CardHeader className="bg-gradient-to-r from-[#f9e5d0]/50 to-white border-b border-[#f0d0b0]/30">
          <CardTitle className="text-xl text-[#3d0d04]">
            {step === 1 && "Información Personal"}
            {step === 2 && "Información Clínica"}
            {step === 3 && "Reserva de Turno"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Por favor completa tus datos personales"}
            {step === 2 && "Información sobre tu piel y salud"}
            {step === 3 && "Selecciona la fecha y hora para tu consulta"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dni" className="flex items-center">
                      DNI <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="dni"
                      placeholder="Ingresa tu DNI"
                      required
                      value={formData.dni}
                      onChange={handleInputChange}
                      className={`border-[#f0d0b0] focus:border-[#d4a373] ${formErrors.dni ? "border-red-300" : ""}`}
                      aria-invalid={!!formErrors.dni}
                      aria-describedby={formErrors.dni ? "error-dni" : undefined}
                    />
                    {formErrors.dni && (
                      <p id="error-dni" className="text-xs text-red-500 mt-1">
                        {formErrors.dni}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="flex items-center">
                      Nombre y Apellido <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="nombre"
                      placeholder="Ingresa tu nombre completo"
                      required
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={`border-[#f0d0b0] focus:border-[#d4a373] ${formErrors.nombre ? "border-red-300" : ""}`}
                      aria-invalid={!!formErrors.nombre}
                      aria-describedby={formErrors.nombre ? "error-nombre" : undefined}
                    />
                    {formErrors.nombre && (
                      <p id="error-nombre" className="text-xs text-red-500 mt-1">
                        {formErrors.nombre}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion" className="flex items-center">
                    Dirección <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="direccion"
                    placeholder="Ingresa tu dirección"
                    required
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className={`border-[#f0d0b0] focus:border-[#d4a373] ${formErrors.direccion ? "border-red-300" : ""}`}
                    aria-invalid={!!formErrors.direccion}
                    aria-describedby={formErrors.direccion ? "error-direccion" : undefined}
                  />
                  {formErrors.direccion && (
                    <p id="error-direccion" className="text-xs text-red-500 mt-1">
                      {formErrors.direccion}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaNac" className="flex items-center">
                      Fecha de Nacimiento <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal border-[#f0d0b0] hover:bg-[#f9e5d0]/10",
                            !date && "text-muted-foreground",
                            formErrors.fechaNac && "border-red-300",
                          )}
                          aria-invalid={!!formErrors.fechaNac}
                          aria-describedby={formErrors.fechaNac ? "error-fechaNac" : undefined}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(newDate) => {
                            setDate(newDate)
                            setFormErrors({
                              ...formErrors,
                              fechaNac: "",
                            })
                          }}
                          initialFocus
                          locale={es}
                          className="rounded-md border border-[#f0d0b0]"
                          styles={{
                            day_selected: { backgroundColor: "#8B4240", color: "white" },
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {formErrors.fechaNac && (
                      <p id="error-fechaNac" className="text-xs text-red-500 mt-1">
                        {formErrors.fechaNac}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="celular" className="flex items-center">
                      Celular <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="celular"
                      placeholder="Ingresa tu número de celular"
                      required
                      value={formData.celular}
                      onChange={handleInputChange}
                      className={`border-[#f0d0b0] focus:border-[#d4a373] ${formErrors.celular ? "border-red-300" : ""}`}
                      aria-invalid={!!formErrors.celular}
                      aria-describedby={formErrors.celular ? "error-celular" : undefined}
                    />
                    {formErrors.celular && (
                      <p id="error-celular" className="text-xs text-red-500 mt-1">
                        {formErrors.celular}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    Correo Electrónico <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`border-[#f0d0b0] focus:border-[#d4a373] ${formErrors.email ? "border-red-300" : ""}`}
                    aria-invalid={!!formErrors.email}
                    aria-describedby={formErrors.email ? "error-email" : undefined}
                  />
                  {formErrors.email && (
                    <p id="error-email" className="text-xs text-red-500 mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Label className="font-medium">Biotipo Cutáneo</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 ml-2">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Más información</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            El biotipo cutáneo se refiere a las características naturales de tu piel, como su nivel de
                            grasa, hidratación y sensibilidad.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <RadioGroup
                    defaultValue="normal"
                    value={formData.biotipo}
                    onValueChange={(value) => handleRadioChange("biotipo", value)}
                    className="bg-white p-3 rounded-md border border-[#f0d0b0]/50 grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <RadioGroupItem value="normal" id="normal" className="text-[#8B4240]" />
                      <Label htmlFor="normal" className="cursor-pointer">
                        Normal
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <RadioGroupItem value="seca" id="seca" className="text-[#8B4240]" />
                      <Label htmlFor="seca" className="cursor-pointer">
                        Seca
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <RadioGroupItem value="mixta" id="mixta" className="text-[#8B4240]" />
                      <Label htmlFor="mixta" className="cursor-pointer">
                        Mixta
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <RadioGroupItem value="grasa" id="grasa" className="text-[#8B4240]" />
                      <Label htmlFor="grasa" className="cursor-pointer">
                        Grasa
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <Label className="font-medium">Fototipo Cutáneo</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 ml-2">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Más información</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            El fototipo cutáneo clasifica la piel según su reacción a la exposición solar, desde el tipo
                            I (muy clara, siempre se quema) hasta el tipo VI (muy oscura, nunca se quema).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <RadioGroup
                    defaultValue="i"
                    value={formData.fototipo}
                    onValueChange={(value) => handleRadioChange("fototipo", value)}
                    className="bg-white p-3 rounded-md border border-[#f0d0b0]/50 grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <RadioGroupItem value="i" id="fototipo-i" className="text-[#8B4240]" />
                      <Label htmlFor="fototipo-i" className="cursor-pointer">
                        I
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <RadioGroupItem value="ii" id="fototipo-ii" className="text-[#8B4240]" />
                      <Label htmlFor="fototipo-ii" className="cursor-pointer">
                        II
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <RadioGroupItem value="iii" id="fototipo-iii" className="text-[#8B4240]" />
                      <Label htmlFor="fototipo-iii" className="cursor-pointer">
                        III
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <RadioGroupItem value="iv" id="fototipo-iv" className="text-[#8B4240]" />
                      <Label htmlFor="fototipo-iv" className="cursor-pointer">
                        IV
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="font-medium">Alteraciones</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-white p-3 rounded-md border border-[#f0d0b0]/50">
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <Checkbox
                        id="hipercromias"
                        checked={formData.alteraciones.hipercromias}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("alteraciones", "hipercromias", checked as boolean)
                        }
                        className="text-[#8B4240] border-[#d4a373] data-[state=checked]:bg-[#8B4240] data-[state=checked]:border-[#8B4240]"
                      />
                      <Label htmlFor="hipercromias" className="cursor-pointer">
                        Hipercromias
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <Checkbox
                        id="rosacea"
                        checked={formData.alteraciones.rosacea}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("alteraciones", "rosacea", checked as boolean)
                        }
                        className="text-[#8B4240] border-[#d4a373] data-[state=checked]:bg-[#8B4240] data-[state=checked]:border-[#8B4240]"
                      />
                      <Label htmlFor="rosacea" className="cursor-pointer">
                        Rosácea
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <Checkbox
                        id="acne"
                        checked={formData.alteraciones.acne}
                        onCheckedChange={(checked) => handleCheckboxChange("alteraciones", "acne", checked as boolean)}
                        className="text-[#8B4240] border-[#d4a373] data-[state=checked]:bg-[#8B4240] data-[state=checked]:border-[#8B4240]"
                      />
                      <Label htmlFor="acne" className="cursor-pointer">
                        Acné
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-medium">Datos Clínicos</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-white p-3 rounded-md border border-[#f0d0b0]/50">
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <Checkbox
                        id="cardiacas"
                        checked={formData.datosClinicosChecked.cardiacas}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("datosClinicosChecked", "cardiacas", checked as boolean)
                        }
                        className="text-[#8B4240] border-[#d4a373] data-[state=checked]:bg-[#8B4240] data-[state=checked]:border-[#8B4240]"
                      />
                      <Label htmlFor="cardiacas" className="cursor-pointer">
                        Enf. Cardíacas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <Checkbox
                        id="renales"
                        checked={formData.datosClinicosChecked.renales}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("datosClinicosChecked", "renales", checked as boolean)
                        }
                        className="text-[#8B4240] border-[#d4a373] data-[state=checked]:bg-[#8B4240] data-[state=checked]:border-[#8B4240]"
                      />
                      <Label htmlFor="renales" className="cursor-pointer">
                        Enf. Renales
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <Checkbox
                        id="circulatorias"
                        checked={formData.datosClinicosChecked.circulatorias}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("datosClinicosChecked", "circulatorias", checked as boolean)
                        }
                        className="text-[#8B4240] border-[#d4a373] data-[state=checked]:bg-[#8B4240] data-[state=checked]:border-[#8B4240]"
                      />
                      <Label htmlFor="circulatorias" className="cursor-pointer">
                        Enf. Circulatorias
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <Checkbox
                        id="pulmonares"
                        checked={formData.datosClinicosChecked.pulmonares}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("datosClinicosChecked", "pulmonares", checked as boolean)
                        }
                        className="text-[#8B4240] border-[#d4a373] data-[state=checked]:bg-[#8B4240] data-[state=checked]:border-[#8B4240]"
                      />
                      <Label htmlFor="pulmonares" className="cursor-pointer">
                        Enf. Pulmonares
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <Checkbox
                        id="digestivas"
                        checked={formData.datosClinicosChecked.digestivas}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("datosClinicosChecked", "digestivas", checked as boolean)
                        }
                        className="text-[#8B4240] border-[#d4a373] data-[state=checked]:bg-[#8B4240] data-[state=checked]:border-[#8B4240]"
                      />
                      <Label htmlFor="digestivas" className="cursor-pointer">
                        Enf. Digestivas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <Checkbox
                        id="hematologicas"
                        checked={formData.datosClinicosChecked.hematologicas}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("datosClinicosChecked", "hematologicas", checked as boolean)
                        }
                        className="text-[#8B4240] border-[#d4a373] data-[state=checked]:bg-[#8B4240] data-[state=checked]:border-[#8B4240]"
                      />
                      <Label htmlFor="hematologicas" className="cursor-pointer">
                        Enf. Hematológicas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <Checkbox
                        id="endocrinas"
                        checked={formData.datosClinicosChecked.endocrinas}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("datosClinicosChecked", "endocrinas", checked as boolean)
                        }
                        className="text-[#8B4240] border-[#d4a373] data-[state=checked]:bg-[#8B4240] data-[state=checked]:border-[#8B4240]"
                      />
                      <Label htmlFor="endocrinas" className="cursor-pointer">
                        Enf. Endócrinas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <Checkbox
                        id="neurologicas"
                        checked={formData.datosClinicosChecked.neurologicas}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("datosClinicosChecked", "neurologicas", checked as boolean)
                        }
                        className="text-[#8B4240] border-[#d4a373] data-[state=checked]:bg-[#8B4240] data-[state=checked]:border-[#8B4240]"
                      />
                      <Label htmlFor="neurologicas" className="cursor-pointer">
                        Enf. Neurológicas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <Checkbox
                        id="hipertension"
                        checked={formData.datosClinicosChecked.hipertension}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("datosClinicosChecked", "hipertension", checked as boolean)
                        }
                        className="text-[#8B4240] border-[#d4a373] data-[state=checked]:bg-[#8B4240] data-[state=checked]:border-[#8B4240]"
                      />
                      <Label htmlFor="hipertension" className="cursor-pointer">
                        Hipertensión
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f9e5d0]/10">
                      <Checkbox
                        id="alergias"
                        checked={formData.datosClinicosChecked.alergias}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("datosClinicosChecked", "alergias", checked as boolean)
                        }
                        className="text-[#8B4240] border-[#d4a373] data-[state=checked]:bg-[#8B4240] data-[state=checked]:border-[#8B4240]"
                      />
                      <Label htmlFor="alergias" className="cursor-pointer">
                        Alergias
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones Adicionales</Label>
                  <Textarea
                    id="observaciones"
                    placeholder="Escribe cualquier información adicional que consideres relevante"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    className="min-h-[100px] border-[#f0d0b0] focus:border-[#d4a373]"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="servicio" className="flex items-center">
                    Selecciona el Servicio <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select value={formData.servicio} onValueChange={(value) => handleSelectChange("servicio", value)}>
                    <SelectTrigger
                      className={`border-[#f0d0b0] focus:border-[#d4a373] ${formErrors.servicio ? "border-red-300" : ""}`}
                      aria-invalid={!!formErrors.servicio}
                      aria-describedby={formErrors.servicio ? "error-servicio" : undefined}
                    >
                      <SelectValue placeholder="Selecciona un servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="limpieza">Limpieza Facial</SelectItem>
                      <SelectItem value="antiedad">Tratamiento Anti-edad</SelectItem>
                      <SelectItem value="hidratacion">Hidratación Profunda</SelectItem>
                      <SelectItem value="consulta">Consulta Inicial</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.servicio && (
                    <p id="error-servicio" className="text-xs text-red-500 mt-1">
                      {formErrors.servicio}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center">
                    Fecha Preferida <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal border-[#f0d0b0] hover:bg-[#f9e5d0]/10",
                          !date && "text-muted-foreground",
                          formErrors.fecha && "border-red-300",
                        )}
                        aria-invalid={!!formErrors.fecha}
                        aria-describedby={formErrors.fecha ? "error-fecha" : undefined}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          setDate(newDate)
                          setFormErrors({
                            ...formErrors,
                            fecha: "",
                          })
                        }}
                        initialFocus
                        locale={es}
                        className="rounded-md border border-[#f0d0b0]"
                        styles={{
                          day_selected: { backgroundColor: "#8B4240", color: "white" },
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {formErrors.fecha && (
                    <p id="error-fecha" className="text-xs text-red-500 mt-1">
                      {formErrors.fecha}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horario" className="flex items-center">
                    Horario Preferido <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select value={formData.horario} onValueChange={(value) => handleSelectChange("horario", value)}>
                    <SelectTrigger
                      className={`border-[#f0d0b0] focus:border-[#d4a373] ${formErrors.horario ? "border-red-300" : ""}`}
                      aria-invalid={!!formErrors.horario}
                      aria-describedby={formErrors.horario ? "error-horario" : undefined}
                    >
                      <SelectValue placeholder="Selecciona un horario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9">9:00</SelectItem>
                      <SelectItem value="10">10:00</SelectItem>
                      <SelectItem value="11">11:00</SelectItem>
                      <SelectItem value="12">12:00</SelectItem>
                      <SelectItem value="15">15:00</SelectItem>
                      <SelectItem value="16">16:00</SelectItem>
                      <SelectItem value="17">17:00</SelectItem>
                      <SelectItem value="18">18:00</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.horario && (
                    <p id="error-horario" className="text-xs text-red-500 mt-1">
                      {formErrors.horario}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comentarios">Comentarios Adicionales</Label>
                  <Textarea
                    id="comentarios"
                    placeholder="¿Hay algo más que quieras comentarnos?"
                    value={formData.comentarios}
                    onChange={handleInputChange}
                    className="min-h-[100px] border-[#f0d0b0] focus:border-[#d4a373]"
                  />
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between p-6 bg-gradient-to-r from-white to-[#f9e5d0]/30 border-t border-[#f0d0b0]/30">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={handlePrevStep}
              className="border-[#3d0d04] text-[#3d0d04] hover:bg-[#f9e5d0]/50"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
          ) : (
            <Button variant="outline" asChild className="border-[#3d0d04] text-[#3d0d04] hover:bg-[#f9e5d0]/50">
              <Link href="/">Cancelar</Link>
            </Button>
          )}

          {step < 3 ? (
            <Button onClick={handleNextStep} className="bg-[#8B4240] hover:bg-[#7A3A38]">
              Siguiente
              <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-[#8B4240] hover:bg-[#7A3A38]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar Ficha"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
