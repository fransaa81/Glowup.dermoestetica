"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
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
import { useToast } from "@/components/ui/use-toast"
import { Check, Save, ChevronLeft, ChevronRight, CalendarIcon, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ConfigurarHorariosProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConfigurarHorarios({ open, onOpenChange }: ConfigurarHorariosProps) {
  const { toast } = useToast()
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [configuracionHorarios, setConfiguracionHorarios] = useState<any>({
    horarios: {},
    excepciones: {},
  })
  const [fechasHabilitadas, setFechasHabilitadas] = useState<string[]>([])
  const [cambiosSinGuardar, setCambiosSinGuardar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [calendarDays, setCalendarDays] = useState<Date[]>([])
  const [activeTab, setActiveTab] = useState("calendario")
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<string | null>(null)
  const [plantillas, setPlantillas] = useState<{ [key: string]: any }>({})
  const [nuevaPlantilla, setNuevaPlantilla] = useState("")

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

  // Cargar configuración al abrir el diálogo
  useEffect(() => {
    if (open) {
      setIsLoading(true)
      try {
        // Cargar plantillas guardadas
        const plantillasGuardadas = JSON.parse(localStorage.getItem("plantillasHorarios") || "{}")
        setPlantillas(plantillasGuardadas)

        // Cargar configuración de horarios
        const configuracionGuardada = JSON.parse(localStorage.getItem("configuracionHorarios") || "{}")

        // Si no hay configuración guardada, crear una con todos los horarios habilitados por defecto
        // pero sin fechas habilitadas (todas bloqueadas por defecto)
        if (!configuracionGuardada.horarios) {
          const horariosIniciales: { [key: string]: boolean } = {}
          HORARIOS_PREDETERMINADOS.forEach((horario) => {
            horariosIniciales[horario] = true
          })

          setConfiguracionHorarios({
            horarios: horariosIniciales,
            excepciones: {},
          })
        } else {
          // Asegurarse de que exista el campo excepciones
          if (!configuracionGuardada.excepciones) {
            configuracionGuardada.excepciones = {}
          }
          setConfiguracionHorarios(configuracionGuardada)

          // Actualizar listas de fechas habilitadas
          const habilitadas = Object.keys(configuracionGuardada.excepciones).filter(
            (fecha) => !configuracionGuardada.excepciones[fecha].bloqueado,
          )

          setFechasHabilitadas(habilitadas)
        }
      } catch (error) {
        console.error("Error al cargar configuración de horarios:", error)

        // En caso de error, inicializar con valores predeterminados
        const horariosIniciales: { [key: string]: boolean } = {}
        HORARIOS_PREDETERMINADOS.forEach((horario) => {
          horariosIniciales[horario] = true
        })

        setConfiguracionHorarios({
          horarios: horariosIniciales,
          excepciones: {},
        })
      } finally {
        setIsLoading(false)
      }

      // Resetear estado
      setCambiosSinGuardar(false)
      setSelectedDates([])
    }
  }, [open])

  const handleDateSelect = (date: Date) => {
    // Si la fecha ya está seleccionada, deseleccionarla
    if (selectedDates.some((selectedDate) => isSameDay(selectedDate, date))) {
      setSelectedDates(selectedDates.filter((selectedDate) => !isSameDay(selectedDate, date)))
    } else {
      // Si no está seleccionada, seleccionarla
      setSelectedDates([...selectedDates, date])
    }
  }

  const handleToggleHorario = (fecha: Date, horario: string) => {
    // Usar una forma más robusta de formatear la fecha
    const year = fecha.getFullYear()
    const month = String(fecha.getMonth() + 1).padStart(2, "0")
    const day = String(fecha.getDate()).padStart(2, "0")
    const fechaStr = `${year}-${month}-${day}`

    const nuevaConfiguracion = { ...configuracionHorarios }

    // Asegurarse de que exista la excepción para esta fecha
    if (!nuevaConfiguracion.excepciones[fechaStr]) {
      nuevaConfiguracion.excepciones[fechaStr] = {
        bloqueado: false,
        horarios: {},
      }
    }

    // Asegurarse de que exista el campo horarios
    if (!nuevaConfiguracion.excepciones[fechaStr].horarios) {
      nuevaConfiguracion.excepciones[fechaStr].horarios = {}
    }

    // Cambiar el estado del horario (CORREGIDO: false/undefined = habilitado, true = deshabilitado)
    const estadoActual = nuevaConfiguracion.excepciones[fechaStr].horarios[horario]
    nuevaConfiguracion.excepciones[fechaStr].horarios[horario] = estadoActual === undefined ? true : !estadoActual

    setConfiguracionHorarios(nuevaConfiguracion)
    setCambiosSinGuardar(true)
  }

  const handleToggleAllHorarios = (fecha: Date) => {
    // Usar una forma más robusta de formatear la fecha
    const year = fecha.getFullYear()
    const month = String(fecha.getMonth() + 1).padStart(2, "0")
    const day = String(fecha.getDate()).padStart(2, "0")
    const fechaStr = `${year}-${month}-${day}`

    const nuevaConfiguracion = { ...configuracionHorarios }

    // Asegurarse de que exista la excepción para esta fecha
    if (!nuevaConfiguracion.excepciones[fechaStr]) {
      nuevaConfiguracion.excepciones[fechaStr] = {
        bloqueado: false,
        horarios: {},
      }
    }

    // Verificar si todos los horarios están habilitados
    const todosHabilitados = HORARIOS_PREDETERMINADOS.every(
      (horario) => nuevaConfiguracion.excepciones[fechaStr].horarios[horario] !== true,
    )

    // Si todos están habilitados, deshabilitarlos todos, si no, habilitarlos todos
    const nuevoEstado = todosHabilitados // true = deshabilitado, false/undefined = habilitado

    HORARIOS_PREDETERMINADOS.forEach((horario) => {
      nuevaConfiguracion.excepciones[fechaStr].horarios[horario] = nuevoEstado
    })

    setConfiguracionHorarios(nuevaConfiguracion)
    setCambiosSinGuardar(true)
  }

  const handleHabilitarFechas = () => {
    if (selectedDates.length === 0) {
      toast({
        title: "Selecciona fechas",
        description: "Debes seleccionar al menos una fecha para habilitar",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    const nuevaConfiguracion = { ...configuracionHorarios }
    const nuevasFechasHabilitadas = [...fechasHabilitadas]

    selectedDates.forEach((date) => {
      // Usar una forma más robusta de formatear la fecha
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      const fechaStr = `${year}-${month}-${day}`

      // Crear excepción para esta fecha si no existe
      if (!nuevaConfiguracion.excepciones[fechaStr]) {
        // Inicializar con todos los horarios habilitados (sin marcar)
        const horariosIniciales: { [key: string]: boolean } = {}

        nuevaConfiguracion.excepciones[fechaStr] = {
          bloqueado: false,
          horarios: horariosIniciales,
        }
      } else {
        // Si ya existe, asegurarse de que no esté bloqueada
        nuevaConfiguracion.excepciones[fechaStr].bloqueado = false
      }

      // Actualizar lista de fechas habilitadas
      if (!nuevasFechasHabilitadas.includes(fechaStr)) {
        nuevasFechasHabilitadas.push(fechaStr)
      }
    })

    // Actualizar estado
    setConfiguracionHorarios(nuevaConfiguracion)
    setFechasHabilitadas(nuevasFechasHabilitadas)

    toast({
      title: "Fechas habilitadas",
      description: `Se han habilitado ${selectedDates.length} fechas correctamente`,
      duration: 3000,
    })

    setCambiosSinGuardar(true)
  }

  const handleDeshabilitarFechas = () => {
    if (selectedDates.length === 0) {
      toast({
        title: "Selecciona fechas",
        description: "Debes seleccionar al menos una fecha para deshabilitar",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    const nuevaConfiguracion = { ...configuracionHorarios }
    const nuevasFechasHabilitadas = [...fechasHabilitadas]

    selectedDates.forEach((date) => {
      // Usar una forma más robusta de formatear la fecha
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      const fechaStr = `${year}-${month}-${day}`

      // Eliminar la excepción para esta fecha si existe
      if (nuevaConfiguracion.excepciones[fechaStr]) {
        delete nuevaConfiguracion.excepciones[fechaStr]
      }

      // Actualizar lista de fechas habilitadas
      const index = nuevasFechasHabilitadas.indexOf(fechaStr)
      if (index !== -1) {
        nuevasFechasHabilitadas.splice(index, 1)
      }
    })

    // Actualizar estado
    setConfiguracionHorarios(nuevaConfiguracion)
    setFechasHabilitadas(nuevasFechasHabilitadas)

    toast({
      title: "Fechas deshabilitadas",
      description: `Se han deshabilitado ${selectedDates.length} fechas correctamente`,
      duration: 3000,
    })

    setCambiosSinGuardar(true)
  }

  const handleSave = () => {
    setIsLoading(true)
    try {
      localStorage.setItem("configuracionHorarios", JSON.stringify(configuracionHorarios))

      toast({
        title: "Configuración guardada",
        description: "Los horarios han sido configurados correctamente",
        duration: 3000,
      })

      // Disparar evento para que otros componentes se actualicen
      window.dispatchEvent(new Event("storage"))

      setCambiosSinGuardar(false)
      // Limpiar selección de fechas después de guardar
      setSelectedDates([])
    } catch (error) {
      console.error("Error al guardar configuración:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la configuración",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuardarPlantilla = () => {
    if (!nuevaPlantilla.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Debes ingresar un nombre para la plantilla",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    try {
      // Guardar la configuración actual como plantilla
      const nuevasPlantillas = {
        ...plantillas,
        [nuevaPlantilla]: {
          ...configuracionHorarios,
          fechaCreacion: new Date().toISOString(),
        },
      }

      localStorage.setItem("plantillasHorarios", JSON.stringify(nuevasPlantillas))
      setPlantillas(nuevasPlantillas)
      setNuevaPlantilla("")

      toast({
        title: "Plantilla guardada",
        description: `La plantilla "${nuevaPlantilla}" ha sido guardada correctamente`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error al guardar plantilla:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la plantilla",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleCargarPlantilla = () => {
    if (!plantillaSeleccionada) {
      toast({
        title: "Selecciona una plantilla",
        description: "Debes seleccionar una plantilla para cargarla",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    try {
      const plantillaElegida = plantillas[plantillaSeleccionada]

      if (cambiosSinGuardar) {
        if (!confirm("Tienes cambios sin guardar. ¿Estás seguro de que quieres cargar esta plantilla?")) {
          return
        }
      }

      setConfiguracionHorarios(plantillaElegida)

      // Actualizar listas de fechas habilitadas
      const habilitadas = Object.keys(plantillaElegida.excepciones).filter(
        (fecha) => !plantillaElegida.excepciones[fecha].bloqueado,
      )

      setFechasHabilitadas(habilitadas)
      setCambiosSinGuardar(true)

      toast({
        title: "Plantilla cargada",
        description: `La plantilla "${plantillaSeleccionada}" ha sido cargada correctamente`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error al cargar plantilla:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar la plantilla",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const isHorarioEnabled = (fecha: Date, horario: string) => {
    // Usar una forma más robusta de formatear la fecha
    const year = fecha.getFullYear()
    const month = String(fecha.getMonth() + 1).padStart(2, "0")
    const day = String(fecha.getDate()).padStart(2, "0")
    const fechaStr = `${year}-${month}-${day}`

    const excepcion = configuracionHorarios.excepciones[fechaStr]

    if (!excepcion || excepcion.bloqueado) return false
    if (!excepcion.horarios) return true

    // CORREGIDO: false/undefined = habilitado, true = deshabilitado
    return excepcion.horarios[horario] !== true
  }

  const isFechaHabilitada = (fecha: Date) => {
    // Usar una forma más robusta de formatear la fecha
    const year = fecha.getFullYear()
    const month = String(fecha.getMonth() + 1).padStart(2, "0")
    const day = String(fecha.getDate()).padStart(2, "0")
    const fechaStr = `${year}-${month}-${day}`

    const excepcion = configuracionHorarios.excepciones[fechaStr]

    return excepcion && !excepcion.bloqueado
  }

  const getSelectedDate = () => {
    return selectedDates.length === 1 ? selectedDates[0] : null
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handlePrevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1))
  }

  // Contar horarios habilitados para una fecha
  const countHorariosHabilitados = (fecha: Date) => {
    if (!isFechaHabilitada(fecha)) return 0

    return HORARIOS_PREDETERMINADOS.filter((horario) => isHorarioEnabled(fecha, horario)).length
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
            const isSelected = selectedDates.some((selectedDate) => isSameDay(selectedDate, day))
            const isAvailable = isFechaHabilitada(day)
            const disponibilidad = isAvailable ? countHorariosHabilitados(day) : 0

            // Determinar clases CSS basadas en el estado del día
            let dayClasses = "relative flex items-center justify-center h-9 w-9 rounded-full text-sm cursor-pointer "

            if (isSelected) {
              dayClasses += "bg-[#8B4240] text-white font-medium "
            } else if (isAvailable) {
              dayClasses += "bg-[#f9e5d0] text-black font-medium hover:bg-[#f0d0b0] "
            } else if (isToday) {
              dayClasses += "border border-[#8B4240] text-gray-400 hover:bg-gray-100 "
            } else {
              dayClasses += "text-gray-400 hover:bg-gray-100 "
            }

            return (
              <div key={`day-${index}`} className="text-center relative">
                <button
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={dayClasses}
                  aria-label={format(day, "d 'de' MMMM", { locale: es })}
                  aria-selected={isSelected}
                >
                  {format(day, "d")}
                </button>

                {/* Indicador de disponibilidad */}
                {disponibilidad > 0 && (
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
                        <p className="text-xs">{disponibilidad} horarios habilitados</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen && cambiosSinGuardar) {
          if (confirm("Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar sin guardar?")) {
            onOpenChange(false)
          }
        } else {
          onOpenChange(newOpen)
        }
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#8B4240] flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Configurar Horarios Disponibles
          </DialogTitle>
          <DialogDescription>
            Selecciona fechas para habilitarlas o deshabilitarlas, y configura los horarios disponibles.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B4240]"></div>
              <p className="text-sm text-muted-foreground">Cargando configuración...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-[#8B4240]" />
                    Selecciona fechas
                  </CardTitle>
                  <CardDescription>Selecciona una o varias fechas para habilitar o deshabilitar</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderCalendar()}

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleHabilitarFechas}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      disabled={selectedDates.length === 0}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Habilitar {selectedDates.length} {selectedDates.length === 1 ? "fecha" : "fechas"}
                    </Button>
                    <Button
                      onClick={handleDeshabilitarFechas}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                      disabled={selectedDates.length === 0}
                    >
                      Deshabilitar {selectedDates.length} {selectedDates.length === 1 ? "fecha" : "fechas"}
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground mt-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#f9e5d0]"></div>
                      <span>Fechas habilitadas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#8B4240]"></div>
                      <span>Fechas seleccionadas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-100"></div>
                      <span>Fechas no habilitadas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {getSelectedDate() ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#8B4240]" />
                      Configuración de horarios
                    </CardTitle>
                    <CardDescription>
                      {format(getSelectedDate()!, "EEEE d 'de' MMMM yyyy", { locale: es })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isFechaHabilitada(getSelectedDate()!) ? (
                      <div className="p-4 bg-gray-50 rounded-md border text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <p>Esta fecha no está habilitada. Habilítala primero para configurar sus horarios.</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Horarios disponibles:</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleAllHorarios(getSelectedDate()!)}
                            className="text-xs"
                          >
                            {HORARIOS_PREDETERMINADOS.every((horario) => isHorarioEnabled(getSelectedDate()!, horario))
                              ? "Deshabilitar todos"
                              : "Habilitar todos"}
                          </Button>
                        </div>

                        <div className="space-y-1 border rounded-md p-3 bg-white">
                          {HORARIOS_PREDETERMINADOS.map((horario) => (
                            <div
                              key={horario}
                              className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                                isHorarioEnabled(getSelectedDate()!, horario) ? "hover:bg-green-50" : "hover:bg-red-50"
                              }`}
                            >
                              <Checkbox
                                id={`horario-${horario}`}
                                checked={!isHorarioEnabled(getSelectedDate()!, horario)} // CORREGIDO: Invertir el estado
                                onCheckedChange={() => handleToggleHorario(getSelectedDate()!, horario)}
                                className="text-[#8B4240] border-[#d4a373] data-[state=checked]:bg-[#8B4240] data-[state=checked]:border-[#8B4240]"
                              />
                              <Label htmlFor={`horario-${horario}`} className="flex-1 cursor-pointer">
                                {horario}
                              </Label>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  isHorarioEnabled(getSelectedDate()!, horario)
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }`}
                              >
                                {isHorarioEnabled(getSelectedDate()!, horario) ? "Habilitado" : "Deshabilitado"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Marca la casilla para deshabilitar un horario. Deja la casilla vacía para habilitarlo.
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ) : selectedDates.length > 1 ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Múltiples fechas seleccionadas</CardTitle>
                    <CardDescription>Has seleccionado {selectedDates.length} fechas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center space-y-3 py-4">
                      <div className="bg-[#f9e5d0]/30 p-3 rounded-md text-sm">
                        <p>
                          Usa los botones "Habilitar" o "Deshabilitar" para configurar todas las fechas seleccionadas a
                          la vez.
                        </p>
                        <p className="mt-2">Para configurar horarios específicos, selecciona solo una fecha.</p>
                      </div>

                      <div className="flex gap-2 w-full mt-2">
                        <Button
                          onClick={handleHabilitarFechas}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Habilitar {selectedDates.length} fechas
                        </Button>
                        <Button
                          onClick={handleDeshabilitarFechas}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                        >
                          Deshabilitar {selectedDates.length} fechas
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Configuración de horarios</CardTitle>
                    <CardDescription>Selecciona una fecha para configurar sus horarios</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-32">
                      <p className="text-muted-foreground text-center">
                        Selecciona una fecha en el calendario para configurar sus horarios disponibles
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="bg-[#f9e5d0]/30 p-3 rounded-md text-sm">
                <p className="font-medium mb-1">Instrucciones:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Selecciona una o varias fechas en el calendario</li>
                  <li>Usa los botones "Habilitar" o "Deshabilitar" para activar o desactivar las fechas</li>
                  <li>Para configurar horarios específicos, selecciona una sola fecha habilitada</li>
                  <li>Marca o desmarca las casillas para habilitar o deshabilitar horarios</li>
                  <li>Haz clic en "Guardar cambios" cuando termines</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {cambiosSinGuardar && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center justify-between">
            <p className="text-amber-800 text-sm">Tienes cambios sin guardar.</p>
            <Button
              onClick={handleSave}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        )}

        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            onClick={() => {
              if (cambiosSinGuardar) {
                if (confirm("Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar sin guardar?")) {
                  onOpenChange(false)
                }
              } else {
                onOpenChange(false)
              }
            }}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
