"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Eye, EyeOff, AlertCircle, FileText, Calendar, MessageSquare } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Verificar si ya está autenticado al cargar la página
  useState(() => {
    const auth = sessionStorage.getItem("authenticated") === "true"
    setIsAuthenticated(auth)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulación de autenticación
    setTimeout(() => {
      if ((username === "Carosanz" || username === "Caronsanz") && password === "Pringles974$") {
        // Almacenar el estado de autenticación en sessionStorage
        sessionStorage.setItem("authenticated", "true")
        setIsAuthenticated(true)
      } else {
        // Mostrar mensaje de error específico
        if (username !== "Carosanz" && username !== "Caronsanz") {
          setError("Usuario incorrecto. El usuario correcto es 'Carosanz'")
        } else if (password !== "Pringles974$") {
          setError("Contraseña incorrecta. Verifica que incluya todos los caracteres especiales")
          setShowHint(true)
        } else {
          setError("Usuario o contraseña incorrectos")
        }
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="container py-10">
      <div className="flex items-center mb-8">
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
        </div>
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl text-center text-[#8B4240] tracking-wide">
              Acceso a Ficha Cosmetológica
            </CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder a la ficha cosmetológica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error de autenticación</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {showHint && (
              <Alert className="mb-4 bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Ayuda</AlertTitle>
                <AlertDescription className="text-amber-700">
                  La contraseña debe incluir el símbolo "$" al final: Pringles974$
                </AlertDescription>
              </Alert>
            )}

            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md border border-green-200 text-center">
                  <p className="text-green-800 font-medium">¡Sesión iniciada correctamente!</p>
                  <p className="text-sm text-green-700 mt-1">Ya puedes acceder a las fichas cosmetológicas</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Button
                    onClick={() => router.push("/ficha-tecnica")}
                    className="w-full bg-[#8B4240] hover:bg-[#7A3A38]"
                  >
                    Nueva Ficha
                  </Button>

                  <Button
                    onClick={() => router.push("/fichas-guardadas")}
                    variant="outline"
                    className="w-full border-[#8B4240] text-[#8B4240]"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Acceder a fichas guardadas
                  </Button>

                  <Button
                    onClick={() => router.push("/admin/turnos")}
                    variant="outline"
                    className="w-full border-[#8B4240] text-[#8B4240]"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Administrar turnos
                  </Button>

                  <Button
                    onClick={() => router.push("/admin/consultas")}
                    variant="outline"
                    className="w-full border-[#8B4240] text-[#8B4240]"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Consultas
                  </Button>

                  <Button
                    onClick={() => {
                      sessionStorage.removeItem("authenticated")
                      setIsAuthenticated(false)
                    }}
                    variant="ghost"
                    className="w-full"
                  >
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                    id="username"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-[#8B4240] hover:bg-[#7A3A38]" disabled={loading}>
                  {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">Acceso exclusivo para personal autorizado</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
