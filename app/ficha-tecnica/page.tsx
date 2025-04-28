"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, Save, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Interfaz para los datos del formulario
interface FormData {
  // Información personal
  nombre: string
  apellido: string
  dni: string
  direccion: string
  fechaNac: string
  celular: string
  email: string

  // Datos clínicos
  cardiacas: string
  renales: string
  circulatorias: string
  pulmonares: string
  digestivas: string
  hematologicas: string
  endocrinas: string
  neurologicas: string
  hipertension: string
  alergias: string
  piel: string
  queloides: string
  cicatrices: string
  quirurgicos: string
  convulsiones: string
  tabaco: string
  alcohol: string
  embarazo: string

  // Piel
  biotipo: {
    normal: boolean
    seca: boolean
    mixta: boolean
    grasa: boolean
  }
  fototipo: {
    i: boolean
    ii: boolean
    iii: boolean
    iv: boolean
  }
  alteraciones: {
    hipercromias: boolean
    rosacea: boolean
    acne: boolean
    noEncontradas: boolean
  }
  estadoPiel: {
    deshidratada: boolean
    atopica: boolean
    sensible: boolean
    fotoenvejecida: boolean
  }

  // Observaciones en el rostro
  lineasExpresion: {
    suaves: boolean
    profundas: boolean
    arrugas: boolean
    flaccidez: boolean
  }
  textura: {
    suave: boolean
    aspera: boolean
    oleosa: boolean
  }

  // Diagnóstico y tratamiento
  diagnostico: string
  presupuesto: string
  aclaraciones: string

  // Sesiones programadas
  sesiones: {
    sesion1: string
    sesion2: string
    sesion3: string
    sesion4: string
    sesion5: string
    sesion6: string
    sesion7: string
  }
}

