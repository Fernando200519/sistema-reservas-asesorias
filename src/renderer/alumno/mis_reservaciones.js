// Mostrar el nivel de ingles en la interfaz 
const nivel = localStorage.getItem("nivelIngles");
const contenedorNivel = document.querySelector('.container-2-nivel');
if (contenedorNivel && nivel) {
    contenedorNivel.textContent = nivel;
}