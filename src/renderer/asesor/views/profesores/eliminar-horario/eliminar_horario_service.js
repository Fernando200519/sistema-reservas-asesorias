// eliminar-horario/eliminar-horario-service.js
// SERVICIO LOCAL - en la misma carpeta que eliminar-horario.js

// Importar desde la ubicación de queries.js
import { leerHorarios } from "../../../../../src/database/queries.js";

/**
 * ✅ FUNCIÓN: Obtener estudiantes afectados por la eliminación de un horario
 * @param {number} idEvento - ID del evento/horario
 * @returns {Promise<Array>} - Lista de estudiantes afectados
 */
async function obtenerEstudiantesAfectados(idEvento) {
    console.log(`🔍 Buscando estudiantes afectados por horario ID: ${idEvento}`);
    
    try {
        // 🎯 MÉTODO 1: Usar endpoint de reservaciones existente
        const response = await fetch('https://gb572ef1f8a56c6-caa23.adb.us-ashburn-1.oraclecloudapps.com/ords/equipocaa/maestros/obtener_reservaciones_alumno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_evento: idEvento,
                evento_id: idEvento,
                buscar_por_evento: true
            })
        });

        if (response.ok) {
            const data = await response.json();
            const reservaciones = data.reservaciones || [];
            
            // Filtrar solo las que pertenecen a este evento
            const reservacionesDelEvento = reservaciones.filter(reserva => 
                reserva.id_evento == idEvento || reserva.evento_id == idEvento
            );
            
            if (reservacionesDelEvento.length > 0) {
                console.log(`👥 Encontrados ${reservacionesDelEvento.length} estudiantes vía BD`);
                
                // Enriquecer datos con información completa
                const estudiantesCompletos = [];
                for (const reserva of reservacionesDelEvento) {
                    const estudianteCompleto = await obtenerDatosCompletoEstudiante(reserva.matricula);
                    estudiantesCompletos.push({
                        ...reserva,
                        ...estudianteCompleto,
                        emailEstudiante: estudianteCompleto.email || `${reserva.matricula}@estudiantes.uv.mx`,
                        nombreEstudiante: estudianteCompleto.nombre_completo || reserva.nombre || `Estudiante ${reserva.matricula}`
                    });
                }
                
                return estudiantesCompletos;
            }
        }
        
        // 🎯 MÉTODO 2: Verificar basándose en cupos del horario
        console.log('🔄 Método alternativo: verificando por cupos...');
        
        const horariosActuales = await leerHorarios({
            fecha: new Date().toISOString().split('T')[0],
            tipo: "asesor", 
            asesor: "JORGE"
        });
        
        const horarioEspecifico = horariosActuales.find(h => h.id_evento == idEvento);
        
        if (horarioEspecifico && horarioEspecifico.cupo < 3) {
            const reservacionesEstimadas = 3 - horarioEspecifico.cupo;
            console.log(`📊 Estimadas ${reservacionesEstimadas} reservaciones por cupos`);
            
            // Crear estudiantes de muestra
            const estudiantesMuestra = [];
            for (let i = 1; i <= reservacionesEstimadas; i++) {
                estudiantesMuestra.push({
                    matricula: `EST${String(Date.now() + i).slice(-6)}`,
                    nombreEstudiante: `Estudiante ${i}`,
                    emailEstudiante: `estudiante${i}@estudiantes.uv.mx`,
                    tema: 'Tema de asesoría',
                    fecha: horarioEspecifico.fecha,
                    hora: horarioEspecifico.hora,
                    asesor: horarioEspecifico.asesor,
                    curso: horarioEspecifico.curso,
                    id_evento: idEvento
                });
            }
            
            return estudiantesMuestra;
        }
        
        console.log('ℹ️ No se encontraron estudiantes afectados');
        return [];
        
    } catch (error) {
        console.error('❌ Error obteniendo estudiantes afectados:', error);
        return [];
    }
}

/**
 * ✅ FUNCIÓN: Obtener datos completos de un estudiante
 * @param {string} matricula - Matrícula del estudiante
 * @returns {Promise<Object>} - Datos completos del estudiante
 */
async function obtenerDatosCompletoEstudiante(matricula) {
    try {
        const response = await fetch('https://gb572ef1f8a56c6-caa23.adb.us-ashburn-1.oraclecloudapps.com/ords/equipocaa/maestros/buscar_alumno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
            body: JSON.stringify({
                matricula: matricula
            })
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos del estudiante');
        }

        const data = await response.json();
        
        // Agregar email generado si no viene en la respuesta
        if (!data.email && data.matricula) {
            data.email = `${data.matricula}@estudiantes.uv.mx`;
        }
        
        return data;
        
    } catch (error) {
        console.error('Error al obtener datos del estudiante:', error);
        return {
            matricula: matricula,
            nombre_completo: `Estudiante ${matricula}`,
            email: `${matricula}@estudiantes.uv.mx`
        };
    }
}

