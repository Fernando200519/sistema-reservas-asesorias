// email-service.js
// Servicio para el envío de correos electrónicos

import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuración del transportador de correo
 */
function crearTransportador() {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // true para 465, false para otros puertos
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
}

/**
 * Carga y procesa la plantilla de correo
 * @param {string} templatePath - Ruta a la plantilla HTML
 * @param {Object} variables - Variables para reemplazar en la plantilla
 * @returns {string} - HTML procesado
 */
function procesarPlantilla(templatePath, variables) {
    try {
        let template = fs.readFileSync(templatePath, 'utf8');
        
        // Reemplazar variables en la plantilla
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`\\[${key}\\]`, 'g');
            template = template.replace(regex, value || 'No especificado');
        }
        
        return template;
    } catch (error) {
        console.error('Error al procesar plantilla:', error);
        throw new Error('No se pudo procesar la plantilla de correo');
    }
}

/**
 * Envía un correo de cancelación de asesoría
 * @param {Object} datosCorreo - Datos necesarios para el correo
 * @returns {Promise<Object>} - Resultado del envío
 */
export async function enviarCorreoCancelacion(datosCorreo) {
    try {
        console.log('📧 Iniciando envío de correo de cancelación...');
        
        // Validar datos requeridos
        if (!datosCorreo.emailEstudiante || !datosCorreo.nombreEstudiante) {
            throw new Error('Faltan datos del estudiante (email o nombre)');
        }

        // Crear transportador
        const transporter = crearTransportador();
        
        // Verificar conexión
        await transporter.verify();
        console.log('✅ Conexión SMTP verificada');
        
        // Preparar variables para la plantilla
        const variables = {
            NOMBRE_ESTUDIANTE: datosCorreo.nombreEstudiante,
            TEMA_ASESORIA: datosCorreo.tema || 'Tema no especificado',
            FECHA_ASESORIA: formatearFecha(datosCorreo.fecha),
            HORA_ASESORIA: datosCorreo.hora || 'Hora no especificada',
            NOMBRE_ASESOR: datosCorreo.nombreAsesor || 'Asesor no especificado',
            NIVEL_INGLES: datosCorreo.nivelIngles || 'Nivel no especificado',
            EMAIL_CAA: process.env.CAA_EMAIL || 'caa.coatzacoalcos@uv.mx',
            TELEFONO_CAA: process.env.CAA_TELEFONO || '(921) 211-2000',
            MOTIVO_CANCELACION: datosCorreo.motivo || 'Cancelación por el asesor'
        };
        
        // Cargar y procesar plantilla
        const templatePath = path.join(__dirname, 'templates', 'email_cancelacion_asesoria.html');
        const htmlContent = procesarPlantilla(templatePath, variables);
        
        // Configurar mensaje
        const mailOptions = {
            from: {
                name: 'Centro de Autoacceso - UV Campus Coatzacoalcos',
                address: process.env.EMAIL_USER
            },
            to: datosCorreo.emailEstudiante,
            subject: `🚨 Cancelación de Asesoría - ${variables.FECHA_ASESORIA}`,
            html: htmlContent,
            // Agregar texto plano como fallback
            text: `
Estimado(a) ${variables.NOMBRE_ESTUDIANTE},

Te informamos que tu asesoría programada ha sido CANCELADA.

Detalles de la asesoría cancelada:
- Tema: ${variables.TEMA_ASESORIA}
- Fecha: ${variables.FECHA_ASESORIA}
- Hora: ${variables.HORA_ASESORIA}
- Asesor: ${variables.NOMBRE_ASESOR}
- Nivel: ${variables.NIVEL_INGLES}

Puedes reservar una nueva asesoría ingresando al sistema de reservaciones.

Para más información, contacta al Centro de Autoacceso:
Email: ${variables.EMAIL_CAA}
Teléfono: ${variables.TELEFONO_CAA}

Atentamente,
Centro de Autoacceso - Universidad Veracruzana Campus Coatzacoalcos
            `
        };
        
        // Enviar correo
        console.log(`📤 Enviando correo a: ${datosCorreo.emailEstudiante}`);
        const result = await transporter.sendMail(mailOptions);
        
        console.log('✅ Correo enviado exitosamente:', result.messageId);
        
        return {
            exito: true,
            messageId: result.messageId,
            destinatario: datosCorreo.emailEstudiante
        };
        
    } catch (error) {
        console.error('❌ Error al enviar correo:', error);
        
        return {
            exito: false,
            error: error.message,
            destinatario: datosCorreo.emailEstudiante
        };
    }
}

/**
 * Envía correos a múltiples estudiantes
 * @param {Array} listaCorreos - Array de objetos con datos de correo
 * @returns {Promise<Object>} - Resultado del envío masivo
 */
export async function enviarCorreosCancelacionMasivo(listaCorreos) {
    console.log(`📧 Iniciando envío masivo de correos (${listaCorreos.length} destinatarios)`);
    
    const resultados = {
        exitosos: [],
        fallidos: [],
        total: listaCorreos.length
    };
    
    for (const datosCorreo of listaCorreos) {
        try {
            // Agregar pequeña pausa entre envíos para evitar rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const resultado = await enviarCorreoCancelacion(datosCorreo);
            
            if (resultado.exito) {
                resultados.exitosos.push(resultado);
            } else {
                resultados.fallidos.push(resultado);
            }
            
        } catch (error) {
            console.error(`❌ Error enviando a ${datosCorreo.emailEstudiante}:`, error);
            resultados.fallidos.push({
                exito: false,
                error: error.message,
                destinatario: datosCorreo.emailEstudiante
            });
        }
    }
    
    console.log(`📊 Envío masivo completado: ${resultados.exitosos.length} exitosos, ${resultados.fallidos.length} fallidos`);
    
    return resultados;
}

/**
 * Función auxiliar para formatear fechas
 * @param {string} fecha - Fecha en formato YYYY-MM-DD o ISO
 * @returns {string} - Fecha formateada
 */
function formatearFecha(fecha) {
    if (!fecha) return 'Fecha no especificada';
    
    try {
        const fechaObj = new Date(fecha);
        return fechaObj.toLocaleDateString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return fecha; // Retornar fecha original si no se puede formatear
    }
}