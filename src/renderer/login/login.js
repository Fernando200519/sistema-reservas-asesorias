import { verificarLogin } from '../../database/queries.js';

const passwordInput = document.getElementById('contraseña');
const togglePassword = document.getElementById('toggle-password');
const form = document.querySelector('.login-form');
const mensajeError = document.getElementById('mensaje-error');

togglePassword.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePassword.src = isPassword ? '../../../assets/mostrar.png' : '../../../assets/esconder.png';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value.trim();
  const contraseña = passwordInput.value.trim();

  // Validación básica
  if (usuario === '' || contraseña === '') {
    mensajeError.textContent = 'Por favor, llena todos los campos.';
    mensajeError.style.display = 'block';
    return;
  }

 try {
    // Ahora usamos la función importada
    const data = await verificarLogin(usuario, contraseña);

    if (data.success) {
      const tipo = data.tipo_usuario;

      if (tipo === 'ESTUDIANTE') {
        const nivelIngles = data.curso === "INGI" ? "Inglés 1" : "Inglés 2";
        localStorage.setItem('nivelIngles', nivelIngles);
        localStorage.setItem('nombreAlumno', data.nombre);
        localStorage.setItem('matricula', usuario);
        window.location.href = '../alumno/alumno.html';
      } else if (tipo === 'ACADEMICO') {
        window.location.href = '../asesor/asesorNuevo.html';
        localStorage.setItem('nombreAsesor', data.nombre);
      } else {
        mensajeError.textContent = 'Tipo de usuario desconocido.';
        mensajeError.style.display = 'block';
      }

    } else {
      mensajeError.textContent = data.error || 'Usuario o contraseña incorrectos.';
      mensajeError.style.display = 'block';
    }

  } catch (error) {
    console.error('Error al intentar iniciar sesión:', error);
    mensajeError.textContent = 'No se pudo conectar con el servidor.';
    mensajeError.style.display = 'block';
  }
});