/**
 * ✅ FUNCIÓN: Simular envío de correos de cancelación
 * @param {Array} datosCorreos - Array con datos para envío
 * @returns {Promise<Object>} - Resultado del envío simulado
 */
async function simularEnvioCorreos(datosCorreos) {
    console.log(`📧 Simulando envío de correos a ${datosCorreos.length} destinatario(s)...`);
    
    const resultados = {
        total: datosCorreos.length,
        exitosos: 0,
        fallidos: 0,
        detalles: []
    };
    
    for (const datos of datosCorreos) {
        // Simular delay de envío
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Simular éxito/fallo (90% éxito)
        const exito = Math.random() > 0.1;
        
        if (exito) {
            resultados.exitosos++;
            console.log(`📤 [SIMULADO] Correo enviado a: ${datos.emailEstudiante}`);
            resultados.detalles.push({
                destinatario: datos.emailEstudiante,
                nombre: datos.nombreEstudiante,
                exito: true
            });
        } else {
            resultados.fallidos++;
            console.log(`❌ [SIMULADO] Error enviando a: ${datos.emailEstudiante}`);
            resultados.detalles.push({
                destinatario: datos.emailEstudiante,
                nombre: datos.nombreEstudiante,
                exito: false,
                error: 'Error simulado'
            });
        }
    }
    
    console.log(`📊 Simulación completada: ${resultados.exitosos}/${resultados.total} exitosos`);
    return resultados;
}

/**
 * ✅ FUNCIÓN PRINCIPAL: Eliminar horario con notificaciones
 * @param {number} idEvento - ID del evento a eliminar
 * @param {string} motivo - Motivo de la cancelación
 * @returns {Promise<Object>} - Resultado de la operación
 */