export default function FichaTecnicaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    // Información personal
    nombre: "",
    apellido: "",
    dni: "",
    direccion: "",
    fechaNac: "",
    celular: "",
    email: "",

    // Datos clínicos
    cardiacas: "no-cardiacas",
    renales: "no-renales",
    circulatorias: "no-circulatorias",
    pulmonares: "no-pulmonares",
    digestivas: "no-digestivas",
    hematologicas: "no-hematologicas",
    endocrinas: "no-endocrinas",
    neurologicas: "no-neurologicas",
    hipertension: "no-hipertension",
    alergias: "no-alergias",
    piel: "no-piel",
    queloides: "no-queloides",
    cicatrices: "no-cicatrices",
    quirurgicos: "no-quirurgicos",
    convulsiones: "no-convulsiones",
    tabaco: "no-tabaco",
    alcohol: "no-alcohol",
    embarazo: "no-embarazo",

    // Piel
    biotipo: {
      normal: false,
      seca: false,
      mixta: false,
      grasa: false,
    },
    fototipo: {
      i: false,
      ii: false,
      iii: false,
      iv: false,
    },
    alteraciones: {
      hipercromias: false,
      rosacea: false,
      acne: false,
      noEncontradas: false,
    },
    estadoPiel: {
      deshidratada: false,
      atopica: false,
      sensible: false,
      fotoenvejecida: false,
    },

    // Observaciones en el rostro
    lineasExpresion: {
      suaves: false,
      profundas: false,
      arrugas: false,
      flaccidez: false,
    },
    textura: {
      suave: false,
      aspera: false,
      oleosa: false,
    },

    // Diagnóstico y tratamiento
    diagnostico: "",
    presupuesto: "",
    aclaraciones: "",

    // Sesiones programadas
    sesiones: {
      sesion1: "",
      sesion2: "",
      sesion3: "",
      sesion4: "",
      sesion5: "",
      sesion6: "",
      sesion7: "",
    },
  })

  useEffect(() => {
    // Verificar autenticación
    const isAuthenticated = sessionStorage.getItem("authenticated") === "true"
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [router])

  // Manejador para campos de texto e inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target

    // Manejar campos anidados (para sesiones)
    if (id.startsWith("sesion")) {
      setFormData((prev) => ({
        ...prev,
        sesiones: {
          ...prev.sesiones,
          [id]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }))
    }
  }

  // Manejador para radio buttons
  const handleRadioChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  // Manejador para checkboxes
  const handleCheckboxChange = (section: string, field: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof FormData],
        [field]: checked,
      },
    }))
  }

  // Modificar la función handleSubmit para asegurar que las fichas se guarden correctamente

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que al menos tenga nombre y apellido
    if (!formData.nombre || !formData.apellido) {
      toast({
        title: "Error al guardar",
        description: "El nombre y apellido son obligatorios para guardar la ficha.",
        variant: "destructive",
      })
      return
    }

    try {
      // Crear un ID único para la ficha basado en timestamp
      const fichaId = Date.now().toString()

      // Obtener fichas existentes del localStorage
      const fichasGuardadas = JSON.parse(localStorage.getItem("fichasCosmetologicas") || "[]")

      // Agregar la nueva ficha
      const nuevaFicha = {
        id: fichaId,
        ...formData,
        nombreCompleto: `${formData.apellido}, ${formData.nombre}`,
        fechaCreacion: new Date().toISOString(),
      }

      fichasGuardadas.push(nuevaFicha)

      // Guardar en localStorage
      localStorage.setItem("fichasCosmetologicas", JSON.stringify(fichasGuardadas))

      toast({
        title: "Ficha guardada",
        description: "La ficha cosmetológica se ha guardado correctamente.",
      })

      // Redirigir a la lista de fichas
      router.push("/fichas-guardadas")
    } catch (error) {
      console.error("Error al guardar ficha:", error)
      toast({
        title: "Error al guardar",
        description: "Ocurrió un error al guardar la ficha. Por favor, intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("authenticated")
    router.push("/login")
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
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
            <h1 className="text-2xl font-bold text-[#8B4240] ml-2">Ficha Técnica</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-[#8B4240] border-[#8B4240]"
            onClick={() => router.push("/fichas-guardadas")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Acceder a fichas
          </Button>
          <Button variant="outline" onClick={handleLogout} className="text-[#8B4240] border-[#8B4240]">
            Cerrar sesión
          </Button>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader className="bg-[#FBE8E0]/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-[#8B4240]">Ficha Cosmetológica</CardTitle>
              <CardDescription>Completa la información del cliente para su historial y seguimiento</CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Image
                    src="/logo-transparent.png"
                    alt="Glow up Logo"
                    width={70}
                    height={70}
                    className="object-contain"
                  />
                  <div>
                    <p className="font-semibold text-[#8B4240]">Glow up</p>
                    <p className="text-xs text-muted-foreground">"Centro de Estética"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4 text-[#8B4240]">Información de Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      placeholder="Ingresa el nombre"
                      required
                      value={formData.nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      placeholder="Ingresa el apellido"
                      required
                      value={formData.apellido}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="dni">DNI</Label>
                    <Input
                      id="dni"
                      placeholder="Ingresa el DNI"
                      required
                      value={formData.dni}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      placeholder="Ingresa la dirección"
                      required
                      value={formData.direccion}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaNac">Fecha de Nacimiento</Label>
                    <Input id="fechaNac" type="date" required value={formData.fechaNac} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="celular">Celular</Label>
                    <Input
                      id="celular"
                      placeholder="Ingresa el número de celular"
                      required
                      value={formData.celular}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Ingresa el correo electrónico"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4 text-[#8B4240]">Datos Clínicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cardiacas">Enf. Cardíacas</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.cardiacas}
                        onValueChange={(value) => handleRadioChange("cardiacas", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-cardiacas" id="si-cardiacas" />
                          <Label htmlFor="si-cardiacas">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-cardiacas" id="no-cardiacas" />
                          <Label htmlFor="no-cardiacas">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="renales">Enf. Renales</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.renales}
                        onValueChange={(value) => handleRadioChange("renales", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-renales" id="si-renales" />
                          <Label htmlFor="si-renales">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-renales" id="no-renales" />
                          <Label htmlFor="no-renales">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="circulatorias">Enf. Circulatorias</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.circulatorias}
                        onValueChange={(value) => handleRadioChange("circulatorias", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-circulatorias" id="si-circulatorias" />
                          <Label htmlFor="si-circulatorias">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-circulatorias" id="no-circulatorias" />
                          <Label htmlFor="no-circulatorias">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="pulmonares">Enf. Pulmonares</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.pulmonares}
                        onValueChange={(value) => handleRadioChange("pulmonares", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-pulmonares" id="si-pulmonares" />
                          <Label htmlFor="si-pulmonares">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-pulmonares" id="no-pulmonares" />
                          <Label htmlFor="no-pulmonares">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="digestivas">Enf. Digestivas</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.digestivas}
                        onValueChange={(value) => handleRadioChange("digestivas", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-digestivas" id="si-digestivas" />
                          <Label htmlFor="si-digestivas">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-digestivas" id="no-digestivas" />
                          <Label htmlFor="no-digestivas">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="hematologicas">Enf. Hematológicas</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.hematologicas}
                        onValueChange={(value) => handleRadioChange("hematologicas", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-hematologicas" id="si-hematologicas" />
                          <Label htmlFor="si-hematologicas">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-hematologicas" id="no-hematologicas" />
                          <Label htmlFor="no-hematologicas">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="endocrinas">Enf. Endócrinas</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.endocrinas}
                        onValueChange={(value) => handleRadioChange("endocrinas", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-endocrinas" id="si-endocrinas" />
                          <Label htmlFor="si-endocrinas">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-endocrinas" id="no-endocrinas" />
                          <Label htmlFor="no-endocrinas">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="neurologicas">Enf. Neurológicas</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.neurologicas}
                        onValueChange={(value) => handleRadioChange("neurologicas", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-neurologicas" id="si-neurologicas" />
                          <Label htmlFor="si-neurologicas">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-neurologicas" id="no-neurologicas" />
                          <Label htmlFor="no-neurologicas">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="hipertension">Hipertensión</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.hipertension}
                        onValueChange={(value) => handleRadioChange("hipertension", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-hipertension" id="si-hipertension" />
                          <Label htmlFor="si-hipertension">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-hipertension" id="no-hipertension" />
                          <Label htmlFor="no-hipertension">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="alergias">Alergias</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.alergias}
                        onValueChange={(value) => handleRadioChange("alergias", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-alergias" id="si-alergias" />
                          <Label htmlFor="si-alergias">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-alergias" id="no-alergias" />
                          <Label htmlFor="no-alergias">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="piel">Enfermedades en la piel</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.piel}
                        onValueChange={(value) => handleRadioChange("piel", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-piel" id="si-piel" />
                          <Label htmlFor="si-piel">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-piel" id="no-piel" />
                          <Label htmlFor="no-piel">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="queloides">Queloides</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.queloides}
                        onValueChange={(value) => handleRadioChange("queloides", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-queloides" id="si-queloides" />
                          <Label htmlFor="si-queloides">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-queloides" id="no-queloides" />
                          <Label htmlFor="no-queloides">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="cicatrices">Cicatrices</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.cicatrices}
                        onValueChange={(value) => handleRadioChange("cicatrices", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-cicatrices" id="si-cicatrices" />
                          <Label htmlFor="si-cicatrices">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-cicatrices" id="no-cicatrices" />
                          <Label htmlFor="no-cicatrices">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="quirurgicos">Antecedentes quirúrgicos</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.quirurgicos}
                        onValueChange={(value) => handleRadioChange("quirurgicos", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-quirurgicos" id="si-quirurgicos" />
                          <Label htmlFor="si-quirurgicos">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-quirurgicos" id="no-quirurgicos" />
                          <Label htmlFor="no-quirurgicos">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="convulsiones">Sufre convulsiones</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.convulsiones}
                        onValueChange={(value) => handleRadioChange("convulsiones", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-convulsiones" id="si-convulsiones" />
                          <Label htmlFor="si-convulsiones">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-convulsiones" id="no-convulsiones" />
                          <Label htmlFor="no-convulsiones">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="tabaco">Tabaco</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.tabaco}
                        onValueChange={(value) => handleRadioChange("tabaco", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-tabaco" id="si-tabaco" />
                          <Label htmlFor="si-tabaco">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-tabaco" id="no-tabaco" />
                          <Label htmlFor="no-tabaco">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="alcohol">Alcohol</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.alcohol}
                        onValueChange={(value) => handleRadioChange("alcohol", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-alcohol" id="si-alcohol" />
                          <Label htmlFor="si-alcohol">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-alcohol" id="no-alcohol" />
                          <Label htmlFor="no-alcohol">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="embarazo">Embarazo</Label>
                    <div className="flex items-center gap-4">
                      <RadioGroup
                        value={formData.embarazo}
                        onValueChange={(value) => handleRadioChange("embarazo", value)}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="si-embarazo" id="si-embarazo" />
                          <Label htmlFor="si-embarazo">Sí</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="no-embarazo" id="no-embarazo" />
                          <Label htmlFor="no-embarazo">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4 text-[#8B4240]">Piel</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="font-medium">Biotipo cutáneo</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="biotipo-normal"
                          checked={formData.biotipo.normal}
                          onCheckedChange={(checked) => handleCheckboxChange("biotipo", "normal", checked === true)}
                        />
                        <Label htmlFor="biotipo-normal">Normal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="biotipo-seca"
                          checked={formData.biotipo.seca}
                          onCheckedChange={(checked) => handleCheckboxChange("biotipo", "seca", checked === true)}
                        />
                        <Label htmlFor="biotipo-seca">Seca</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="biotipo-mixta"
                          checked={formData.biotipo.mixta}
                          onCheckedChange={(checked) => handleCheckboxChange("biotipo", "mixta", checked === true)}
                        />
                        <Label htmlFor="biotipo-mixta">Mixta</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="biotipo-grasa"
                          checked={formData.biotipo.grasa}
                          onCheckedChange={(checked) => handleCheckboxChange("biotipo", "grasa", checked === true)}
                        />
                        <Label htmlFor="biotipo-grasa">Grasa</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-medium">Fototipo cutáneo</Label>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="fototipo-i"
                          checked={formData.fototipo.i}
                          onCheckedChange={(checked) => handleCheckboxChange("fototipo", "i", checked === true)}
                        />
                        <Label htmlFor="fototipo-i">I</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="fototipo-ii"
                          checked={formData.fototipo.ii}
                          onCheckedChange={(checked) => handleCheckboxChange("fototipo", "ii", checked === true)}
                        />
                        <Label htmlFor="fototipo-ii">II</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="fototipo-iii"
                          checked={formData.fototipo.iii}
                          onCheckedChange={(checked) => handleCheckboxChange("fototipo", "iii", checked === true)}
                        />
                        <Label htmlFor="fototipo-iii">III</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="fototipo-iv"
                          checked={formData.fototipo.iv}
                          onCheckedChange={(checked) => handleCheckboxChange("fototipo", "iv", checked === true)}
                        />
                        <Label htmlFor="fototipo-iv">IV</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-medium">Alteraciones</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hipercromias"
                          checked={formData.alteraciones.hipercromias}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("alteraciones", "hipercromias", checked === true)
                          }
                        />
                        <Label htmlFor="hipercromias">Hipercromias</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rosacea"
                          checked={formData.alteraciones.rosacea}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("alteraciones", "rosacea", checked === true)
                          }
                        />
                        <Label htmlFor="rosacea">Rosácea</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="acne"
                          checked={formData.alteraciones.acne}
                          onCheckedChange={(checked) => handleCheckboxChange("alteraciones", "acne", checked === true)}
                        />
                        <Label htmlFor="acne">Acné</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="no-encontradas"
                          checked={formData.alteraciones.noEncontradas}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("alteraciones", "noEncontradas", checked === true)
                          }
                        />
                        <Label htmlFor="no-encontradas">No encontradas</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-medium">Estado de la piel</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="deshidratada"
                          checked={formData.estadoPiel.deshidratada}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("estadoPiel", "deshidratada", checked === true)
                          }
                        />
                        <Label htmlFor="deshidratada">Deshidratada</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="atopica"
                          checked={formData.estadoPiel.atopica}
                          onCheckedChange={(checked) => handleCheckboxChange("estadoPiel", "atopica", checked === true)}
                        />
                        <Label htmlFor="atopica">Atópica</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sensible"
                          checked={formData.estadoPiel.sensible}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("estadoPiel", "sensible", checked === true)
                          }
                        />
                        <Label htmlFor="sensible">Sensible</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="fotoenvejecida"
                          checked={formData.estadoPiel.fotoenvejecida}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("estadoPiel", "fotoenvejecida", checked === true)
                          }
                        />
                        <Label htmlFor="fotoenvejecida">Fotoenvejecida</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4 text-[#8B4240]">Observaciones en el rostro</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="font-medium">Líneas de expresión</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="lineas-suaves"
                          checked={formData.lineasExpresion.suaves}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("lineasExpresion", "suaves", checked === true)
                          }
                        />
                        <Label htmlFor="lineas-suaves">Suaves</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="lineas-profundas"
                          checked={formData.lineasExpresion.profundas}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("lineasExpresion", "profundas", checked === true)
                          }
                        />
                        <Label htmlFor="lineas-profundas">Profundas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="arrugas"
                          checked={formData.lineasExpresion.arrugas}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("lineasExpresion", "arrugas", checked === true)
                          }
                        />
                        <Label htmlFor="arrugas">Arrugas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="flaccidez"
                          checked={formData.lineasExpresion.flaccidez}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("lineasExpresion", "flaccidez", checked === true)
                          }
                        />
                        <Label htmlFor="flaccidez">Flaccidez</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-medium">Textura</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="textura-suave"
                          checked={formData.textura.suave}
                          onCheckedChange={(checked) => handleCheckboxChange("textura", "suave", checked === true)}
                        />
                        <Label htmlFor="textura-suave">Suave</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="textura-aspera"
                          checked={formData.textura.aspera}
                          onCheckedChange={(checked) => handleCheckboxChange("textura", "aspera", checked === true)}
                        />
                        <Label htmlFor="textura-aspera">Áspera</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="textura-oleosa"
                          checked={formData.textura.oleosa}
                          onCheckedChange={(checked) => handleCheckboxChange("textura", "oleosa", checked === true)}
                        />
                        <Label htmlFor="textura-oleosa">Oleosa</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-2 text-[#8B4240]">Diagnóstico y tratamiento</h3>
                  <Textarea
                    id="diagnostico"
                    placeholder="Ingresa el diagnóstico y tratamiento recomendado"
                    className="min-h-[150px]"
                    value={formData.diagnostico}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#8B4240]">Presupuesto</h3>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input
                        id="presupuesto"
                        placeholder="Ingresa el presupuesto"
                        className="pl-6"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.presupuesto}
                        onChange={handleInputChange}
                      />
                      <span className="absolute right-3 top-2.5 text-muted-foreground text-sm">ARS</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#8B4240]">Aclaraciones</h3>
                    <Textarea
                      id="aclaraciones"
                      placeholder="Ingresa cualquier aclaración adicional"
                      value={formData.aclaraciones}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4 text-[#8B4240]">Sesiones Programadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7].map((session) => (
                    <div key={session} className="space-y-2">
                      <Label htmlFor={`sesion${session}`}>Sesión {session}</Label>
                      <Input
                        id={`sesion${session}`}
                        type="date"
                        value={formData.sesiones[`sesion${session}` as keyof typeof formData.sesiones]}
                        onChange={handleInputChange}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firma">Aceptación/Firma</Label>
                    <div className="border rounded-md h-24 w-full md:w-96"></div>
                  </div>

                  <div className="text-right self-end">
                    <p className="text-sm text-muted-foreground">Carina Sánchez -</p>
                    <p className="text-sm text-muted-foreground">Técnica Universitaria Cosmiatra y Esteticista</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between bg-[#FBE8E0]/30">
          <Button variant="outline" asChild>
            <Link href="/">Cancelar</Link>
          </Button>
          <Button type="submit" onClick={handleSubmit} className="bg-[#8B4240] hover:bg-[#7A3A38]">
            <Save className="mr-2 h-4 w-4" />
            Guardar Ficha
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
