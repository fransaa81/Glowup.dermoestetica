"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, Trash2, Calendar, Printer, FileDown, Eye } from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { useToast } from "@/components/ui/use-toast"
import { ConfigurarHorarios } from "./configurar-horarios"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EnviarRecordatorios } from "./enviar-recordatorios"

// First, update the import statements at the top of the file
// Replace:
// \`\`\`
// import jsPDF from "jspdf"
// import autoTable from "jspdf-autotable"
// \`\`\`

// With:
// \`\`\`
import jsPDF from "jspdf"
// @ts-ignore
import autoTable from "jspdf-autotable"
// \`\`\`

interface Turno {
  id: string
  fecha: string
  horario: string
  nombre: string
  apellido: string
  nombreCompleto?: string
  dni?: string
  fechaNacimiento?: string
  email: string
  telefono?: string
  fechaCreacion: string
}

export default function AdminTurnosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [loading, setLoading] = useState(true)
  const [configurarHorariosOpen, setConfigurarHorariosOpen] = useState(false)
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Verificar autenticación
    const isAuthenticated = sessionStorage.getItem("authenticated") === "true"
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Cargar turnos
    const cargarTurnos = () => {
      try {
        const turnosGuardados = JSON.parse(localStorage.getItem("turnosReservados") || "[]")

        // Ordenar por fecha y horario
        const turnosOrdenados = turnosGuardados.sort((a: Turno, b: Turno) => {
          // Primero ordenar por fecha
          const fechaComparacion = a.fecha.localeCompare(b.fecha)
          if (fechaComparacion !== 0) return fechaComparacion

          // Si la fecha es igual, ordenar por horario
          return a.horario.localeCompare(b.horario)
        })

        setTurnos(turnosOrdenados)
      } catch (error) {
        console.error("Error al cargar turnos:", error)
        setTurnos([])
      }
      setLoading(false)
    }

    cargarTurnos()

    // Actualizar si hay cambios en localStorage
    window.addEventListener("storage", (e) => {
      if (e.key === "turnosReservados") {
        cargarTurnos()
      }
    })
  }, [router])

  const handleDeleteTurno = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este turno?")) {
      try {
        const turnosActualizados = turnos.filter((turno) => turno.id !== id)
        localStorage.setItem("turnosReservados", JSON.stringify(turnosActualizados))
        setTurnos(turnosActualizados)

        toast({
          title: "Turno eliminado",
          description: "El turno ha sido eliminado correctamente",
          duration: 2000,
        })
      } catch (error) {
        console.error("Error al eliminar turno:", error)
        toast({
          title: "Error",
          description: "Ocurrió un error al eliminar el turno",
          variant: "destructive",
          duration: 2000,
        })
      }
    }
  }

  const handleViewTurno = (turno: Turno) => {
    setSelectedTurno(turno)
    setDetailsDialogOpen(true)
  }

  const formatearFecha = (fechaStr: string) => {
    try {
      const fecha = parseISO(fechaStr)
      return format(fecha, "dd/MM/yyyy", { locale: es })
    } catch (error) {
      return fechaStr
    }
  }

  // Agregar esta función después de la función exportarPDF existente

  const exportarTurnoPDF = (turno: Turno) => {
    try {
      // Create a new document
      const doc = new jsPDF()

      // Remove this code from exportarTurnoPDF:
      // \`\`\`
      // Add autoTable to jsPDF prototype if needed
      // if (typeof doc.autoTable !== "function") {
      //   // @ts-ignore
      //   autoTable(doc)
      // }
      // \`\`\`

      // Encabezado con logo (simulado con texto)
      doc.setFontSize(18)
      doc.setTextColor(139, 66, 64)
      doc.text("Glow up", 14, 20)

      doc.setFontSize(12)
      doc.text("Estética Cosmiátrica", 14, 28)

      // Título
      doc.setFontSize(16)
      doc.text(`Detalles del Turno`, 105, 40, { align: "center" })

      // Información del turno
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)

      // Datos del turno
      const nombreCompleto = turno.nombreCompleto || `${turno.nombre} ${turno.apellido}`

      doc.setFontSize(11)
      doc.text("Fecha y hora del turno:", 14, 55)
      doc.setFont("helvetica", "bold")
      doc.text(`${formatearFecha(turno.fecha)} - ${turno.horario}`, 80, 55)
      doc.setFont("helvetica", "normal")

      doc.text("Día de la semana:", 14, 65)
      doc.setFont("helvetica", "bold")
      doc.text(`${format(new Date(turno.fecha), "EEEE", { locale: es })}`, 80, 65)
      doc.setFont("helvetica", "normal")

      // Línea separadora
      doc.setDrawColor(200, 200, 200)
      doc.line(14, 75, 196, 75)

      // Datos del cliente
      doc.setFontSize(14)
      doc.text("Datos del cliente", 14, 85)

      doc.setFontSize(11)
      doc.text("Nombre y Apellido:", 14, 95)
      doc.setFont("helvetica", "bold")
      doc.text(nombreCompleto, 80, 95)
      doc.setFont("helvetica", "normal")

      doc.text("DNI:", 14, 105)
      doc.setFont("helvetica", "bold")
      doc.text(turno.dni || "-", 80, 105)
      doc.setFont("helvetica", "normal")

      doc.text("Fecha de Nacimiento:", 14, 115)
      doc.setFont("helvetica", "bold")
      doc.text(turno.fechaNacimiento ? formatearFecha(turno.fechaNacimiento) : "-", 80, 115)
      doc.setFont("helvetica", "normal")

      doc.text("Email:", 14, 125)
      doc.setFont("helvetica", "bold")
      doc.text(turno.email, 80, 125)
      doc.setFont("helvetica", "normal")

      doc.text("Teléfono:", 14, 135)
      doc.setFont("helvetica", "bold")
      doc.text(turno.telefono || "-", 80, 135)
      doc.setFont("helvetica", "normal")

      // Fecha de reserva
      doc.text("Fecha de reserva:", 14, 145)
      doc.setFont("helvetica", "bold")
      doc.text(formatearFecha(turno.fechaCreacion), 80, 145)
      doc.setFont("helvetica", "normal")

      // Pie de página
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Documento generado el ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`, 105, 270, {
        align: "center",
      })

      // Guardar el PDF
      doc.save(`Turno_${nombreCompleto.replace(/\s/g, "_")}.pdf`)

      toast({
        title: "PDF generado",
        description: "El detalle del turno ha sido exportado correctamente",
        duration: 2000,
      })
    } catch (error) {
      console.error("Error al exportar turno a PDF:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al exportar el PDF",
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  // Agregar esta función después de la función imprimirTurnos existente

  // Make the printable version match the PDF export and set toast duration to 2 seconds

  // Update the imprimirTurnoIndividual function to match the PDF export format
  const imprimirTurnoIndividual = (turno: Turno) => {
    try {
      const ventanaImpresion = window.open("", "_blank")
      if (!ventanaImpresion) {
        throw new Error("No se pudo abrir la ventana de impresión")
      }

      const nombreCompleto = turno.nombreCompleto || `${turno.nombre} ${turno.apellido}`

      // Estilos para la impresión - updated to match PDF style
      const estilos = `
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          color: #000;
          line-height: 1.5;
        }
        .header { 
          margin-bottom: 20px; 
        }
        .logo-text { 
          color: #8B4240; 
          font-size: 24px; 
          font-weight: bold; 
          margin: 0; 
        }
        .logo-subtext { 
          color: #8B4240; 
          font-size: 14px; 
          margin: 0; 
        }
        h1 { 
          color: #8B4240; 
          text-align: center; 
          margin: 30px 0; 
          font-size: 22px;
        }
        .section { 
          margin-bottom: 20px; 
        }
        .info-row { 
          display: flex; 
          margin-bottom: 10px; 
        }
        .info-label { 
          width: 180px; 
          color: #666; 
          font-weight: normal; 
        }
        .info-value { 
          font-weight: bold; 
        }
        .separator {
          border-top: 1px solid #ddd;
          margin: 15px 0;
        }
        .footer { 
          margin-top: 50px; 
          text-align: center; 
          color: #666; 
          font-size: 12px; 
        }
        @media print {
          button { display: none; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    `

      // Contenido HTML - updated to match PDF layout
      const contenido = `
      <html>
      <head>
        <title>Turno de ${nombreCompleto} - Glow up</title>
        ${estilos}
      </head>
      <body>
        <div class="header">
          <p class="logo-text">Glow up</p>
          <p class="logo-subtext">Estética Cosmiátrica</p>
        </div>
        
        <h1>Detalles del Turno</h1>
        
        <div class="info-row">
          <div class="info-label">Fecha y hora del turno:</div>
          <div class="info-value">${formatearFecha(turno.fecha)} - ${turno.horario}</div>
        </div>
        
        <div class="info-row">
          <div class="info-label">Día de la semana:</div>
          <div class="info-value">${format(new Date(turno.fecha), "EEEE", { locale: es })}</div>
        </div>
        
        <div class="separator"></div>
        
        <h2 style="font-size: 18px; color: #333;">Datos del cliente</h2>
        
        <div class="info-row">
          <div class="info-label">Nombre y Apellido:</div>
          <div class="info-value">${nombreCompleto}</div>
        </div>
        
        <div class="info-row">
          <div class="info-label">DNI:</div>
          <div class="info-value">${turno.dni || "-"}</div>
        </div>
        
        <div class="info-row">
          <div class="info-label">Fecha de Nacimiento:</div>
          <div class="info-value">${turno.fechaNacimiento ? formatearFecha(turno.fechaNacimiento) : "-"}</div>
        </div>
        
        <div class="info-row">
          <div class="info-label">Email:</div>
          <div class="info-value">${turno.email}</div>
        </div>
        
        <div class="info-row">
          <div class="info-label">Teléfono:</div>
          <div class="info-value">${turno.telefono || "-"}</div>
        </div>
        
        <div class="info-row">
          <div class="info-label">Fecha de reserva:</div>
          <div class="info-value">${formatearFecha(turno.fechaCreacion)}</div>
        </div>
        
        <div class="footer">
          Documento generado el ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()">Imprimir</button>
        </div>
      </body>
      </html>
    `

      ventanaImpresion.document.write(contenido)
      ventanaImpresion.document.close()

      toast({
        title: "Vista de impresión generada",
        description: "Se ha abierto una nueva ventana con la vista de impresión",
        duration: 2000,
      })
    } catch (error) {
      console.error("Error al generar vista de impresión:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al generar la vista de impresión",
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  // Mejorar la función exportarPDF existente para asegurar que funcione correctamente
  // Reemplazar la función exportarPDF existente with this versión mejorada

  const exportarPDF = () => {
    try {
      // Create a new document
      const doc = new jsPDF()

      // Título
      doc.setFontSize(18)
      doc.setTextColor(139, 66, 64)
      doc.text("Turnos Reservados - Glow up", 14, 20)

      // Fecha de generación
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      doc.text(`Generado el: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`, 14, 30)

      // Tabla de turnos
      const tableColumn = ["Fecha", "Horario", "Nombre y Apellido", "DNI", "Email", "Teléfono"]
      const tableRows = turnos.map((turno) => [
        formatearFecha(turno.fecha),
        turno.horario,
        turno.nombreCompleto || `${turno.nombre} ${turno.apellido}`,
        turno.dni || "-",
        turno.email,
        turno.telefono || "-",
      ])

      // Use a simpler configuration for autoTable
      // @ts-ignore
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [139, 66, 64], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      })

      doc.save("turnos-glow-up.pdf")

      toast({
        title: "PDF generado",
        description: "El listado de turnos ha sido exportado correctamente",
        duration: 2000,
      })
    } catch (error) {
      console.error("Error al exportar PDF:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al exportar el PDF",
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  const imprimirTurnos = () => {
    window.print()
  }

  // Ahora, modificar el diálogo de detalles para incluir los botones de exportar e imprimir
  // Reemplazar el DialogFooter existente en el diálogo de detalles with this versión actualizada

  if (loading) {
    return <div className="container py-10 text-center">Cargando...</div>
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/login">
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
            <h1 className="text-3xl font-bold text-[#8B4240] ml-2">Administración de Turnos</h1>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-[#FBE8E0]/30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl text-[#8B4240]">Turnos Reservados</CardTitle>
              <CardDescription>Gestiona los turnos reservados por los clientes</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="bg-white hover:bg-gray-100" onClick={imprimirTurnos}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
              <Button variant="outline" className="bg-white hover:bg-gray-100" onClick={exportarPDF}>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
              <Button className="bg-[#8B4240] hover:bg-[#7A3A38]" onClick={() => setConfigurarHorariosOpen(true)}>
                <Calendar className="mr-2 h-4 w-4" />
                Configurar Horarios
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto" ref={tableRef}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Nombre y Apellido</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Fecha Nac.</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Fecha de Reserva</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {turnos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No hay turnos reservados
                    </TableCell>
                  </TableRow>
                ) : (
                  turnos.map((turno) => (
                    <TableRow key={turno.id}>
                      <TableCell>
                        {format(new Date(turno.fecha), "dd/MM/yyyy", { locale: es })}
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(turno.fecha), "EEEE", { locale: es })}
                        </div>
                      </TableCell>
                      <TableCell>{turno.horario}</TableCell>
                      <TableCell className="font-medium">
                        {turno.nombreCompleto || `${turno.nombre} ${turno.apellido}`}
                      </TableCell>
                      <TableCell>{turno.dni || "-"}</TableCell>
                      <TableCell>{turno.fechaNacimiento ? formatearFecha(turno.fechaNacimiento) : "-"}</TableCell>
                      <TableCell>{turno.email}</TableCell>
                      <TableCell>{turno.telefono || "-"}</TableCell>
                      <TableCell>{formatearFecha(turno.fechaCreacion)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTurno(turno)}
                            className="text-[#8B4240]"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver detalles</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteTurno(turno.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar turno</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal para configurar horarios */}
      <ConfigurarHorarios open={configurarHorariosOpen} onOpenChange={setConfigurarHorariosOpen} />

      {/* Sección para enviar recordatorios */}
      <div className="mt-6">
        <EnviarRecordatorios />
      </div>

      {/* Diálogo para ver detalles del turno */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedTurno && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-[#8B4240]">Detalles del Turno</DialogTitle>
                <DialogDescription>
                  Reservado el {format(new Date(selectedTurno.fechaCreacion), "dd/MM/yyyy", { locale: es })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Fecha del turno</h3>
                    <p className="font-medium">{formatearFecha(selectedTurno.fecha)}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(selectedTurno.fecha), "EEEE", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Horario</h3>
                    <p className="font-medium">{selectedTurno.horario}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Datos del cliente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs text-gray-500">Nombre y Apellido</h4>
                      <p className="font-medium">
                        {selectedTurno.nombreCompleto || `${selectedTurno.nombre} ${selectedTurno.apellido}`}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs text-gray-500">DNI</h4>
                      <p className="font-medium">{selectedTurno.dni || "-"}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-gray-500">Fecha de Nacimiento</h4>
                      <p className="font-medium">
                        {selectedTurno.fechaNacimiento ? formatearFecha(selectedTurno.fechaNacimiento) : "-"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs text-gray-500">Email</h4>
                      <p className="font-medium">{selectedTurno.email}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-gray-500">Teléfono</h4>
                      <p className="font-medium">{selectedTurno.telefono || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-initial"
                    onClick={() => selectedTurno && imprimirTurnoIndividual(selectedTurno)}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-initial"
                    onClick={() => selectedTurno && exportarTurnoPDF(selectedTurno)}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar PDF
                  </Button>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-initial text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={() => {
                      if (confirm("¿Estás seguro de que deseas eliminar este turno?")) {
                        handleDeleteTurno(selectedTurno.id)
                        setDetailsDialogOpen(false)
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar turno
                  </Button>
                  <Button className="flex-1 sm:flex-initial" onClick={() => setDetailsDialogOpen(false)}>
                    Cerrar
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
