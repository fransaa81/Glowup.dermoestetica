"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, Printer, FileDown, Trash2, Eye } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useToast } from "@/components/ui/use-toast"
import jsPDF from "jspdf"
import "jspdf-autotable"

interface Consulta {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  fechaCreacion: string
  estado: string
}

export default function ConsultasPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null)
  const consultaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Verificar autenticación
    const isAuthenticated = sessionStorage.getItem("authenticated") === "true"
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Cargar consultas
    const cargarConsultas = () => {
      try {
        const consultasGuardadas = JSON.parse(localStorage.getItem("consultasTurnos") || "[]")

        // Ordenar por fecha de creación (más recientes primero)
        const consultasOrdenadas = consultasGuardadas.sort((a: Consulta, b: Consulta) => {
          return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        })

        setConsultas(consultasOrdenadas)
      } catch (error) {
        console.error("Error al cargar consultas:", error)
        setConsultas([])
      }
      setLoading(false)
    }

    cargarConsultas()

    // Actualizar si hay cambios en localStorage
    window.addEventListener("storage", (e) => {
      if (e.key === "consultasTurnos") {
        cargarConsultas()
      }
    })
  }, [router])

  const handleDeleteConsulta = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta consulta?")) {
      try {
        const consultasActualizadas = consultas.filter((consulta) => consulta.id !== id)
        localStorage.setItem("consultasTurnos", JSON.stringify(consultasActualizadas))
        setConsultas(consultasActualizadas)

        toast({
          title: "Consulta eliminada",
          description: "La consulta ha sido eliminada correctamente",
          duration: 2000,
        })
      } catch (error) {
        console.error("Error al eliminar consulta:", error)
        toast({
          title: "Error",
          description: "Ocurrió un error al eliminar la consulta",
          variant: "destructive",
          duration: 2000,
        })
      }
    }
  }

  const handleViewConsulta = (consulta: Consulta) => {
    setSelectedConsulta(consulta)
  }

  const handleExportPDF = async () => {
    if (!selectedConsulta) return

    try {
      // Crear un nuevo documento PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Agregar logo (como texto por simplicidad)
      pdf.setFontSize(20)
      pdf.setTextColor(139, 66, 64) // #8B4240
      pdf.text("Glow up", pdf.internal.pageSize.getWidth() / 2, 20, { align: "center" })

      pdf.setFontSize(12)
      pdf.text("Estética Cosmiátrica", pdf.internal.pageSize.getWidth() / 2, 27, { align: "center" })

      pdf.setFontSize(14)
      pdf.text("Ficha de Consulta", pdf.internal.pageSize.getWidth() / 2, 40, { align: "center" })

      // Línea separadora
      pdf.setDrawColor(200, 200, 200)
      pdf.line(20, 45, pdf.internal.pageSize.getWidth() - 20, 45)

      // Información de la consulta
      pdf.setFontSize(12)
      pdf.setTextColor(0, 0, 0)

      const startY = 55
      const lineHeight = 7

      pdf.setFontSize(11)
      pdf.setTextColor(100, 100, 100)
      pdf.text("Fecha de recepción:", 20, startY)
      pdf.setTextColor(0, 0, 0)
      pdf.text(format(new Date(selectedConsulta.fechaCreacion), "dd/MM/yyyy", { locale: es }), 70, startY)

      pdf.setTextColor(100, 100, 100)
      pdf.text("Nombre:", 20, startY + lineHeight)
      pdf.setTextColor(0, 0, 0)
      pdf.text(selectedConsulta.name, 70, startY + lineHeight)

      pdf.setTextColor(100, 100, 100)
      pdf.text("Email:", 20, startY + lineHeight * 2)
      pdf.setTextColor(0, 0, 0)
      pdf.text(selectedConsulta.email, 70, startY + lineHeight * 2)

      if (selectedConsulta.phone) {
        pdf.setTextColor(100, 100, 100)
        pdf.text("Teléfono:", 20, startY + lineHeight * 3)
        pdf.setTextColor(0, 0, 0)
        pdf.text(selectedConsulta.phone, 70, startY + lineHeight * 3)
      }

      pdf.setTextColor(100, 100, 100)
      pdf.text("Estado:", 20, startY + lineHeight * 4)
      pdf.setTextColor(0, 0, 0)
      pdf.text(selectedConsulta.estado, 70, startY + lineHeight * 4)

      // Mensaje (con soporte para texto largo y múltiples líneas)
      pdf.setTextColor(100, 100, 100)
      pdf.text("Mensaje:", 20, startY + lineHeight * 5)

      // Crear un rectángulo gris claro para el fondo del mensaje
      pdf.setFillColor(245, 245, 245)
      pdf.rect(20, startY + lineHeight * 5.5, pdf.internal.pageSize.getWidth() - 40, 50, "F")

      // Dividir el mensaje en múltiples líneas si es necesario
      pdf.setTextColor(0, 0, 0)
      const splitMessage = pdf.splitTextToSize(selectedConsulta.message, pdf.internal.pageSize.getWidth() - 50)
      pdf.text(splitMessage, 25, startY + lineHeight * 6)

      // Pie de página
      const footerY = pdf.internal.pageSize.getHeight() - 20
      pdf.setFontSize(10)
      pdf.setTextColor(150, 150, 150)
      pdf.text("Glow up - Estética Cosmiátrica", pdf.internal.pageSize.getWidth() / 2, footerY, { align: "center" })
      pdf.text("Maestro Angel D' Elía 0000, San Miguel, GBA", pdf.internal.pageSize.getWidth() / 2, footerY + 5, {
        align: "center",
      })

      // Guardar el PDF
      pdf.save(`Consulta_${selectedConsulta.name.replace(/\s/g, "_")}.pdf`)

      toast({
        title: "PDF generado",
        description: "El PDF se ha generado correctamente",
        duration: 2000,
      })
    } catch (error) {
      console.error("Error al generar PDF:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al generar el PDF",
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  const handlePrint = () => {
    if (!selectedConsulta) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Por favor, permite las ventanas emergentes para imprimir")
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Consulta de ${selectedConsulta.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 15px;
              border-bottom: 1px solid #ddd;
            }
            .logo-text {
              font-size: 24px;
              font-weight: bold;
              color: #8B4240;
              margin-bottom: 5px;
            }
            .logo-subtext {
              font-size: 14px;
              color: #8B4240;
              margin-bottom: 15px;
            }
            .title {
              font-size: 18px;
              margin-top: 10px;
            }
            .content {
              margin: 20px 0;
            }
            .field {
              margin-bottom: 15px;
            }
            .field-label {
              font-size: 14px;
              color: #666;
              margin-bottom: 5px;
            }
            .field-value {
              font-size: 16px;
              padding: 5px 0;
            }
            .message-box {
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 5px;
              margin-top: 5px;
              white-space: pre-wrap;
              font-size: 14px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 15px;
              border-top: 1px solid #eee;
              text-align: center;
              font-size: 12px;
              color: #999;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-text">Glow up</div>
            <div class="logo-subtext">Estética Cosmiátrica</div>
            <div class="title">Ficha de Consulta</div>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="field-label">Fecha de recepción:</div>
              <div class="field-value">${format(new Date(selectedConsulta.fechaCreacion), "dd/MM/yyyy", { locale: es })}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Nombre:</div>
              <div class="field-value">${selectedConsulta.name}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Email:</div>
              <div class="field-value">${selectedConsulta.email}</div>
            </div>
            
            ${
              selectedConsulta.phone
                ? `
            <div class="field">
              <div class="field-label">Teléfono:</div>
              <div class="field-value">${selectedConsulta.phone}</div>
            </div>
            `
                : ""
            }
            
            <div class="field">
              <div class="field-label">Estado:</div>
              <div class="field-value">${selectedConsulta.estado}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Mensaje:</div>
              <div class="message-box">${selectedConsulta.message}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>Glow up - Estética Cosmiátrica</p>
            <p>Maestro Angel D' Elía 0000, San Miguel, GBA</p>
          </div>
          
          <script>
            setTimeout(() => {
              window.print();
              // No cerramos la ventana automáticamente para permitir múltiples impresiones
            }, 500);
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  // Función para cambiar el estado de una consulta
  const handleChangeStatus = (id: string, newStatus: string) => {
    try {
      const consultasActualizadas = consultas.map((consulta) => {
        if (consulta.id === id) {
          return { ...consulta, estado: newStatus }
        }
        return consulta
      })

      localStorage.setItem("consultasTurnos", JSON.stringify(consultasActualizadas))
      setConsultas(consultasActualizadas)

      if (selectedConsulta && selectedConsulta.id === id) {
        setSelectedConsulta({ ...selectedConsulta, estado: newStatus })
      }

      toast({
        title: "Estado actualizado",
        description: `La consulta ha sido marcada como "${newStatus}"`,
        duration: 2000,
      })
    } catch (error) {
      console.error("Error al actualizar estado:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el estado",
        variant: "destructive",
        duration: 2000,
      })
    }
  }

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
            <h1 className="text-3xl font-bold text-[#8B4240] ml-2">Consultas y Turnos</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="bg-[#FBE8E0]/30">
              <CardTitle className="text-2xl text-[#8B4240]">Consultas Recibidas</CardTitle>
              <CardDescription>Listado de todas las consultas y solicitudes de turnos</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {consultas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No hay consultas recibidas
                        </TableCell>
                      </TableRow>
                    ) : (
                      consultas.map((consulta) => (
                        <TableRow key={consulta.id}>
                          <TableCell>
                            {format(new Date(consulta.fechaCreacion), "dd/MM/yyyy", { locale: es })}
                          </TableCell>
                          <TableCell className="font-medium">{consulta.name}</TableCell>
                          <TableCell>{consulta.email}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                consulta.estado === "Pendiente"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {consulta.estado}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewConsulta(consulta)}
                                className="text-[#8B4240]"
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Ver consulta</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => handleDeleteConsulta(consulta.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Eliminar consulta</span>
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
        </div>

        <div>
          {selectedConsulta ? (
            <Card>
              <CardHeader className="bg-[#FBE8E0]/30">
                <CardTitle className="text-xl text-[#8B4240]">Detalle de Consulta</CardTitle>
                <CardDescription>
                  Recibida el {format(new Date(selectedConsulta.fechaCreacion), "dd/MM/yyyy", { locale: es })}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div ref={consultaRef} className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="flex justify-center mb-2">
                      <div className="relative w-16 h-16">
                        <Image src="/logo-transparent.png" alt="Glow up Logo" fill className="object-contain" />
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold text-[#8B4240]">Glow up</h2>
                    <p className="text-sm text-gray-500">Estética Cosmiátrica</p>
                    <p className="text-xs text-gray-400 mt-1">Ficha de Consulta</p>
                  </div>

                  <div className="space-y-3 border-t pt-3">
                    <div>
                      <p className="text-sm text-gray-500">Nombre:</p>
                      <p className="font-medium">{selectedConsulta.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email:</p>
                      <p className="font-medium">{selectedConsulta.email}</p>
                    </div>
                    {selectedConsulta.phone && (
                      <div>
                        <p className="text-sm text-gray-500">Teléfono:</p>
                        <p className="font-medium">{selectedConsulta.phone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Mensaje:</p>
                      <p className="p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
                        {selectedConsulta.message}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Estado:</p>
                        <p
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            selectedConsulta.estado === "Pendiente"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {selectedConsulta.estado}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleChangeStatus(selectedConsulta.id, "Pendiente")}
                          className={`text-yellow-600 ${selectedConsulta.estado === "Pendiente" ? "bg-yellow-50" : ""}`}
                        >
                          Pendiente
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleChangeStatus(selectedConsulta.id, "Atendido")}
                          className={`text-green-600 ${selectedConsulta.estado === "Atendido" ? "bg-green-50" : ""}`}
                        >
                          Atendido
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-xs text-gray-400 mt-6 pt-3 border-t">
                    <p>Glow up - Estética Cosmiátrica</p>
                    <p>Maestro Angel D' Elía 0000, San Miguel, GBA</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={handlePrint} className="text-[#8B4240] border-[#8B4240]">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPDF}
                    className="text-[#8B4240] border-[#8B4240]"
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                <p>Selecciona una consulta para ver los detalles</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
