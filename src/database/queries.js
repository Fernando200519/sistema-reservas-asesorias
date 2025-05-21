/**
 * @returns {Promise<Array>} - Retorna una promesa que resuelve en un array de horarios.
 * @description Carga los horarios desde la base de datos a través de una API REST.
 */
export async function leerHorarios() {
    try {
      const response = await fetch('https://gb572ef1f8a56c6-caa23.adb.us-ashburn-1.oraclecloudapps.com/ords/equipocaa/maestros/leer_asesorias', {
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify({
          fecha: '11-05-2025',
      })})
      if (!response.ok) {
        throw new Error('Error al cargar los horarios desde la BD');
      }
      const data = await response.json();
      return data.items.map(item => item.hora); // Ajustar según la estructura de datos de la API
    } catch (error) {
      console.error(error);
      return [];
    }
}

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

export async function reservarAsesoria() {
    const response = await fetch('https://gb572ef1f8a56c6-caa23.adb.us-ashburn-1.oraclecloudapps.com/ords/equipocaa/maestros/reservar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            evento_id: '3513',
            matricula: '123456',
            tema: 'Tema de ejemplo'
        })
    });

    if (!response.ok) {
        throw new Error('Error al reservar la asesoría');
    }

    const data = await response.json();
    return data; 
}
