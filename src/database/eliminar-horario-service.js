// eliminar-horario-service.js - Servicio para eliminar horarios con notificaciones
import { 
  obtenerDatosAsesoria, 
  eliminarAsesoria, 
  obtenerEstudiantesAfectados,
  obtenerDatosEstudiante,
  registrarNotificacion 
} from './queries.js';

import { 
  enviarCorreoCancelacion, 
  formatearFecha 
} from './email-service.js';

/**
 * Función principal para eliminar horario con notificaciones por correo
 * @param {string|number} idEvento - ID del evento a eliminar
 * @param {string} motivoCancelacion - Motivo de la cancelación
 * @returns {Object} Resultado de la operación
 */
export async function eliminarHorarioConNotificacion(idEvento, motivoCancelacion = '') {
  console.log(`🗑️ Iniciando eliminación de horario ID: ${idEvento}`);
  
  try {
    // 1. Obtener datos del horario antes de eliminarlo
    console.log('📋 Obteniendo datos del horario...');
    const datosAsesoria = await obtenerDatosAsesoria(idEvento);
    
    if (!datosAsesoria) {
      throw new Error('No se encontró el horario especificado');
    }
    
    console.log('✅ Datos de horario obtenidos:', {
      id: idEvento,
      tema: datosAsesoria.tema,
      fecha: datosAsesoria.fecha,
      hora: datosAsesoria.hora,
      asesor: datosAsesoria.asesor
    });
    
    // 2. Obtener estudiantes que tienen reservaciones
    console.log('👥 Obteniendo estudiantes afectados...');
    const estudiantesAfectados = await obtenerEstudiantesAfectados(idEvento);
    
    console.log(`📊 Estudiantes afectados: ${estudiantesAfectados.length}`);
    
    // 3. Eliminar el horario de la base de datos
    console.log('🗑️ Eliminando horario de la base de datos...');
    const resultadoEliminacion = await eliminarAsesoria(idEvento);
    
    if (!resultadoEliminacion.exito) {
      throw new Error(`Error al eliminar horario: ${resultadoEliminacion.mensaje}`);
    }
    
    console.log('✅ Horario eliminado exitosamente de la base de datos');
    
    // 4. Enviar notificaciones por correo si hay estudiantes afectados
    let estudiantesNotificados = 0;
    let erroresNotificacion = 0;
    
    if (estudiantesAfectados.length > 0) {
      console.log(`📧 Enviando notificaciones a ${estudiantesAfectados.length} estudiante(s)...`);
      
      for (const estudiante of estudiantesAfectados) {
        try {
          // Obtener datos completos del estudiante
          let datosCompletos = estudiante;
          if (!estudiante.email && estudiante.matricula) {
            const datosAdicionales = await obtenerDatosEstudiante(estudiante.matricula);
            datosCompletos = { ...estudiante, ...datosAdicionales };
          }
          
          if (!datosCompletos.email) {
            console.warn(`⚠️ No se encontró email para estudiante ${datosCompletos.matricula || 'desconocido'}`);
            erroresNotificacion++;
            continue;
          }
          
          // Preparar datos para el correo
          const datosCorreo = {
            nombreEstudiante: datosCompletos.nombre || datosCompletos.matricula,
            tema: datosAsesoria.tema || 'No especificado',
            fecha: formatearFecha(datosAsesoria.fecha),
            hora: datosAsesoria.hora || 'No especificada',
            asesor: datosAsesoria.asesor || 'No especificado',
            nivelIngles: datosAsesoria.curso || datosAsesoria.nivel || 'No especificado'
          };
          
          // Enviar correo
          const resultadoCorreo = await enviarCorreoCancelacion(datosCorreo, datosCompletos.email);
          
          if (resultadoCorreo.exito) {
            console.log(`✅ Correo enviado a ${datosCompletos.email}`);
            estudiantesNotificados++;
            
            // Registrar notificación exitosa en BD
            await registrarNotificacion({
              matricula: datosCompletos.matricula,
              tipo: 'CANCELACION_ASESORIA',
              mensaje: `Asesoría cancelada: ${datosAsesoria.tema} - ${formatearFecha(datosAsesoria.fecha)} ${datosAsesoria.hora}`,
              emailEnviado: true,
              fechaEnvio: new Date(),
              messageId: resultadoCorreo.messageId,
              estado: 'EXITOSO'
            });
          } else {
            console.error(`❌ Error enviando correo a ${datosCompletos.email}:`, resultadoCorreo.error);
            erroresNotificacion++;
            
            // Registrar error en BD
            await registrarNotificacion({
              matricula: datosCompletos.matricula,
              tipo: 'CANCELACION_ASESORIA',
              mensaje: `Error al notificar cancelación`,
              emailEnviado: false,
              error: resultadoCorreo.error,
              fechaIntento: new Date(),
              estado: 'ERROR'
            });
          }
          
        } catch (errorEstudiante) {
          console.error(`❌ Error procesando estudiante ${estudiante.matricula}:`, errorEstudiante);
          erroresNotificacion++;
        }
      }
    }
    
    // 5. Preparar respuesta
    const resultado = {
      exito: true,
      mensaje: 'Horario eliminado exitosamente',
      detalles: {
        horarioEliminado: {
          id: idEvento,
          tema: datosAsesoria.tema,
          fecha: datosAsesoria.fecha,
          hora: datosAsesoria.hora,
          asesor: datosAsesoria.asesor
        },
        notificaciones: {
          totalEstudiantes: estudiantesAfectados.length,
          notificacionesEnviadas: estudiantesNotificados,
          errores: erroresNotificacion
        },
        motivoCancelacion
      }
    };
    
    console.log('🎉 Eliminación completada:', resultado.detalles.notificaciones);
    
    return resultado;
    
  } catch (error) {
    console.error('💥 Error en eliminación con notificación:', error);
    return {
      exito: false,
      error: error.message,
      mensaje: 'Error al eliminar el horario y procesar notificaciones'
    };
  }
}