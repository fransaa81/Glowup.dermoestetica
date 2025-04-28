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
import { CalendarIcon, ChevronLeft } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

export default function TurnosPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [step, setStep] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el formulario
    alert("Formulario enviado con éxito. Nos pondremos en contacto contigo pronto.")
    // Redirigir a la página principal
    window.location.href = "/"
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
            <div className="text-xs text-[#8B4240]">"Centro de Estética"</div>
          </div>
          <h1 className="text-2xl font-bold text-[#8B4240] ml-2">Ficha cosmetológica</h1>
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

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>
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
        <CardContent>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dni">DNI</Label>
                    <Input id="dni" placeholder="Ingresa tu DNI" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre y Apellido</Label>
                    <Input id="nombre" placeholder="Ingresa tu nombre completo" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" placeholder="Ingresa tu dirección" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaNac">Fecha de Nacimiento</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={es} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="celular">Celular</Label>
                    <Input id="celular" placeholder="Ingresa tu número de celular" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" placeholder="Ingresa tu correo electrónico" required />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-6">
                <div className="space-y-3">
                  <Label>Biotipo Cutáneo</Label>
                  <RadioGroup defaultValue="normal">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="normal" id="normal" />
                      <Label htmlFor="normal">Normal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="seca" id="seca" />
                      <Label htmlFor="seca">Seca</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mixta" id="mixta" />
                      <Label htmlFor="mixta">Mixta</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="grasa" id="grasa" />
                      <Label htmlFor="grasa">Grasa</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Fototipo Cutáneo</Label>
                  <RadioGroup defaultValue="i">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="i" id="fototipo-i" />
                      <Label htmlFor="fototipo-i">I</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ii" id="fototipo-ii" />
                      <Label htmlFor="fototipo-ii">II</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="iii" id="fototipo-iii" />
                      <Label htmlFor="fototipo-iii">III</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="iv" id="fototipo-iv" />
                      <Label htmlFor="fototipo-iv">IV</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Alteraciones</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hipercromias" />
                      <Label htmlFor="hipercromias">Hipercromias</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rosacea" />
                      <Label htmlFor="rosacea">Rosácea</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="acne" />
                      <Label htmlFor="acne">Acné</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Datos Clínicos</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cardiacas" />
                      <Label htmlFor="cardiacas">Enf. Cardíacas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="renales" />
                      <Label htmlFor="renales">Enf. Renales</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="circulatorias" />
                      <Label htmlFor="circulatorias">Enf. Circulatorias</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pulmonares" />
                      <Label htmlFor="pulmonares">Enf. Pulmonares</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="digestivas" />
                      <Label htmlFor="digestivas">Enf. Digestivas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hematologicas" />
                      <Label htmlFor="hematologicas">Enf. Hematológicas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="endocrinas" />
                      <Label htmlFor="endocrinas">Enf. Endócrinas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="neurologicas" />
                      <Label htmlFor="neurologicas">Enf. Neurológicas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hipertension" />
                      <Label htmlFor="hipertension">Hipertensión</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="alergias" />
                      <Label htmlFor="alergias">Alergias</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones Adicionales</Label>
                  <Textarea
                    id="observaciones"
                    placeholder="Escribe cualquier información adicional que consideres relevante"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label>Selecciona el Servicio</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="limpieza">Limpieza Facial</SelectItem>
                      <SelectItem value="antiedad">Tratamiento Anti-edad</SelectItem>
                      <SelectItem value="hidratacion">Hidratación Profunda</SelectItem>
                      <SelectItem value="consulta">Consulta Inicial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fecha Preferida</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={es} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Horario Preferido</Label>
                  <Select>
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comentarios">Comentarios Adicionales</Label>
                  <Textarea id="comentarios" placeholder="¿Hay algo más que quieras comentarnos?" />
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Anterior
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/">Cancelar</Link>
            </Button>
          )}

          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} className="bg-[#8B4240] hover:bg-[#7A3A38]">
              Siguiente
            </Button>
          ) : (
            <Button type="submit" onClick={handleSubmit} className="bg-[#8B4240] hover:bg-[#7A3A38]">
              Confirmar Ficha
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
