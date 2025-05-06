const passwordInput = document.getElementById('contraseña');
const togglePassword = document.getElementById('toggle-password');
const form = document.querySelector('.login-form');
const mensajeError = document.getElementById('mensaje-error');

async function verificarLogin(matricula, contra) {
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
      return {exito: true, tipoUsuario: "alumno"};
    } else {
      // Credenciales inválidas
      return {exito: false};
    }

  } catch (error) {
    console.error("Error al llamar al endpoint:", error);
  }

}

togglePassword.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePassword.src = isPassword ? '../../../assets/mostrar.png' : '../../../assets/esconder.png';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value.trim();
  const contraseña = passwordInput.value.trim();

  if (usuario === '' || contraseña === '') {
    mensajeError.textContent = 'Por favor, llena todos los campos.';
    mensajeError.style.display = 'block';
    return;
  }

  verificarLogin(usuario, contraseña)
  .then(result => {
    if (result.exito) {
      if (result.tipoUsuario === 'alumno') {
        window.location.href = '../alumno/alumno.html';
      } else if (result.tipoUsuario === 'asesor') {
        window.location.href = '../alumno/asesor.html';
      } else {
        mensajeError.textContent = 'Tipo de usuario desconocido.';
        mensajeError.style.display = 'block';
      }
    } else {
      mensajeError.textContent = 'Usuario o contraseña incorrectos.';
      mensajeError.style.display = 'block';
    }
  })
  .catch (error => {
    mensajeError.textContent = 'Error al conectar con el servidor.';
    mensajeError.style.display = 'block';
    console.error(error);
  });
});