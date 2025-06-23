"use server"

import { serve } from "@upstash/workflow/nextjs"
import { enviarRecordatorioTurno } from "./email-actions"

// Interfaz para los datos del turno
interface TurnoData {
  id: string
  fecha: string // formato: yyyy-MM-dd
  horario: string
  nombre: string
  apellido: string
  nombreCompleto: string
  dni: string
  fechaNacimiento: string
  email: string
  telefono: string
  fechaCreacion: string
}

// Función para programar un recordatorio 24h antes del turno
export async function programarRecordatorio(turnoData: TurnoData) {
  try {
    // Calcular la fecha del recordatorio (24h antes del turno)
    const fechaTurno = new Date(turnoData.fecha)
    const fechaRecordatorio = new Date(fechaTurno)
    fechaRecordatorio.setDate(fechaRecordatorio.getDate() - 1) // 24h antes

    // Calcular el tiempo de espera en segundos desde ahora hasta la fecha del recordatorio
    const ahora = new Date()
    const tiempoEspera = Math.max(0, Math.floor((fechaRecordatorio.getTime() - ahora.getTime()) / 1000))

    // Si la fecha del recordatorio ya pasó, no programar nada
    if (tiempoEspera <= 0) {
      console.log("La fecha del recordatorio ya pasó, no se programará")
      return { success: false, error: "La fecha del recordatorio ya pasó" }
    }

    console.log(`Programando recordatorio para ${fechaRecordatorio.toISOString()} (en ${tiempoEspera} segundos)`)

    // Programar el recordatorio usando Upstash Workflow
    const workflow = serve<TurnoData>(async (context) => {
      // Esperar hasta la fecha del recordatorio
      await context.sleep("esperar-recordatorio", tiempoEspera)

      // Enviar el recordatorio
      await context.run("enviar-recordatorio", async () => {
        return await enviarRecordatorioTurno(turnoData)
      })
    })

    // Iniciar el workflow con los datos del turno
    await workflow.POST(turnoData)

    return { success: true }
  } catch (error) {
    console.error("Error al programar recordatorio:", error)
    return { success: false, error: error }
  }
}
