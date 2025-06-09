const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    },
  });

  mainWindow.maximize();
  mainWindow.loadFile(path.join(__dirname, '../renderer/login/login.html'));
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Manejo de impresión
ipcMain.on('print-content', (event, contenidoHTML) => {
  const printWindow = new BrowserWindow({ show: false });
  printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(contenidoHTML)}`);

  printWindow.webContents.once('did-finish-load', () => {
    printWindow.webContents.print();
  });
});