/**
 * Devuelve los horarios disponibles en una fecha específica
 * @param {string} fecha - La fecha para la que se desean los horarios, debe estar en el formato "dd-mm-YYYY" (ejemplo: "11-05-2025")
 * @returns {Object[]} - Un array de horarios, cada horario es un JSON que contiene el siguiente formato: 
 * - actividad: "AS"
 * - asesor: Primer nombre del asesor, ej. "JORGE" (sólo devuelve el primer nombre)
 * - cupo: Cupos disponibles, ej. 3
 * - curso: "INGI" o "INGII"
 * - fecha: Fecha en formato YYYY-MM-DDTHH:mm:ssZ, ej. "2025-05-22T00:00:00Z"
 * - hora: ej. "10:00",
 * - id_evento: "ID del evento, ej. 3513" (**Imporante: guardar este ID para una reservación**)
 */
export async function leerHorarios(fecha) {
  try {
    const response = await fetch('https://gb572ef1f8a56c6-caa23.adb.us-ashburn-1.oraclecloudapps.com/ords/equipocaa/maestros/leer_asesorias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fecha: fecha
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
    function formatearFecha() {
      const partes = fecha.split(', ')[1].split(' '); // ["11", "Mayo", "2025"]

      const dia = partes[0];
      const mesTexto = partes[1].toLowerCase();
      const anio = partes[2];

      // Diccionario de meses
      const meses = {
        enero: "01", febrero: "02", marzo: "03",
        abril: "04", mayo: "05", junio: "06",
        julio: "07", agosto: "08", septiembre: "09",
        octubre: "10", noviembre: "11", diciembre: "12"
      };

      const mes = meses[mesTexto];

      return `${dia}-${mes}-${anio}`;    
    }

    console.log("horas", horas);
    console.log("fecha", formatearFecha());  
    console.log("asesor", asesor);

    const v_json = {
      items: horas,
      fecha: formatearFecha(),
      asesor: asesor
    }

    console.log("v_json", v_json);
    console.log("JSON.stringify(v_json)", JSON.stringify(v_json));

    try {
      const response = await fetch('https://gb572ef1f8a56c6-caa23.adb.us-ashburn-1.oraclecloudapps.com/ords/equipocaa/maestros/leer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(v_json)
      });
      if (!response.ok) {
        throw new Error('Error al guardar el horario en la BD');
      }
      const data = await response.json();
      return data; // Retornar la respuesta de la API si es necesario
    } catch (error) {
      console.error(error);
    }
}
