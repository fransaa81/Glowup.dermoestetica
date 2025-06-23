import { type NextRequest, NextResponse } from "next/server"
import { enviarRecordatorioTurno } from "@/app/actions/email-actions"

export async function GET(request: NextRequest) {
  try {
    // Obtener todos los turnos guardados
    const turnosGuardados = JSON.parse(localStorage.getItem("turnosReservados") || "[]")

    // Fecha actual
    const ahora = new Date()

    // Filtrar turnos que son mañana
    const turnosMañana = turnosGuardados.filter((turno: any) => {
      const fechaTurno = new Date(turno.fecha)
      const fechaMañana = new Date(ahora)
      fechaMañana.setDate(fechaMañana.getDate() + 1)

      return (
        fechaTurno.getDate() === fechaMañana.getDate() &&
        fechaTurno.getMonth() === fechaMañana.getMonth() &&
        fechaTurno.getFullYear() === fechaMañana.getFullYear()
      )
    })

    // Enviar recordatorios para los turnos de mañana
    const resultados = await Promise.all(
      turnosMañana.map(async (turno: any) => {
        const resultado = await enviarRecordatorioTurno(turno)
        return {
          turnoId: turno.id,
          resultado,
        }
      }),
    )

    return NextResponse.json({
      success: true,
      turnosEnviados: resultados.length,
      resultados,
    })
  } catch (error) {
    console.error("Error al procesar recordatorios:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
