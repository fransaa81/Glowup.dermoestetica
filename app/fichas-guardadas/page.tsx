"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, Search, FileText, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Ficha {
  id: string
  nombre: string
  apellido: string
  nombreCompleto: string
  dni: string
  fechaCreacion: string
  // Otros campos...
}

export default function FichasGuardadasPage() {
  const router = useRouter()
  const [fichas, setFichas] = useState<Ficha[]>([])
  const [filteredFichas, setFilteredFichas] = useState<Ficha[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Verificar autenticación
    const isAuthenticated = sessionStorage.getItem("authenticated") === "true"
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Cargar fichas del localStorage
    const cargarFichas = () => {
      try {
        const fichasGuardadas = JSON.parse(localStorage.getItem("fichasCosmetologicas") || "[]")

        // Ordenar alfabéticamente por apellido y nombre
        const fichasOrdenadas = fichasGuardadas.sort((a: Ficha, b: Ficha) =>
          a.nombreCompleto.localeCompare(b.nombreCompleto),
        )

        setFichas(fichasOrdenadas)
        setFilteredFichas(fichasOrdenadas)
      } catch (error) {
        console.error("Error al cargar fichas:", error)
        // Si hay un error, inicializar con un array vacío
        setFichas([])
        setFilteredFichas([])
      }
    }

    cargarFichas()

    // Agregar un event listener para detectar cambios en localStorage
    // Esto permitirá actualizar la lista si se modifican las fichas en otra pestaña
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "fichasCosmetologicas") {
        cargarFichas()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [router])

  // Función para filtrar fichas
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredFichas(fichas)
    } else {
      const filtered = fichas.filter(
        (ficha) => ficha.nombreCompleto.toLowerCase().includes(term) || ficha.dni.toLowerCase().includes(term),
      )
      setFilteredFichas(filtered)
    }
  }

  // Modificar la función handleDelete para asegurar que las fichas se actualicen correctamente
  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta ficha?")) {
      try {
        // Obtener las fichas actuales del localStorage
        const fichasActuales = JSON.parse(localStorage.getItem("fichasCosmetologicas") || "[]")

        // Filtrar la ficha a eliminar
        const fichasActualizadas = fichasActuales.filter((ficha: Ficha) => ficha.id !== id)

        // Guardar las fichas actualizadas en localStorage
        localStorage.setItem("fichasCosmetologicas", JSON.stringify(fichasActualizadas))

        // Actualizar el estado
        setFichas(fichasActualizadas)
        setFilteredFichas(
          searchTerm.trim() === ""
            ? fichasActualizadas
            : fichasActualizadas.filter(
                (ficha: Ficha) =>
                  ficha.nombreCompleto.toLowerCase().includes(searchTerm) ||
                  ficha.dni.toLowerCase().includes(searchTerm),
              ),
        )
      } catch (error) {
        console.error("Error al eliminar ficha:", error)
        alert("Ocurrió un error al eliminar la ficha. Por favor, intenta nuevamente.")
      }
    }
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
            <h1 className="text-3xl font-bold text-[#8B4240] ml-2">Fichas Guardadas</h1>
          </div>
        </div>
        <Button className="bg-[#8B4240] hover:bg-[#7A3A38]" onClick={() => router.push("/ficha-tecnica")}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Ficha
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-[#FBE8E0]/30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl text-[#8B4240]">Fichas Cosmetológicas</CardTitle>
              <CardDescription>Listado de todas las fichas guardadas</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o DNI"
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre y Apellido</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFichas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      {searchTerm
                        ? "No se encontraron fichas que coincidan con la búsqueda"
                        : "No hay fichas guardadas"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFichas.map((ficha) => (
                    <TableRow key={ficha.id}>
                      <TableCell className="font-medium">{ficha.nombreCompleto}</TableCell>
                      <TableCell>{ficha.dni}</TableCell>
                      <TableCell>{format(new Date(ficha.fechaCreacion), "dd/MM/yyyy", { locale: es })}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/fichas-guardadas/${ficha.id}`)}
                          >
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">Ver ficha</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(ficha.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar ficha</span>
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
  )
}
