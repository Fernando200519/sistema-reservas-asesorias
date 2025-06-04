/**
 * Devuelve los horarios disponibles en una fecha específica
 * @param {Object{}} fecha - Un objeto JSON con lo siguiente: 
 * - fecha: Fecha en formato "YYYY-MM-DD" (ejemplo: "2025-05-22")
 * - tipo: "alumno" o "asesor"
 * - nivelIngles: *opcional * "INGI" o "INGII" (sólo si tipo es "alumno")
 * @returns {Object[]} - Un array de horarios, cada horario es un JSON que contiene el siguiente formato: 
 * - actividad: "AS"
 * - asesor: Primer nombre del asesor, ej. "JORGE" (sólo devuelve el primer nombre)
 * - cupo: Cupos disponibles, ej. 3
 * - curso: "INGI" o "INGII"
 * - fecha: Fecha en formato YYYY-MM-DDTHH:mm:ssZ, ej. "2025-05-22T00:00:00Z"
 * - hora: ej. "10:00",
 * - id_evento: "ID del evento, ej. 3513" (**Imporante: guardar este ID para una reservación**)
 */
/*YA INGRESADA EN EL CODIGO*/
export async function leerHorarios({fecha, tipo, nivelIngles, asesor, matricula}) { 
  console.log("leerHorarios", {fecha, tipo, nivelIngles, asesor});
  try {
    const response = await fetch('https://gb572ef1f8a56c6-caa23.adb.us-ashburn-1.oraclecloudapps.com/ords/equipocaa/maestros/leer_asesorias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fecha: fecha,
        tipo: tipo,
        nivelIngles: nivelIngles == "Inglés 1" ? "INGI" : nivelIngles == "Inglés 2" ? "INGII" : null, 
        asesor: asesor,
        matricula: matricula
    })})
    if (!response.ok) {
      throw new Error('Error al cargar los horarios desde la BD');
    }
    const data = await response.json();
    return data.eventos
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Realiza una conexión a la base de datos para insertar una nueva reservación
 * @param {int} idAsesoria - ID de la asesoría a reservar (igual al id_evento)
 * @param {string} tema - Tema de la asesoría 
 * @param {string} matricula - Matrícula del alumno que reserva
 * @returns {boolean} true si la reservación fue exitosa, false en caso contrario
 */
export async function reservarAsesoria(idAsesoria, tema, matricula) {
  const datos = {
    evento_id: idAsesoria,  
    tema: tema,
    matricula: matricula
  };

  try {
    const response = await fetch('https://gb572ef1f8a56c6-caa23.adb.us-ashburn-1.oraclecloudapps.com/ords/equipocaa/maestros/reservar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    if (!response.ok) {
      throw new Error('Error en la conexión');
    }
    const data = await response.json();
    if (data) {
      return true; // Reservación exitosa
    }
    else {
      return false; // Reservación fallida
    }
  } catch (error) {
    console.error('Error al confirmar la reservación:', error);
    alert('Ocurrió un error al confirmar la reservación. Intenta nuevamente.');    
  }
}

/**
 * 
 * @param {string} matricula 
 * @returns {Object[]} Devuelve un array de reservaciones del alumno. Cada reservación es un JSON con la siguiente estructura:
 * - asesor: Primer nombre del asesor, ej. "JORGE" (sólo devuelve el primer nombre)
 * - fecha: Fecha en formato YYYY-MM-DDTHH:mm:ssZ, ej. "2025-05-22T00:00:00Z"
 * - hora: ej. "10:00",
 * - tema: Tema de la asesoría
 * - id_evento: "ID del evento, ej. 3513"
 */
export async function obtenerMisReservaciones(matricula) {
  try {
    const response = await fetch('https://gb572ef1f8a56c6-caa23.adb.us-ashburn-1.oraclecloudapps.com/ords/equipocaa/maestros/obtener_reservaciones_alumno', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        matricula: matricula
      })
    });

    if (!response.ok) {
      throw new Error('Error al obtener las reservaciones');
    }

    const data = await response.json();
    return data.reservaciones;
  } catch (error) {
    console.error('Error al obtener las reservaciones:', error);
    return [];
    
  }
}

