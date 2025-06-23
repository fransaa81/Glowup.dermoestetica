"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { KeyRound } from "lucide-react"

export function AdminAccess() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const isAuthenticated = sessionStorage.getItem("authenticated") === "true"
    setIsAdmin(isAuthenticated)
  }, [])

  if (!isAdmin) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showAdminPanel ? (
        <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => router.push("/ficha-tecnica")}
              className="text-sm px-3 py-2 bg-[#8B4240] text-white rounded-md hover:bg-[#7A3A38] transition-colors"
            >
              Ficha Cosmetológica
            </button>
            <button
              onClick={() => router.push("/fichas-guardadas")}
              className="text-sm px-3 py-2 bg-[#8B4240] text-white rounded-md hover:bg-[#7A3A38] transition-colors"
            >
              Fichas Guardadas
            </button>
            <button
              onClick={() => router.push("/admin/turnos")}
              className="text-sm px-3 py-2 bg-[#8B4240] text-white rounded-md hover:bg-[#7A3A38] transition-colors"
            >
              Administrar Turnos
            </button>
            <button onClick={() => setShowAdminPanel(false)} className="text-xs text-gray-500 mt-1 hover:text-gray-700">
              Cerrar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdminPanel(true)}
          className="bg-[#8B4240] text-white p-3 rounded-full shadow-md hover:bg-[#7A3A38] transition-colors"
          aria-label="Panel de administrador"
        >
          <KeyRound size={20} />
        </button>
      )}
    </div>
  )
}
