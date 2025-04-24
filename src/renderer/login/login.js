const passwordInput = document.getElementById('contraseña');
const togglePassword = document.getElementById('toggle-password');

togglePassword.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePassword.src = isPassword ? '../../../assets/mostrar.png' : '../../../assets/esconder.png';
});