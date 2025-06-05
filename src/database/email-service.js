// email-service.js - Servicio para envío de correos electrónicos
import nodemailer from 'nodemailer';

/**
 * Configuración del transportador de correo
 * Ajusta estos valores según tu proveedor de email
 */
const configurarTransportador = () => {
  return nodemailer.createTransporter({
    host: 'smtp.gmail.com', // Cambiar según tu proveedor
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER, // Tu email
      pass: process.env.EMAIL_PASSWORD // Tu contraseña de aplicación
    }
  });
};

/**
 * Template HTML para el correo de cancelación
 */
const obtenerTemplateCorreoCancelacion = () => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cancelación de Asesoría - CAA</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f7fa;
        }
        
        .email-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background-color: #003366;
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        
        .header .subtitle {
            margin: 10px 0 0 0;
            font-size: 14px;
            background-color: rgba(255,255,255,0.2);
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
        }
        
        .content {
            padding: 30px;
        }
        
        .alert-box {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
        }
        
        .alert-icon {
            font-size: 24px;
            margin-right: 15px;
            color: #e17055;
        }
        
        .alert-text {
            font-weight: 600;
            color: #6c5a00;
        }
        
        .details-section {
            background-color: #f8fafd;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
        }
        
        .details-title {
            color: #003366;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .detail-row {
            display: flex;
            margin-bottom: 12px;
            padding: 8px 0;
        }
        
        .detail-label {
            font-weight: 600;
            color: #4a5568;
            width: 120px;
            flex-shrink: 0;
        }
        
        .detail-value {
            color: #1a202c;
            flex: 1;
        }
        
        .message-section {
            margin: 25px 0;
            line-height: 1.7;
        }
        
        .contact-info {
            background-color: #e6f3ff;
            border-left: 4px solid #003366;
            padding: 20px;
            margin: 25px 0;
        }
        
        .contact-info h3 {
            color: #003366;
            margin: 0 0 10px 0;
            font-size: 16px;
        }
        
        .footer {
            background-color: #f8fafd;
            padding: 25px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer p {
            margin: 5px 0;
            color: #6b7280;
            font-size: 14px;
        }
        
        .btn-primary {
            background-color: #003366;
            color: white;
            padding: 12px 25px;
            border-radius: 6px;
            text-decoration: none;
            display: inline-block;
            font-weight: 600;
            margin: 15px 0;
        }
        
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            
            .content {
                padding: 20px;
            }
            
            .detail-row {
                flex-direction: column;
            }
            
            .detail-label {
                width: auto;
                margin-bottom: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>CAA</h1>
            <div class="subtitle">Centro de Autoacceso</div>
        </div>
        
        <div class="content">
            <div class="alert-box">
                <div class="alert-icon">⚠️</div>
                <div class="alert-text">Tu asesoría ha sido cancelada</div>
            </div>
            
            <p>Estimado(a) <strong>{{NOMBRE_ESTUDIANTE}}</strong>,</p>
            
            <div class="message-section">
                <p>Te informamos que tu asesoría programada ha sido <strong>cancelada</strong>. Lamentamos cualquier inconveniente que esto pueda ocasionarte.</p>
            </div>
            
            <div class="details-section">
                <div class="details-title">Detalles de la asesoría cancelada:</div>
                
                <div class="detail-row">
                    <div class="detail-label">Tema:</div>
                    <div class="detail-value">{{TEMA_ASESORIA}}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Fecha:</div>
                    <div class="detail-value">{{FECHA_ASESORIA}}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Hora:</div>
                    <div class="detail-value">{{HORA_ASESORIA}}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Asesor:</div>
                    <div class="detail-value">{{NOMBRE_ASESOR}}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Nivel:</div>
                    <div class="detail-value">{{NIVEL_INGLES}}</div>
                </div>
            </div>
            
            <div class="message-section">
                <h3 style="color: #003366; margin-bottom: 15px;">¿Qué puedes hacer ahora?</h3>
                <ul style="padding-left: 20px;">
                    <li style="margin-bottom: 8px;">Puedes reservar una nueva asesoría ingresando al sistema de reservaciones</li>
                    <li style="margin-bottom: 8px;">Consultar otros horarios disponibles con el mismo asesor</li>
                    <li style="margin-bottom: 8px;">Contactar directamente al Centro de Autoacceso si tienes dudas</li>
                </ul>
                
                <div style="text-align: center; margin: 25px 0;">
                    <a href="{{URL_SISTEMA}}" class="btn-primary">Reservar Nueva Asesoría</a>
                </div>
            </div>
            
            <div class="contact-info">
                <h3>¿Necesitas ayuda?</h3>
                <p><strong>Centro de Autoacceso - Universidad Veracruzana Campus Coatzacoalcos</strong></p>
                <p>📍 Unidad de Servicios Bibliotecarios (USBI)</p>
                <p>📧 Email: caa.coatzacoalcos@uv.mx</p>
                <p>📞 Teléfono: (921) 211-2000</p>
                <p>🕒 Horario de atención: Lunes a Viernes de 8:00 AM a 6:00 PM</p>
            </div>
            
            <div class="message-section">
                <p>Gracias por tu comprensión y te esperamos pronto en el Centro de Autoacceso.</p>
                <p style="margin-top: 20px;">
                    <strong>Atentamente,<br>
                    Equipo del Centro de Autoacceso<br>
                    Universidad Veracruzana Campus Coatzacoalcos</strong>
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p>Este es un mensaje automático del Sistema de Reservaciones del Centro de Autoacceso</p>
            <p>Universidad Veracruzana Campus Coatzacoalcos</p>
            <p style="color: #9ca3af; font-size: 12px;">Por favor, no responder a este correo</p>
        </div>
    </div>
</body>
</html>`;
};

/**
 * Función para reemplazar variables en el template
 * @param {string} template - Template HTML con variables
 * @param {Object} datos - Datos para reemplazar en el template
 * @returns {string} HTML procesado con los datos
 */
const procesarTemplate = (template, datos) => {
  let html = template;
  
  // Reemplazar todas las variables del template
  const variables = {
    'NOMBRE_ESTUDIANTE': datos.nombreEstudiante || 'Estudiante',
    'TEMA_ASESORIA': datos.tema || 'No especificado',
    'FECHA_ASESORIA': datos.fecha || 'No especificada',
    'HORA_ASESORIA': datos.hora || 'No especificada',
    'NOMBRE_ASESOR': datos.asesor || 'No especificado',
    'NIVEL_INGLES': datos.nivelIngles || 'No especificado',
    'URL_SISTEMA': datos.urlSistema || process.env.URL_SISTEMA || '#'
  };
  
  // Reemplazar cada variable en el HTML
  Object.keys(variables).forEach(variable => {
    const regex = new RegExp(`{{${variable}}}`, 'g');
    html = html.replace(regex, variables[variable]);
  });
  
  return html;
};

/**
 * Función principal para enviar correo de cancelación
 * @param {Object} datosAsesoria - Datos de la asesoría cancelada
 * @param {string} emailEstudiante - Email del estudiante
 * @returns {Object} Resultado del envío
 */
export async function enviarCorreoCancelacion(datosAsesoria, emailEstudiante) {
  try {
    console.log(`📧 Intentando enviar correo a: ${emailEstudiante}`);
    
    const transportador = configurarTransportador();
    
    // Obtener el template y procesarlo con los datos
    const templateHtml = obtenerTemplateCorreoCancelacion();
    const htmlFinal = procesarTemplate(templateHtml, datosAsesoria);
    
    // Configurar el correo
    const opcionesCorreo = {
      from: {
        name: 'Centro de Autoacceso - UV Coatzacoalcos',
        address: process.env.EMAIL_USER
      },
      to: emailEstudiante,
      subject: '⚠️ Cancelación de Asesoría - Centro de Autoacceso',
      html: htmlFinal,
      // Versión de texto plano como respaldo
      text: `
Estimado(a) ${datosAsesoria.nombreEstudiante},

Te informamos que tu asesoría programada ha sido CANCELADA.

Detalles de la asesoría:
- Tema: ${datosAsesoria.tema}
- Fecha: ${datosAsesoria.fecha}
- Hora: ${datosAsesoria.hora}
- Asesor: ${datosAsesoria.asesor}
- Nivel: ${datosAsesoria.nivelIngles}

Puedes reservar una nueva asesoría ingresando al sistema de reservaciones.

Para más información, contacta al Centro de Autoacceso.

Atentamente,
Centro de Autoacceso
Universidad Veracruzana Campus Coatzacoalcos
      `
    };
    
    // Enviar el correo
    const resultado = await transportador.sendMail(opcionesCorreo);
    
    console.log('✅ Correo de cancelación enviado exitosamente:', resultado.messageId);
    return {
      exito: true,
      messageId: resultado.messageId,
      mensaje: 'Correo enviado exitosamente'
    };
    
  } catch (error) {
    console.error('❌ Error al enviar correo de cancelación:', error);
    return {
      exito: false,
      error: error.message,
      mensaje: 'Error al enviar el correo'
    };
  }
}

/**
 * Función auxiliar para formatear fechas
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export function formatearFecha(fecha) {
  if (!fecha) return 'No especificada';
  
  try {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    const opciones = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return fechaObj.toLocaleDateString('es-MX', opciones);
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Fecha inválida';
  }
}

/**
 * Función para validar configuración de email
 * @returns {boolean} true si la configuración es válida
 */
export function validarConfiguracionEmail() {
  const requeridos = ['EMAIL_USER', 'EMAIL_PASSWORD'];
  const faltantes = requeridos.filter(env => !process.env[env]);
  
  if (faltantes.length > 0) {
    console.error('❌ Faltan variables de entorno para email:', faltantes);
    return false;
  }
  
  return true;
}

/**
 * Función de prueba para verificar conexión de email
 * @returns {Object} Resultado de la prueba
 */
export async function probarConexionEmail() {
  try {
    if (!validarConfiguracionEmail()) {
      return {
        exito: false,
        mensaje: 'Configuración de email incompleta'
      };
    }
    
    const transportador = configurarTransportador();
    await transportador.verify();
    
    console.log('✅ Conexión de email verificada exitosamente');
    return {
      exito: true,
      mensaje: 'Conexión de email exitosa'
    };
    
  } catch (error) {
    console.error('❌ Error en conexión de email:', error);
    return {
      exito: false,
      error: error.message,
      mensaje: 'Error en la conexión de email'
    };
  }
}