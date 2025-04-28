"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Printer, FileDown } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

// Actualizar la interfaz para incluir noEncontradas en alteraciones
interface Ficha {
  id: string
  nombre: string
  apellido: string
  nombreCompleto: string
  dni: string
  direccion: string
  fechaNac: string
  celular: string
  email: string
  fechaCreacion: string

  // Datos clínicos
  cardiacas?: string
  renales?: string
  circulatorias?: string
  pulmonares?: string
  digestivas?: string
  hematologicas?: string
  endocrinas?: string
  neurologicas?: string
  hipertension?: string
  alergias?: string
  piel?: string
  queloides?: string
  cicatrices?: string
  quirurgicos?: string
  convulsiones?: string
  tabaco?: string
  alcohol?: string
  embarazo?: string

  // Piel
  biotipo?: {
    normal?: boolean
    seca?: boolean
    mixta?: boolean
    grasa?: boolean
  }
  fototipo?: {
    i?: boolean
    ii?: boolean
    iii?: boolean
    iv?: boolean
  }
  alteraciones?: {
    hipercromias?: boolean
    rosacea?: boolean
    acne?: boolean
    noEncontradas?: boolean
  }
  estadoPiel?: {
    deshidratada?: boolean
    atopica?: boolean
    sensible?: boolean
    fotoenvejecida?: boolean
  }

  // Observaciones en el rostro
  lineasExpresion?: {
    suaves?: boolean
    profundas?: boolean
    arrugas?: boolean
    flaccidez?: boolean
  }
  textura?: {
    suave?: boolean
    aspera?: boolean
    oleosa?: boolean
  }

  // Diagnóstico y tratamiento
  diagnostico?: string
  presupuesto?: string
  aclaraciones?: string

  // Sesiones programadas
  sesiones?: {
    sesion1?: string
    sesion2?: string
    sesion3?: string
    sesion4?: string
    sesion5?: string
    sesion6?: string
    sesion7?: string
  }
}

