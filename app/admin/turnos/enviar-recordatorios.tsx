"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { addDays, isAfter } from "date-fns"
import { Loader2, Mail, CheckCircle } from "lucide-react"
import { enviarRecordatorioTurno } from "@/app/actions/email-actions"

export function EnviarRecordatorios() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [turnosEnviados, setTurnosEnviados] = useState<string[]>([])

  const enviarRecordatoriosManuales = async () => {
    setIsLoading(true)
    try {
      // Obtener todos los turnos guardados
      const turnosGuardados = JSON.parse(localStorage.getItem("turnosReservados") || "[]")

      // Fecha actual y fecha de mañana
      const ahora = new Date()
      const mañana = addDays(ahora, 1)
      mañana.setHours(0, 0, 0, 0)

      // Filtrar turnos que son mañana o después
      const turnosFuturos = turnosGuardados.filter((turno: any) => {
        const fechaTurno = new Date(turno.fecha)
        fechaTurno.setHours(0, 0, 0, 0)
        return isAfter(fechaTurno, ahora) || fechaTurno.getTime() === mañana.getTime()
      })

      if (turnosFuturos.length === 0) {
        toast({
          title: "Sin turnos futuros",
          description: "No hay turnos futuros para enviar recordatorios",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Enviar recordatorios para los turnos futuros
      const turnosIds: string[] = []

      for (const turno of turnosFuturos) {
        await enviarRecordatorioTurno(turno)
        turnosIds.push(turno.id)

        // Pequeña pausa para no sobrecargar el servidor de correo
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      setTurnosEnviados(turnosIds)

      toast({
        title: "Recordatorios enviados",
        description: `Se han enviado ${turnosFuturos.length} recordatorios correctamente`,
      })
    } catch (error) {
      console.error("Error al enviar recordatorios:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar los recordatorios",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Mail className="h-4 w-4 text-[#8B4240]" />
          Enviar recordatorios
        </CardTitle>
        <CardDescription>Envía recordatorios manuales a todos los turnos futuros</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          Esta función enviará un correo de recordatorio a todos los clientes con turnos futuros. Normalmente, los
          recordatorios se envían automáticamente 24 horas antes del turno.
        </p>

        {turnosEnviados.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
            <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
              <CheckCircle className="h-4 w-4" />
              <span>Recordatorios enviados: {turnosEnviados.length}</span>
            </div>
            <p className="text-xs text-green-600">
              Los recordatorios han sido enviados correctamente a todos los turnos futuros.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={enviarRecordatoriosManuales}
          disabled={isLoading}
          className="w-full bg-[#8B4240] hover:bg-[#7A3A38]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando recordatorios...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Enviar recordatorios a todos los turnos futuros
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
