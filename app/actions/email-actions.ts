"use server"

import nodemailer from "nodemailer"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Configuración del transportador de correo
// En producción, usa variables de entorno para estas credenciales
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "tu-correo@gmail.com", // Reemplazar con tu correo real
    pass: process.env.EMAIL_PASSWORD || "tu-contraseña", // Reemplazar con tu contraseña real o app password
  },
})

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

// Función para enviar correo de confirmación
export async function enviarConfirmacionTurno(turnoData: TurnoData) {
  try {
    // Convertir la fecha de string a objeto Date
    const fechaTurno = new Date(turnoData.fecha)
    const fechaFormateada = format(fechaTurno, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })

    // Información del correo
    const mailOptions = {
      from: `"Glow up Estética" <${process.env.EMAIL_USER || "tu-correo@gmail.com"}>`,
      to: turnoData.email,
      subject: `Confirmación de turno - Glow up Estética`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0d0b0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #8B4240; margin-bottom: 5px;">Glow up</h1>
            <p style="color: #8B4240; font-size: 14px; margin-top: 0;">Estética Cosmiátrica</p>
          </div>
          
          <div style="background-color: #f9e5d0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #3d0d04; margin-top: 0;">¡Tu turno ha sido confirmado!</h2>
            <p style="margin-bottom: 5px;">Hola ${turnoData.nombreCompleto},</p>
            <p>Te confirmamos que tu turno ha sido reservado correctamente.</p>
          </div>
          
          <div style="background-color: #fff; padding: 15px; border: 1px solid #f0d0b0; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #8B4240; margin-top: 0;">Detalles del turno:</h3>
            <ul style="list-style-type: none; padding-left: 0;">
              <li style="margin-bottom: 8px;"><strong>Fecha:</strong> ${fechaFormateada}</li>
              <li style="margin-bottom: 8px;"><strong>Horario:</strong> ${turnoData.horario}</li>
              <li style="margin-bottom: 8px;"><strong>Nombre:</strong> ${turnoData.nombreCompleto}</li>
              <li style="margin-bottom: 8px;"><strong>DNI:</strong> ${turnoData.dni}</li>
            </ul>
          </div>
          
          <div style="margin-top: 20px; font-size: 14px; color: #666;">
            <p>Si necesitas modificar o cancelar tu turno, por favor contáctanos respondiendo a este correo o llamando al número de teléfono de la estética.</p>
            <p>Te enviaremos un recordatorio 24 horas antes de tu turno.</p>
          </div>
          
          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #f0d0b0; padding-top: 15px;">
            <p>© ${new Date().getFullYear()} Glow up Estética Cosmiátrica. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    }

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions)
    console.log("Correo de confirmación enviado:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error al enviar correo de confirmación:", error)
    return { success: false, error: error }
  }
}

// Función para enviar recordatorio 24h antes
export async function enviarRecordatorioTurno(turnoData: TurnoData) {
  try {
    // Convertir la fecha de string a objeto Date
    const fechaTurno = new Date(turnoData.fecha)
    const fechaFormateada = format(fechaTurno, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })

    // Información del correo
    const mailOptions = {
      from: `"Glow up Estética" <${process.env.EMAIL_USER || "tu-correo@gmail.com"}>`,
      to: turnoData.email,
      subject: `Recordatorio: Tu turno es mañana - Glow up Estética`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0d0b0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #8B4240; margin-bottom: 5px;">Glow up</h1>
            <p style="color: #8B4240; font-size: 14px; margin-top: 0;">Estética Cosmiátrica</p>
          </div>
          
          <div style="background-color: #f9e5d0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #3d0d04; margin-top: 0;">¡Recordatorio de turno!</h2>
            <p style="margin-bottom: 5px;">Hola ${turnoData.nombreCompleto},</p>
            <p>Te recordamos que <strong>mañana</strong> tienes un turno en nuestra estética.</p>
          </div>
          
          <div style="background-color: #fff; padding: 15px; border: 1px solid #f0d0b0; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #8B4240; margin-top: 0;">Detalles del turno:</h3>
            <ul style="list-style-type: none; padding-left: 0;">
              <li style="margin-bottom: 8px;"><strong>Fecha:</strong> ${fechaFormateada}</li>
              <li style="margin-bottom: 8px;"><strong>Horario:</strong> ${turnoData.horario}</li>
              <li style="margin-bottom: 8px;"><strong>Nombre:</strong> ${turnoData.nombreCompleto}</li>
              <li style="margin-bottom: 8px;"><strong>DNI:</strong> ${turnoData.dni}</li>
            </ul>
          </div>
          
          <div style="margin-top: 20px; font-size: 14px; color: #666;">
            <p>Si necesitas modificar o cancelar tu turno, por favor contáctanos lo antes posible respondiendo a este correo o llamando al número de teléfono de la estética.</p>
            <p>¡Te esperamos!</p>
          </div>
          
          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #f0d0b0; padding-top: 15px;">
            <p>© ${new Date().getFullYear()} Glow up Estética Cosmiátrica. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    }

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions)
    console.log("Correo de recordatorio enviado:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error al enviar correo de recordatorio:", error)
    return { success: false, error: error }
  }
}