export default function FichaIndividualPage() {
  const router = useRouter()
  const params = useParams()
  const [ficha, setFicha] = useState<Ficha | null>(null)
  const [loading, setLoading] = useState(true)
  const fichaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Verificar autenticación
    const isAuthenticated = sessionStorage.getItem("authenticated") === "true"
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    try {
      // Cargar la ficha específica del localStorage
      const fichasGuardadas = JSON.parse(localStorage.getItem("fichasCosmetologicas") || "[]")
      const fichaEncontrada = fichasGuardadas.find((f: Ficha) => f.id === params.id)

      if (fichaEncontrada) {
        setFicha(fichaEncontrada)
      } else {
        // Si no se encuentra la ficha, redirigir a la lista
        router.push("/fichas-guardadas")
      }
    } catch (error) {
      console.error("Error al cargar ficha:", error)
      // Si hay un error, redirigir a la lista
      router.push("/fichas-guardadas")
    }

    setLoading(false)
  }, [router, params.id])

  // Función para imprimir la ficha
  const handlePrint = () => {
    if (!fichaRef.current) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Por favor, permite las ventanas emergentes para imprimir")
      return
    }

    const documentContent = fichaRef.current.innerHTML

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ficha de ${ficha?.nombreCompleto}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .header {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #ddd;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .logo-container {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .logo-text {
              font-size: 18px;
              font-weight: bold;
              color: #8B4240;
            }
            .logo-subtext {
              font-size: 12px;
              color: #8B4240;
            }
            .title {
              font-size: 20px;
              font-weight: bold;
              color: #8B4240;
              text-align: right;
            }
            .subtitle {
              font-size: 14px;
              color: #666;
              text-align: right;
            }
            .section {
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 1px solid #eee;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #8B4240;
              margin-bottom: 10px;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
            }
            .field-label {
              font-size: 13px;
              color: #666;
            }
            .field-value {
              font-weight: 500;
            }
            .footer {
              display: flex;
              justify-content: space-between;
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #eee;
            }
            .signature-line {
              width: 250px;
              border-bottom: 1px solid #000;
              height: 40px;
            }
            .professional-info {
              text-align: right;
              font-size: 13px;
              color: #666;
            }
            .checkbox-item {
              display: flex;
              align-items: center;
              margin-bottom: 5px;
            }
            .checkbox-label {
              margin-left: 5px;
            }
            .checkbox {
              width: 12px;
              height: 12px;
              border: 1px solid #999;
              display: inline-block;
            }
            .checkbox.checked {
              background-color: #8B4240;
            }
            .radio {
              width: 14px;
              height: 14px;
              border: 1px solid #999;
              border-radius: 50%;
              display: inline-block;
              position: relative;
            }
            .radio.checked:after {
              content: '';
              width: 8px;
              height: 8px;
              background-color: #8B4240;
              border-radius: 50%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${documentContent}
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  // Función para exportar a PDF
  const handleExportPDF = async () => {
    if (!fichaRef.current) return

    // Crear un estilo temporal para la impresión
    const style = document.createElement("style")
    style.innerHTML = `
      @media print {
        .pdf-container * {
          font-size: 11px !important;
        }
        .pdf-container h3 {
          font-size: 14px !important;
        }
        .pdf-container .section {
          margin-bottom: 10px !important;
          padding-bottom: 10px !important;
        }
        .pdf-container .space-y-6 > div {
          margin-bottom: 10px !important;
        }
        .pdf-container .grid {
          gap: 8px !important;
        }
        .pdf-container .mb-4 {
          margin-bottom: 8px !important;
        }
        .pdf-container .p-8 {
          padding: 16px !important;
        }
      }
    `
    document.head.appendChild(style)

    // Agregar temporalmente la clase para el PDF
    fichaRef.current.classList.add("pdf-container")

    const canvas = await html2canvas(fichaRef.current, {
      scale: 2,
      logging: false,
      useCORS: true,
      windowHeight: fichaRef.current.scrollHeight,
      windowWidth: fichaRef.current.scrollWidth,
    })

    // Limpiar después de la captura
    fichaRef.current.classList.remove("pdf-container")
    document.head.removeChild(style)

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Calcular dimensiones para ajustar a página A4
    const imgWidth = 210 // Ancho A4 en mm
    const pageHeight = 297 // Alto A4 en mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Agregar imagen al PDF con escala adecuada
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight))
    pdf.save(`Ficha_${ficha?.nombreCompleto.replace(/\s/g, "_")}.pdf`)
  }

  // Función auxiliar para mostrar valores booleanos como "Sí" o "No"
  const renderBooleanValue = (value: boolean | undefined) => {
    if (value === undefined) return "No especificado"
    return value ? "Sí" : "No"
  }

  // Función para renderizar un checkbox visual
  const renderCheckbox = (checked: boolean | undefined) => (
    <div
      className={`inline-block w-4 h-4 border border-gray-400 rounded mr-2 ${checked ? "bg-[#8B4240]" : "bg-white"}`}
    ></div>
  )

  // Función para renderizar un radio button visual
  const renderRadio = (checked: boolean) => (
    <div className="relative inline-block w-5 h-5 border border-gray-400 rounded-full">
      {checked && <div className="absolute inset-1 rounded-full bg-[#8B4240]"></div>}
    </div>
  )

  if (loading) {
    return <div className="container py-10 text-center">Cargando...</div>
  }

  if (!ficha) {
    return <div className="container py-10 text-center">Ficha no encontrada</div>
  }

  // Modificar la sección de visualización de datos para mostrar todos los campos
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/fichas-guardadas">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver a la lista
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
            <h1 className="text-2xl font-bold text-[#8B4240] ml-2">Ficha de {ficha.nombreCompleto}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint} className="text-[#8B4240] border-[#8B4240]">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={handleExportPDF} className="text-[#8B4240] border-[#8B4240]">
            <FileDown className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Contenido de la ficha para imprimir */}
      <div ref={fichaRef} className="bg-white p-6 shadow-lg rounded-lg" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="header flex items-center justify-between mb-6 border-b pb-4">
          <div className="logo-container flex items-center gap-4">
            <div className="relative">
              <Image src="/logo-transparent.png" alt="Glow up Logo" width={70} height={70} className="object-contain" />
            </div>
            <div>
              <div className="logo-text text-xl font-semibold text-[#8B4240]">Glow up</div>
              <div className="logo-subtext text-xs text-[#8B4240]">"Centro de Estética"</div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="title text-xl font-bold text-[#8B4240]">Ficha Cosmetológica</h2>
            <p className="subtitle text-sm text-muted-foreground">
              Fecha de creación: {format(new Date(ficha.fechaCreacion), "dd/MM/yyyy", { locale: es })}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Sección: Información Personal */}
          <div className="section border-b pb-4">
            <h3 className="section-title text-lg font-semibold mb-3 text-[#8B4240]">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="field-label text-sm text-muted-foreground">Nombre:</p>
                <p className="field-value font-medium">{ficha.nombre || "No especificado"}</p>
              </div>
              <div>
                <p className="field-label text-sm text-muted-foreground">Apellido:</p>
                <p className="field-value font-medium">{ficha.apellido || "No especificado"}</p>
              </div>
              <div>
                <p className="field-label text-sm text-muted-foreground">DNI:</p>
                <p className="field-value font-medium">{ficha.dni || "No especificado"}</p>
              </div>
              <div>
                <p className="field-label text-sm text-muted-foreground">Dirección:</p>
                <p className="field-value font-medium">{ficha.direccion || "No especificada"}</p>
              </div>
              <div>
                <p className="field-label text-sm text-muted-foreground">Fecha de nacimiento:</p>
                <p className="field-value font-medium">{ficha.fechaNac || "No especificada"}</p>
              </div>
              <div>
                <p className="field-label text-sm text-muted-foreground">Celular:</p>
                <p className="field-value font-medium">{ficha.celular || "No especificado"}</p>
              </div>
              <div>
                <p className="field-label text-sm text-muted-foreground">Email:</p>
                <p className="field-value font-medium">{ficha.email || "No especificado"}</p>
              </div>
            </div>
          </div>

          {/* Sección: Datos Clínicos */}
          <div className="section border-b pb-4">
            <h3 className="section-title text-lg font-semibold mb-3 text-[#8B4240]">Datos Clínicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ficha.cardiacas === "si-cardiacas" && <div className="field-value font-medium">Enf. Cardíacas</div>}
              {ficha.renales === "si-renales" && <div className="field-value font-medium">Enf. Renales</div>}
              {ficha.circulatorias === "si-circulatorias" && (
                <div className="field-value font-medium">Enf. Circulatorias</div>
              )}
              {ficha.pulmonares === "si-pulmonares" && <div className="field-value font-medium">Enf. Pulmonares</div>}
              {ficha.digestivas === "si-digestivas" && <div className="field-value font-medium">Enf. Digestivas</div>}
              {ficha.hematologicas === "si-hematologicas" && (
                <div className="field-value font-medium">Enf. Hematológicas</div>
              )}
              {ficha.endocrinas === "si-endocrinas" && <div className="field-value font-medium">Enf. Endócrinas</div>}
              {ficha.neurologicas === "si-neurologicas" && (
                <div className="field-value font-medium">Enf. Neurológicas</div>
              )}
              {ficha.hipertension === "si-hipertension" && <div className="field-value font-medium">Hipertensión</div>}
              {ficha.alergias === "si-alergias" && <div className="field-value font-medium">Alergias</div>}
              {ficha.piel === "si-piel" && <div className="field-value font-medium">Enfermedades en la piel</div>}
              {ficha.queloides === "si-queloides" && <div className="field-value font-medium">Queloides</div>}
              {ficha.cicatrices === "si-cicatrices" && <div className="field-value font-medium">Cicatrices</div>}
              {ficha.quirurgicos === "si-quirurgicos" && (
                <div className="field-value font-medium">Antecedentes quirúrgicos</div>
              )}
              {ficha.convulsiones === "si-convulsiones" && (
                <div className="field-value font-medium">Sufre convulsiones</div>
              )}
              {ficha.tabaco === "si-tabaco" && <div className="field-value font-medium">Tabaco</div>}
              {ficha.alcohol === "si-alcohol" && <div className="field-value font-medium">Alcohol</div>}
              {ficha.embarazo === "si-embarazo" && <div className="field-value font-medium">Embarazo</div>}
            </div>
          </div>

          {/* Sección: Piel */}
          <div className="section border-b pb-4">
            <h3 className="section-title text-lg font-semibold mb-3 text-[#8B4240]">Piel</h3>

            <div className="mb-4">
              <p className="field-label text-sm text-muted-foreground font-medium mb-2">Biotipo cutáneo:</p>
              <div className="grid grid-cols-2 gap-2">
                {ficha.biotipo?.normal && <div className="field-value font-medium">Normal</div>}
                {ficha.biotipo?.seca && <div className="field-value font-medium">Seca</div>}
                {ficha.biotipo?.mixta && <div className="field-value font-medium">Mixta</div>}
                {ficha.biotipo?.grasa && <div className="field-value font-medium">Grasa</div>}
              </div>
            </div>

            <div className="mb-4">
              <p className="field-label text-sm text-muted-foreground font-medium mb-2">Fototipo cutáneo:</p>
              <div className="grid grid-cols-4 gap-2">
                {ficha.fototipo?.i && <div className="field-value font-medium">I</div>}
                {ficha.fototipo?.ii && <div className="field-value font-medium">II</div>}
                {ficha.fototipo?.iii && <div className="field-value font-medium">III</div>}
                {ficha.fototipo?.iv && <div className="field-value font-medium">IV</div>}
              </div>
            </div>

            <div className="mb-4">
              <p className="field-label text-sm text-muted-foreground font-medium mb-2">Alteraciones:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {ficha.alteraciones?.hipercromias && <div className="field-value font-medium">Hipercromias</div>}
                {ficha.alteraciones?.rosacea && <div className="field-value font-medium">Rosácea</div>}
                {ficha.alteraciones?.acne && <div className="field-value font-medium">Acné</div>}
                {ficha.alteraciones?.noEncontradas && <div className="field-value font-medium">No encontradas</div>}
              </div>
            </div>

            <div>
              <p className="field-label text-sm text-muted-foreground font-medium mb-2">Estado de la piel:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ficha.estadoPiel?.deshidratada && <div className="field-value font-medium">Deshidratada</div>}
                {ficha.estadoPiel?.atopica && <div className="field-value font-medium">Atópica</div>}
                {ficha.estadoPiel?.sensible && <div className="field-value font-medium">Sensible</div>}
                {ficha.estadoPiel?.fotoenvejecida && <div className="field-value font-medium">Fotoenvejecida</div>}
              </div>
            </div>
          </div>

          {/* Sección: Observaciones en el rostro */}
          <div className="section border-b pb-4">
            <h3 className="section-title text-lg font-semibold mb-3 text-[#8B4240]">Observaciones en el rostro</h3>

            <div className="mb-4">
              <p className="field-label text-sm text-muted-foreground font-medium mb-2">Líneas de expresión:</p>
              <div className="grid grid-cols-1 gap-2">
                {ficha.lineasExpresion?.suaves && <div className="field-value font-medium">Suaves</div>}
                {ficha.lineasExpresion?.profundas && <div className="field-value font-medium">Profundas</div>}
                {ficha.lineasExpresion?.arrugas && <div className="field-value font-medium">Arrugas</div>}
                {ficha.lineasExpresion?.flaccidez && <div className="field-value font-medium">Flaccidez</div>}
              </div>
            </div>

            <div>
              <p className="field-label text-sm text-muted-foreground font-medium mb-2">Textura:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {ficha.textura?.suave && <div className="field-value font-medium">Suave</div>}
                {ficha.textura?.aspera && <div className="field-value font-medium">Áspera</div>}
                {ficha.textura?.oleosa && <div className="field-value font-medium">Oleosa</div>}
              </div>
            </div>
          </div>

          {/* Sección: Diagnóstico y tratamiento */}
          <div className="section border-b pb-4">
            <h3 className="section-title text-lg font-semibold mb-3 text-[#8B4240]">Diagnóstico y tratamiento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="field-label text-sm text-muted-foreground mb-1">Diagnóstico y tratamiento recomendado:</p>
                <p className="field-value font-medium p-2 border rounded-md min-h-[100px] bg-gray-50">
                  {ficha.diagnostico || "No especificado"}
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="field-label text-sm text-muted-foreground mb-1">Presupuesto:</p>
                  <p className="field-value font-medium p-2 border rounded-md bg-gray-50">
                    {ficha.presupuesto
                      ? `$ ${Number(ficha.presupuesto).toLocaleString("es-AR")} ARS`
                      : "No especificado"}
                  </p>
                </div>
                <div>
                  <p className="field-label text-sm text-muted-foreground mb-1">Aclaraciones:</p>
                  <p className="field-value font-medium p-2 border rounded-md min-h-[80px] bg-gray-50">
                    {ficha.aclaraciones || "No especificado"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Sesiones Programadas */}
          <div className="section border-b pb-4">
            <h3 className="section-title text-lg font-semibold mb-3 text-[#8B4240]">Sesiones Programadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7].map((session) => (
                <div key={session}>
                  <p className="field-label text-sm text-muted-foreground mb-1">Sesión {session}:</p>
                  <p className="field-value font-medium p-2 border rounded-md bg-gray-50">
                    {ficha.sesiones?.[`sesion${session}` as keyof typeof ficha.sesiones] || "No programada"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sección: Firma */}
          <div className="footer border-t pt-4 mt-8">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Firma del cliente:</p>
                <div className="signature-line border-b w-full md:w-96 h-10 mt-2"></div>
              </div>
              <div className="professional-info text-right">
                <p className="text-sm text-muted-foreground">Carina Sánchez -</p>
                <p className="text-sm text-muted-foreground">Técnica Universitaria Cosmiatra y Esteticista</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
