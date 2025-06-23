"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

export function ContactForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Para el campo de teléfono, solo permitir números
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "")
      setFormData((prev) => ({ ...prev, [name]: numericValue }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validar campos requeridos
      if (!formData.name || !formData.email || !formData.message) {
        toast({
          title: "Error",
          description: "Por favor completa todos los campos requeridos",
          variant: "destructive",
          duration: 2000,
        })
        setIsSubmitting(false)
        return
      }

      // Simular envío (esperar 1 segundo)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Guardar en localStorage
      const consultaId = `consulta_${Date.now()}`
      const nuevaConsulta = {
        id: consultaId,
        ...formData,
        fechaCreacion: new Date().toISOString(),
        estado: "Pendiente",
      }

      // Obtener consultas existentes
      const consultasExistentes = JSON.parse(localStorage.getItem("consultasTurnos") || "[]")

      // Agregar nueva consulta
      const consultasActualizadas = [...consultasExistentes, nuevaConsulta]

      // Guardar en localStorage
      localStorage.setItem("consultasTurnos", JSON.stringify(consultasActualizadas))

      // Mostrar mensaje de éxito
      toast({
        title: "Mensaje enviado",
        description: "Hemos recibido tu mensaje. Nos pondremos en contacto contigo pronto.",
        duration: 2000,
      })

      // Cerrar el diálogo
      onClose()
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar el mensaje. Por favor, inténtalo de nuevo.",
        variant: "destructive",
        duration: 2000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[#3d0d04] font-medium">
          Nombre y Apellido *
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ingresa tu nombre y apellido"
          required
          className="border-[#f0d0b0] focus:border-[#d4a373] focus:ring-[#d4a373]/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#3d0d04] font-medium">
          Email *
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          required
          className="border-[#f0d0b0] focus:border-[#d4a373] focus:ring-[#d4a373]/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-[#3d0d04] font-medium">
          Teléfono (opcional)
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Tu número de teléfono"
          className="border-[#f0d0b0] focus:border-[#d4a373] focus:ring-[#d4a373]/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-[#3d0d04] font-medium">
          Mensaje *
        </Label>
        <p className="text-xs text-gray-500 mb-2">
          Nota sobre turnos: Los turnos son principalmente por la mañana. Si el día solicitado no está disponible, nos
          contactaremos para ofrecerte un horario alternativo.
        </p>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Escribe tu mensaje aquí..."
          className="min-h-[120px] border-[#f0d0b0] focus:border-[#d4a373] focus:ring-[#d4a373]/20"
          required
        />
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onClose} className="border-[#3d0d04] text-[#3d0d04]">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-[#3d0d04] hover:bg-[#571306]">
          {isSubmitting ? "Enviando..." : "Enviar mensaje"}
        </Button>
      </DialogFooter>
    </form>
  )
}
