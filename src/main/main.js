// main.js
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Necesario para reemplazar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true
    },
    maximized: true, // Abre la ventana maximizada
    autoHideMenuBar: true // Oculta la barra de menú
  });

  await win.loadFile(path.join(__dirname, 'index.html'));

    // Opcional: Forzar maximizado si hay algún problema
    win.maximize();

}

app.whenReady().then(() => {
  createWindow();

  // Manejo de eventos de IPC
  ipcMain.on('nuevo-horario', () => {
    console.log('Botón "Nuevo horario" clickeado');
    // Aquí podrías abrir una nueva ventana o mostrar un formulario.
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});