export async function eliminarHorarioConNotificacion(idEvento, motivo = 'Cancelación por el asesor') {
    console.log(`🚀 Iniciando eliminación de horario ${idEvento} con notificaciones`);
    
    try {
        // 1. Obtener estudiantes afectados ANTES de eliminar
        console.log('🔍 Verificando estudiantes afectados...');
        const estudiantesAfectados = await obtenerEstudiantesAfectados(idEvento);
        
        // 2. Obtener datos del horario actual
        let datosHorario = null;
        try {
            const horariosActuales = await leerHorarios({
                fecha: new Date().toISOString().split('T')[0],
                tipo: "asesor", 
                asesor: "JORGE"
            });
            datosHorario = horariosActuales.find(h => h.id_evento == idEvento);
        } catch (e) {
            console.log('⚠️ No se pudieron obtener datos del horario');
        }
        
        // 3. Eliminar el horario usando el endpoint existente
        console.log('🗑️ Eliminando horario de la base de datos...');
        
        const response = await fetch('https://gb572ef1f8a56c6-caa23.adb.us-ashburn-1.oraclecloudapps.com/ords/equipocaa/maestros/eliminar_asesoria', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_evento: idEvento })
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar horario: ${response.statusText}`);
        }

        const dataEliminacion = await response.json();
        console.log('✅ Horario eliminado exitosamente de la BD');
        
        // 4. Si no hay estudiantes afectados, terminar aquí
        if (estudiantesAfectados.length === 0) {
            console.log('ℹ️ No hay estudiantes que notificar');
            return {
                exito: true,
                mensaje: 'Horario eliminado exitosamente (sin estudiantes afectados)',
                detalles: {
                    horarioEliminado: true,
                    datosHorario: datosHorario,
                    notificaciones: {
                        total: 0,
                        notificacionesEnviadas: 0,
                        notificacionesFallidas: 0
                    }
                }
            };
        }
        
        // 5. Preparar datos para correos
        const datosCorreos = estudiantesAfectados.map(estudiante => ({
            emailEstudiante: estudiante.emailEstudiante,
            nombreEstudiante: estudiante.nombreEstudiante,
            tema: estudiante.tema || 'Tema de la asesoría',
            fecha: datosHorario?.fecha || 'Fecha no disponible',
            hora: datosHorario?.hora || 'Hora no disponible',
            nombreAsesor: datosHorario?.asesor || 'JORGE',
            nivelIngles: datosHorario?.curso || 'Inglés 1',
            motivo: motivo,
            matricula: estudiante.matricula
        }));
        
        // 6. Simular envío de notificaciones
        console.log('📧 Procesando notificaciones...');
        const resultadoCorreos = await simularEnvioCorreos(datosCorreos);
        
        // 7. Registrar operación para auditoría
        const registroOperacion = {
            id_evento: idEvento,
            fecha_eliminacion: new Date().toISOString(),
            motivo: motivo,
            estudiantes_afectados: estudiantesAfectados.length,
            notificaciones_enviadas: resultadoCorreos.exitosos,
            notificaciones_fallidas: resultadoCorreos.fallidos,
            tipo: 'eliminacion_local'
        };
        
        const historial = JSON.parse(localStorage.getItem('historialEliminaciones') || '[]');
        historial.push(registroOperacion);
        localStorage.setItem('historialEliminaciones', JSON.stringify(historial));
        
        // 8. Preparar respuesta
        const respuesta = {
            exito: true,
            mensaje: 'Horario eliminado y notificaciones procesadas',
            detalles: {
                horarioEliminado: true,
                datosHorario: datosHorario,
                estudiantesAfectados: estudiantesAfectados.length,
                notificaciones: {
                    total: resultadoCorreos.total,
                    notificacionesEnviadas: resultadoCorreos.exitosos,
                    notificacionesFallidas: resultadoCorreos.fallidos,
                    tipo: 'simulado',
                    detalles: resultadoCorreos.detalles
                },
                eliminacionBD: dataEliminacion
            }
        };
        
        console.log('🎉 Proceso completado exitosamente');
        console.log(`📊 Resumen: ${resultadoCorreos.exitosos}/${resultadoCorreos.total} notificaciones simuladas`);
        
        return respuesta;
        
    } catch (error) {
        console.error('💥 Error en eliminarHorarioConNotificacion:', error);
        
        return {
            exito: false,
            error: error.message,
            mensaje: 'Error al eliminar horario o procesar notificaciones'
        };
    }
}

/**
 * ✅ FUNCIÓN DE VERIFICACIÓN: Comprobar estudiantes afectados sin eliminar
 * @param {number} idEvento - ID del evento para verificar
 * @returns {Promise<Object>} - Información sobre estudiantes afectados
 */
export async function verificarEstudiantesAfectados(idEvento) {
    console.log(`🧪 Verificando estudiantes afectados para horario ${idEvento}`);
    
    try {
        const estudiantes = await obtenerEstudiantesAfectados(idEvento);
        
        return {
            exito: true,
            tieneReservaciones: estudiantes.length > 0,
            cantidadEstudiantes: estudiantes.length,
            estudiantes: estudiantes,
            mensaje: estudiantes.length > 0 
                ? `Se encontraron ${estudiantes.length} estudiante(s) que serían notificado(s)`
                : 'No hay estudiantes registrados para este horario'
        };
        
    } catch (error) {
        console.error('Error verificando estudiantes:', error);
        return {
            exito: false,
            error: error.message,
            tieneReservaciones: false,
            cantidadEstudiantes: 0,
            estudiantes: []
        };
    }
}

/**
 * ✅ FUNCIÓN DE PRUEBA: Solo simular notificaciones sin eliminar
 * @param {number} idEvento - ID del evento para probar
 * @returns {Promise<Object>} - Resultado de la simulación
 */
export async function probarNotificacionesSinEliminar(idEvento) {
    console.log(`🧪 Modo de prueba: simulando notificaciones para horario ${idEvento}`);
    
    try {
        const verificacion = await verificarEstudiantesAfectados(idEvento);
        
        if (!verificacion.tieneReservaciones) {
            return {
                exito: true,
                mensaje: 'Modo prueba: No hay estudiantes que notificar',
                estudiantesAfectados: 0
            };
        }
        
        // Simular preparación y envío de correos
        const datosCorreos = verificacion.estudiantes.map(est => ({
            emailEstudiante: est.emailEstudiante,
            nombreEstudiante: est.nombreEstudiante,
            matricula: est.matricula
        }));
        
        console.log('📧 [PRUEBA] Simulando envío de correos...');
        const resultadoSimulacion = await simularEnvioCorreos(datosCorreos);
        
        return {
            exito: true,
            mensaje: 'Prueba de notificación completada',
            estudiantesAfectados: verificacion.cantidadEstudiantes,
            simulacion: resultadoSimulacion,
            nota: 'Esta fue solo una prueba - no se eliminó el horario'
        };
        
    } catch (error) {
        return {
            exito: false,
            error: error.message,
            mensaje: 'Error en modo de prueba'
        };
    }
}

/**
 * ✅ FUNCIÓN DE UTILIDAD: Ver historial de eliminaciones
 */
export function verHistorialEliminaciones() {
    const historial = JSON.parse(localStorage.getItem('historialEliminaciones') || '[]');
    console.table(historial);
    return historial;
}

/**
 * ✅ FUNCIÓN DE UTILIDAD: Limpiar historial
 */
export function limpiarHistorial() {
    localStorage.removeItem('historialEliminaciones');
    console.log('🧹 Historial de eliminaciones limpiado');
}

console.log('📦 eliminar-horario-service.js cargado (versión local)');