"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface MobileMenuProps {
  scrolled: boolean
}

export function MobileMenu({ scrolled }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 focus:outline-none"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-6 w-6 text-[#3d0d04]" /> : <Menu className="h-6 w-6 text-[#3d0d04]" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-white pt-20"
          >
            <div className="container flex flex-col items-center justify-start h-full">
              <nav className="flex flex-col items-center space-y-8 text-center w-full">
                <Link
                  href="#servicios"
                  className="text-xl font-medium text-[#3d0d04] py-3 w-full border-b border-gray-100"
                  onClick={closeMenu}
                >
                  Servicios
                </Link>
                <Link
                  href="#nosotros"
                  className="text-xl font-medium text-[#3d0d04] py-3 w-full border-b border-gray-100"
                  onClick={closeMenu}
                >
                  Nosotros
                </Link>
                <Link
                  href="#contacto"
                  className="text-xl font-medium text-[#3d0d04] py-3 w-full border-b border-gray-100"
                  onClick={closeMenu}
                >
                  Contacto
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
