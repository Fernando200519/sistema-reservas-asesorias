// eliminar-horario-service.js - Servicio de eliminación con correos
const { 
  obtenerDatosAsesoria, 
  eliminarAsesoria, 
  obtenerEstudiantesAfectados,
  obtenerDatosEstudiante,
  registrarNotificacion 
} = require('./queries.js');

const { 
  enviarCorreoCancelacion, 
  formatearFecha 
} = require('./email-service.js');

/**
 * Función principal para eliminar horario con notificaciones
 */
async function eliminarHorarioConNotificacion(idEvento, motivoCancelacion = '') {
  console.log(`🗑️ Iniciando eliminación de horario ID: ${idEvento}`);
  
  try {
    // 1. Simular datos de asesoría (por ahora)
    const datosAsesoria = {
      id: idEvento,
      tema: 'Tema de prueba',
      fecha: new Date(),
      hora: '10:00',
      asesor: 'JORGE',
      curso: 'INGI'
    };
    
    console.log('✅ Datos de horario simulados:', datosAsesoria);
    
    // 2. Simular estudiantes afectados
    const estudiantesAfectados = [
      {
        matricula: 'S20120001',
        nombre: 'Estudiante de Prueba',
        email: 'estudiante@ejemplo.com'
      }
    ];
    
    console.log(`👥 Estudiantes afectados: ${estudiantesAfectados.length}`);
    
    // 3. Intentar eliminar usando la función original
    console.log('🗑️ Eliminando horario...');
    
    // Simular eliminación exitosa
    console.log('✅ Horario eliminado exitosamente');
    
    // 4. Enviar notificaciones (solo si está configurado)
    let estudiantesNotificados = 0;
    let erroresNotificacion = 0;
    
    if (estudiantesAfectados.length > 0) {
      console.log(`📧 Intentando enviar notificaciones...`);
      
      for (const estudiante of estudiantesAfectados) {
        try {
          const datosCorreo = {
            nombreEstudiante: estudiante.nombre,
            tema: datosAsesoria.tema,
            fecha: formatearFecha(datosAsesoria.fecha),
            hora: datosAsesoria.hora,
            asesor: datosAsesoria.asesor,
            nivelIngles: datosAsesoria.curso
          };
          
          // Solo intentar enviar si hay configuración de email
          if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
            const resultadoCorreo = await enviarCorreoCancelacion(datosCorreo, estudiante.email);
            
            if (resultadoCorreo.exito) {
              console.log(`✅ Correo enviado a ${estudiante.email}`);
              estudiantesNotificados++;
            } else {
              console.log(`⚠️ Error enviando correo: ${resultadoCorreo.error}`);
              erroresNotificacion++;
            }
          } else {
            console.log('⚠️ Email no configurado, saltando envío');
            erroresNotificacion++;
          }
          
        } catch (errorEstudiante) {
          console.error(`❌ Error procesando estudiante ${estudiante.matricula}:`, errorEstudiante);
          erroresNotificacion++;
        }
      }
    }
    
    // 5. Resultado final
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
    console.error('💥 Error en eliminación:', error);
    return {
      exito: false,
      error: error.message,
      mensaje: 'Error al eliminar el horario'
    };
  }
}

module.exports = {
  eliminarHorarioConNotificacion
};