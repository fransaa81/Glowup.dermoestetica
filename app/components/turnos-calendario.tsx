"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addDays,
  getDay,
} from "date-fns"
import { es } from "date-fns/locale"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Clock, ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { enviarConfirmacionTurno } from "../actions/email-actions"
import { programarRecordatorio } from "../actions/recordatorio-actions"

export function TurnosCalendario() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [step, setStep] = useState(1) // 1: seleccionar fecha y hora, 2: formulario
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    dni: "",
    fechaNacimiento: "",
    email: "",
    telefono: "",
  })
  const [turnoConfirmado, setTurnoConfirmado] = useState(false)
  const [turnosReservados, setTurnosReservados] = useState<any[]>([])
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([])
  const [configuracionHorarios, setConfiguracionHorarios] = useState<any>({
    horarios: {},
    excepciones: {},
  })
  const [fechasHabilitadas, setFechasHabilitadas] = useState<Date[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [showCalendarLegend, setShowCalendarLegend] = useState(false)
  const [calendarDays, setCalendarDays] = useState<Date[]>([])

  // Horarios predeterminados
  const HORARIOS_PREDETERMINADOS = [
    "8:30 a 10:00",
    "10:00 a 11:30",
    "11:30 a 13:00",
    "14:30 a 16:00",
    "16:00 a 17:30",
    "17:30 a 19:00",
  ]

  // Generar días del calendario para el mes actual
  useEffect(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)

    // Obtener todos los días del mes
    let days = eachDayOfInterval({ start, end })

    // Obtener el día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
    const firstDayOfWeek = getDay(start)

    // Añadir días del mes anterior para completar la primera semana
    // Ajustar para que la semana comience en lunes (1) en lugar de domingo (0)
    const daysToAdd = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

    for (let i = 0; i < daysToAdd; i++) {
      days = [subMonths(addDays(start, -i - 1), 0), ...days]
    }

    // Añadir días del mes siguiente para completar la última semana
    const lastDayOfWeek = getDay(end)
    // Ajustar para que la semana termine en domingo (0)
    const daysToAddAtEnd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek

    for (let i = 0; i < daysToAddAtEnd; i++) {
      days = [...days, addDays(end, i + 1)]
    }

    // Asegurarse de que siempre haya 6 semanas (42 días)
    while (days.length < 42) {
      days = [...days, addDays(days[days.length - 1], 1)]
    }

    setCalendarDays(days)
  }, [currentMonth])

  // Cargar turnos reservados y configuración de horarios al iniciar
  useEffect(() => {
    const cargarDatos = () => {
      const turnosGuardados = JSON.parse(localStorage.getItem("turnosReservados") || "[]")
      setTurnosReservados(turnosGuardados)

      // Cargar configuración de horarios
      try {
        const configuracionGuardada = JSON.parse(localStorage.getItem("configuracionHorarios") || "{}")

        // Asegurarse de que exista el campo excepciones
        if (!configuracionGuardada.excepciones) {
          configuracionGuardada.excepciones = {}
        }

        setConfiguracionHorarios(configuracionGuardada)

        // Actualizar fechas habilitadas
        const habilitadas = Object.keys(configuracionGuardada.excepciones)
          .filter((fecha) => !configuracionGuardada.excepciones[fecha].bloqueado)
          .map((fecha) => new Date(fecha))

        setFechasHabilitadas(habilitadas)
      } catch (error) {
        console.error("Error al cargar configuración de horarios:", error)
        setConfiguracionHorarios({
          horarios: {},
          excepciones: {},
        })
        setFechasHabilitadas([])
      }
    }

    cargarDatos()

    // Escuchar cambios en localStorage
    window.addEventListener("storage", cargarDatos)
    return () => {
      window.removeEventListener("storage", cargarDatos)
    }
  }, [])

  // Días disponibles (solo los explícitamente habilitados por el administrador)
  const isDayAvailable = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const excepcion = configuracionHorarios.excepciones[dateStr]

    // Deshabilitar días pasados
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return false

    // Solo permitir fechas que tengan una excepción explícita y no estén bloqueadas
    return excepcion !== undefined && !excepcion.bloqueado
  }

  // Verificar si un horario está disponible para la fecha seleccionada
  const getHorariosDisponibles = (selectedDate: Date) => {
    if (!selectedDate) return []

    const fechaFormateada = format(selectedDate, "yyyy-MM-dd")
    const excepcion = configuracionHorarios.excepciones[fechaFormateada]

    // Si no hay una excepción para esta fecha o está bloqueada, no hay horarios disponibles
    if (!excepcion || excepcion.bloqueado) {
      return []
    }

    // Usar los horarios específicos de la excepción (CORREGIDO: true = deshabilitado, false/undefined = habilitado)
    const horariosHabilitados = HORARIOS_PREDETERMINADOS.filter((horario) => excepcion.horarios[horario] !== true)

    // Filtrar los horarios que ya están reservados para esta fecha
    const horariosReservados = turnosReservados
      .filter((turno) => turno.fecha === fechaFormateada)
      .map((turno) => turno.horario)

    // Devolver solo los horarios habilitados que no están reservados
    return horariosHabilitados.filter((horario) => !horariosReservados.includes(horario))
  }

  const handleDateSelect = (selectedDate: Date) => {
    // Verificar si el día está disponible
    if (!isDayAvailable(selectedDate)) {
      toast({
        title: "Fecha no disponible",
        description: "Esta fecha no está habilitada para turnos. Por favor, seleccione otra fecha.",
        duration: 2000,
      })
      return
    }

    setDate(selectedDate)

    // Obtener horarios disponibles para esta fecha
    const disponibles = getHorariosDisponibles(selectedDate)
    setHorariosDisponibles(disponibles)

    if (disponibles.length === 0) {
      // Si no hay horarios disponibles, mostrar mensaje
      toast({
        title: "No hay horarios disponibles",
        description: "No hay horarios disponibles para esta fecha. Por favor, seleccione otra fecha.",
        duration: 2000,
      })
      setDate(undefined)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(2)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Limpiar el error cuando el usuario comienza a escribir
    setFormErrors({
      ...formErrors,
      [name]: "",
    })

    // Para el campo de fecha de nacimiento, aplicar formato dd/mm/aaaa
    if (name === "fechaNacimiento") {
      // Eliminar caracteres no numéricos excepto /
      let formattedValue = value.replace(/[^\d/]/g, "")

      // Aplicar formato automático dd/mm/aaaa
      if (formattedValue.length > 0) {
        // Eliminar / adicionales
        formattedValue = formattedValue.replace(/\//g, "")

        // Añadir / después del día y mes
        if (formattedValue.length > 2) {
          formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2)
        }
        if (formattedValue.length > 5) {
          formattedValue = formattedValue.slice(0, 5) + "/" + formattedValue.slice(5)
        }

        // Limitar a 10 caracteres (dd/mm/aaaa)
        formattedValue = formattedValue.slice(0, 10)
      }

      setFormData({
        ...formData,
        [name]: formattedValue,
      })
    }
    // Para el campo DNI, solo permitir números y limitar a 8 dígitos
    else if (name === "dni") {
      const numericValue = value.replace(/\D/g, "").slice(0, 8)
      setFormData({
        ...formData,
        [name]: numericValue,
      })
    }
    // Para el campo teléfono, solo permitir números
    else if (name === "telefono") {
      const numericValue = value.replace(/\D/g, "")
      setFormData({
        ...formData,
        [name]: numericValue,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  // Validar formato de fecha dd/mm/aaaa
  const isValidDate = (dateString: string) => {
    // Verificar formato
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return false
    }

    // Extraer día, mes y año
    const parts = dateString.split("/")
    const day = Number.parseInt(parts[0], 10)
    const month = Number.parseInt(parts[1], 10) - 1 // Los meses en JS son 0-11
    const year = Number.parseInt(parts[2], 10)

    // Crear objeto Date y verificar si es válido
    const date = new Date(year, month, day)

    // Verificar que la fecha sea válida y no sea futura
    const today = new Date()
    return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year && date <= today
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!formData.nombreCompleto.trim()) {
      errors.nombreCompleto = "El nombre es obligatorio"
    } else if (formData.nombreCompleto.trim().split(" ").length < 2) {
      errors.nombreCompleto = "Ingrese nombre y apellido"
    }

    if (!formData.dni) {
      errors.dni = "El DNI es obligatorio"
    } else if (formData.dni.length !== 8) {
      errors.dni = "El DNI debe tener 8 dígitos"
    }

    if (!formData.fechaNacimiento) {
      errors.fechaNacimiento = "La fecha es obligatoria"
    } else if (!isValidDate(formData.fechaNacimiento)) {
      errors.fechaNacimiento = "Formato inválido (dd/mm/aaaa)"
    }

    if (!formData.email) {
      errors.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido"
    }

    if (!formData.telefono) {
      errors.telefono = "El teléfono es obligatorio"
    } else if (formData.telefono.length < 8) {
      errors.telefono = "Teléfono demasiado corto"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !selectedTime) {
      toast({
        title: "Error",
        description: "Por favor, seleccione una fecha y horario.",
        variant: "destructive",
        duration: 2000,
      })
      return
    }

    // Validar formulario
    if (!validateForm()) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, corrija los errores en el formulario.",
        variant: "destructive",
        duration: 2000,
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simular tiempo de procesamiento
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Extraer nombre y apellido del nombre completo
      const nombreCompleto = formData.nombreCompleto.trim().split(" ")
      const nombre = nombreCompleto[0] || ""
      const apellido = nombreCompleto.slice(1).join(" ") || ""

      // Crear nuevo turno
      const nuevoTurno = {
        id: Date.now().toString(),
        fecha: format(date, "yyyy-MM-dd"),
        horario: selectedTime,
        nombre: nombre,
        apellido: apellido,
        nombreCompleto: formData.nombreCompleto,
        dni: formData.dni,
        fechaNacimiento: formData.fechaNacimiento,
        email: formData.email,
        telefono: formData.telefono,
        fechaCreacion: new Date().toISOString(),
      }

      // Guardar en localStorage
      const turnosActualizados = [...turnosReservados, nuevoTurno]
      localStorage.setItem("turnosReservados", JSON.stringify(turnosActualizados))
      setTurnosReservados(turnosActualizados)

      // Enviar correo de confirmación
      const resultadoEmail = await enviarConfirmacionTurno(nuevoTurno)

      // Programar recordatorio 24h antes
      const resultadoRecordatorio = await programarRecordatorio(nuevoTurno)

      // Confirmar turno
      setTurnoConfirmado(true)
      setIsCalendarOpen(false)

      toast({
        title: "Turno confirmado",
        description: "Tu turno ha sido reservado correctamente y se ha enviado un correo de confirmación.",
      })
    } catch (error) {
      console.error("Error al guardar turno:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al reservar el turno. Por favor, intente nuevamente.",
        variant: "destructive",
        duration: 2000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setDate(undefined)
    setSelectedTime(null)
    setStep(1)
    setFormData({
      nombreCompleto: "",
      dni: "",
      fechaNacimiento: "",
      email: "",
      telefono: "",
    })
    setFormErrors({})
    setTurnoConfirmado(false)
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handlePrevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1))
  }

  // Obtener la cantidad de horarios disponibles para una fecha
  const getDisponibilidadDia = (date: Date) => {
    const horarios = getHorariosDisponibles(date)
    return horarios.length
  }

  // Renderizar el calendario personalizado
  const renderCalendar = () => {
    const weekDays = ["lu", "ma", "mi", "ju", "vi", "sá", "do"]

    return (
      <div className="p-3 rounded-lg border border-[#FBE8E0]/50 shadow-inner bg-white/90">
        <div className="flex justify-between items-center mb-2">
          <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100" aria-label="Mes anterior">
            <ChevronLeft className="h-5 w-5 text-[#3d0d04]" />
          </button>
          <h3 className="text-[#3d0d04] font-medium">{format(currentMonth, "MMMM yyyy", { locale: es })}</h3>
          <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100" aria-label="Mes siguiente">
            <ChevronRight className="h-5 w-5 text-[#3d0d04]" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mt-2">
          {/* Días de la semana */}
          {weekDays.map((day, index) => (
            <div key={`weekday-${index}`} className="text-center text-sm font-medium text-[#3d0d04] py-1">
              {day}
            </div>
          ))}

          {/* Días del mes */}
          {calendarDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isToday = isSameDay(day, new Date())
            const isSelected = date ? isSameDay(day, date) : false
            const isAvailable = isDayAvailable(day)
            const disponibilidad = isAvailable ? getDisponibilidadDia(day) : 0

            // Determinar clases CSS basadas en el estado del día
            let dayClasses = "relative flex items-center justify-center h-9 w-9 rounded-full text-sm "

            if (isSelected) {
              dayClasses += "bg-[#8B4240] text-white font-medium "
            } else if (isAvailable) {
              dayClasses += "bg-[#f9e5d0] text-black font-medium hover:bg-[#f0d0b0] cursor-pointer "
            } else if (isToday) {
              dayClasses += "border border-[#8B4240] text-gray-400 "
            } else {
              dayClasses += "text-gray-400 "
            }

            return (
              <div key={`day-${index}`} className="text-center relative">
                <button
                  type="button"
                  onClick={() => isAvailable && handleDateSelect(day)}
                  disabled={!isAvailable}
                  className={dayClasses}
                  aria-label={format(day, "d 'de' MMMM", { locale: es })}
                  aria-selected={isSelected}
                  aria-disabled={!isAvailable}
                >
                  {format(day, "d")}
                </button>

                {/* Indicador de disponibilidad */}
                {/*{disponibilidad > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -mb-1">
                          <div className={`flex gap-[2px] ${isSelected ? "opacity-70" : "opacity-100"}`}>
                            {Array.from({ length: Math.min(disponibilidad, 3) }).map((_, i) => (
                              <div key={i} className="w-1 h-1 rounded-full bg-[#8B4240]"></div>
                            ))}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{disponibilidad} horarios disponibles</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}*/}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Renderizar los horarios disponibles
  const renderHorarios = () => {
    if (!date) return null

    return (
      <div className="space-y-4 mt-4">
        <div className="bg-[#f9e5d0]/30 p-3 rounded-md">
          <h4 className="font-medium text-[#3d0d04]">{format(date, "EEEE d 'de' MMMM", { locale: es })}</h4>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#3d0d04]" />
            Horarios disponibles:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {horariosDisponibles.length > 0 ? (
              horariosDisponibles.map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  size="sm"
                  className={`w-full transition-all ${
                    selectedTime === time
                      ? "bg-[#8B4240] text-white hover:bg-[#7A3A38]"
                      : "hover:bg-[#f9e5d0]/50 hover:text-[#3d0d04]"
                  }`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                  {selectedTime === time && <Check className="ml-2 h-3 w-3" />}
                </Button>
              ))
            ) : (
              <p className="col-span-2 text-center text-sm text-muted-foreground py-4">
                No hay horarios disponibles para esta fecha
              </p>
            )}
          </div>
        </div>

        {selectedTime && (
          <div className="pt-4 flex justify-end">
            <Button onClick={() => setStep(2)} className="bg-[#8B4240] hover:bg-[#7A3A38]">
              Continuar con mis datos
            </Button>
          </div>
        )}
      </div>
    )
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
          <Button className="bg-[#3d0d04] hover:bg-[#571306] mb-4 px-8 py-2 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Elegí tu turno
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          {step === 1 && (
            <div className="p-4 w-[350px] md:w-[450px]">
              <h3 className="text-center font-medium mb-4 text-[#3d0d04]">Selecciona fecha y horario</h3>

              <div className="space-y-4">
                {renderCalendar()}
                {date && renderHorarios()}
              </div>
            </div>
          )}

          {step === 2 && date && selectedTime && (
            <div className="p-4 w-[350px] md:w-[450px]">
              <div className="flex items-center mb-4">
                <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="mr-2">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Volver
                </Button>
                <h3 className="font-medium text-[#3d0d04]">Completa tus datos</h3>
              </div>

              <div className="mb-4 p-3 bg-[#f9e5d0]/30 rounded-md">
                <p className="text-sm font-medium text-[#3d0d04]">
                  Turno: {format(date, "EEEE d 'de' MMMM", { locale: es })}
                </p>
                <p className="text-sm font-medium text-[#3d0d04]">Horario: {selectedTime}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreCompleto" className="text-sm font-medium">
                    Nombre y Apellido <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nombreCompleto"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingrese su nombre y apellido"
                    className={`border-[#f0d0b0] focus:border-[#d4a373] ${
                      formErrors.nombreCompleto ? "border-red-300" : ""
                    }`}
                    aria-invalid={!!formErrors.nombreCompleto}
                    aria-describedby={formErrors.nombreCompleto ? "error-nombreCompleto" : undefined}
                  />
                  {formErrors.nombreCompleto && (
                    <p id="error-nombreCompleto" className="text-xs text-red-500 mt-1">
                      {formErrors.nombreCompleto}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dni" className="text-sm font-medium">
                    DNI <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingrese su DNI (8 dígitos)"
                    inputMode="numeric"
                    maxLength={8}
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
                  <Label htmlFor="fechaNacimiento" className="text-sm font-medium">
                    Fecha de Nacimiento <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="fechaNacimiento"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleInputChange}
                      required
                      placeholder="dd/mm/aaaa"
                      maxLength={10}
                      className={`border-[#f0d0b0] focus:border-[#d4a373] ${
                        formErrors.fechaNacimiento ? "border-red-300" : ""
                      }`}
                      aria-invalid={!!formErrors.fechaNacimiento}
                      aria-describedby={formErrors.fechaNacimiento ? "error-fechaNacimiento" : undefined}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <CalendarIcon className="h-4 w-4" />
                    </div>
                  </div>
                  {formErrors.fechaNacimiento ? (
                    <p id="error-fechaNacimiento" className="text-xs text-red-500 mt-1">
                      {formErrors.fechaNacimiento}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Formato: dd/mm/aaaa (ejemplo: 01/05/1990)</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingrese su email"
                    className={`border-[#f0d0b0] focus:border-[#d4a373] ${formErrors.email ? "border-red-300" : ""}`}
                    aria-invalid={!!formErrors.email}
                    aria-describedby={formErrors.email ? "error-email" : undefined}
                    autoComplete="email"
                  />
                  {formErrors.email && (
                    <p id="error-email" className="text-xs text-red-500 mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-sm font-medium">
                    Teléfono <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingrese su teléfono (solo números)"
                    inputMode="numeric"
                    className={`border-[#f0d0b0] focus:border-[#d4a373] ${formErrors.telefono ? "border-red-300" : ""}`}
                    aria-invalid={!!formErrors.telefono}
                    aria-describedby={formErrors.telefono ? "error-telefono" : undefined}
                    autoComplete="tel"
                  />
                  {formErrors.telefono && (
                    <p id="error-telefono" className="text-xs text-red-500 mt-1">
                      {formErrors.telefono}
                    </p>
                  )}
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="border-[#3d0d04] text-[#3d0d04]"
                  >
                    Volver
                  </Button>
                  <Button type="submit" className="bg-[#8B4240] hover:bg-[#7A3A38]" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      "Confirmar Turno"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {turnoConfirmado && (
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200 mt-4 shadow-lg max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-green-800 font-medium text-xl">¡Turno confirmado!</p>
          <p className="text-sm text-green-700 mt-3">
            {formData.nombreCompleto}, tu turno para el {format(date!, "d 'de' MMMM", { locale: es })} de {selectedTime}{" "}
            ha sido reservado.
          </p>
          <p className="text-xs text-green-600 mt-2">Te enviaremos un recordatorio a {formData.email}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={resetForm}
            className="mt-5 text-green-700 border-green-300 hover:bg-green-50"
          >
            Reservar otro turno
          </Button>
        </div>
      )}
    </div>
  )
}