/**
 * Función para verificar el login del usuario
 * @param {string} matricula - Matrícula del alumno
 * @param {string} contra - Contraseña del alumno
 * @returns JSON con la siguiente estructura:
 * - success: true si el login fue exitoso, false en caso contrario
 * - tipo_usuario: "ACADEMICO" o "ESTUDIANTE"
 * - curso: "INGI" o "INGII"
 * - nombre: Nombre completo del usuario
 */
/*YA INGRESADA EN EL CODIGO*/
export async function verificarLogin(matricula, contra) {
  async function obtenerNombreAlumno() {
    try {
      const response = await fetch('https://gb572ef1f8a56c6-caa23.adb.us-ashburn-1.oraclecloudapps.com/ords/equipocaa/maestros/buscar_alumno', {
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify({
          matricula: matricula, // Cambiar por la fecha seleccionada
      })})
      if (!response.ok) {
        throw new Error('Error al conectarse con la BD');
      }
      const data = await response.json();
      return data.nombre_completo; // Ajustar según la estructura de datos de la API
    } catch (error) {
      console.error(error);
    }
  }
  try {
    const response = await fetch("https://gb572ef1f8a56c6-caa23.adb.us-ashburn-1.oraclecloudapps.com/ords/api/login/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        matricula: matricula,
        contra: contra})
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }

    const data = await response.json();

    if (data.success) {
      // Usuario válido
      const nombre = obtenerNombreAlumno()
      data.nombre = nombre.nombre_completo;
      return data;
    } else {
      // Credenciales inválidas
      throw new Error("Credenciales inválidas");
    }

  } catch (error) {
    console.error("Error al llamar al endpoint:", error);
  }

}

/**
 * Carga los horarios disponibles para una fecha y asesor específicos
 * @param {Array} horas - Array de horas disponibles
 * @param {string} fecha - Fecha en formato "dd, Mes YYYY" (ejemplo: "11, Mayo 2025")
 * @param {string} asesor - Nombre del asesor
 * @returns {Promise<Object>} Respuesta de la API con los horarios cargados
 */
export async function cargarHorarios(horas, fecha, asesor) {
    const v_json = {
      items: horas,
      fecha: fecha,
      asesor: asesor
    }

    console.log("v_json", v_json);
    console.log("JSON.stringify(v_json)", JSON.stringify(v_json));

    try {
      const response = await fetch('https://gb572ef1f8a56c6-caa23.adb.us-ashburn-1.oraclecloudapps.com/ords/equipocaa/maestros/leer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(v_json)
      });

      if (!response.ok) {
        throw new Error('Error al guardar el horario en la BD');
      };
      
      return response; // Retornar la respuesta de la API si es necesario
    } catch (error) {
      console.log("Aquí se captura el error");
      console.error(error);
    }
}

export async function cancelarReservacion(idReservacion) {
  try {
    const response = await fetch('https://gb572ef1f8a56c6-caa23.adb.us-ashburn-1.oraclecloudapps.com/ords/equipocaa/maestros/eliminar_asesoria', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_reservacion: idReservacion })
    });

    if (!response.ok) {
      throw new Error('Error al cancelar la reservación');
    }

    const data = await response.json();
    console.log('Respuesta de la API:', data);
  } catch (error) {
    console.error('Error al cancelar la reservación:', error);
    return false; // Retorna false en caso de error
  }
}

export async function eliminarHorario(idHorario) {
  console.log("json::", JSON.stringify({ id_evento: String(idHorario)}));
  try {
    const response = await fetch('https://gb572ef1f8a56c6-caa23.adb.us-ashburn-1.oraclecloudapps.com/ords/equipocaa/maestros/eliminar_asesoria', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_evento: idHorario })
    });

    if (!response.ok) {
      console.error('Error en la conexión:', response.statusText);
    }

    const data = await response.json();
    console.log('Respuesta de la API:', data);
  } catch (error) {
    console.error('Error al eliminar el horario:', error);
    return false; // Retorna false en caso de error
  }
}