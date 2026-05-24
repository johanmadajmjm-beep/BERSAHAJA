const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'BERSAHAJA',
    backgroundColor: '#070e1b',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    },
    show: false
  })

  // Load halaman utama
  win.loadFile(path.join(__dirname, 'src', 'index_easy.html'))

  // Tampilkan window setelah siap (hindari flash putih)
  win.once('ready-to-show', () => {
    win.show()
  })

  // Buka link eksternal di browser, bukan di Electron
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

// Menu sederhana
const menuTemplate = [
  {
    label: 'BERSAHAJA',
    submenu: [
      { label: 'Dashboard Utama', click: (_, win) => win.loadFile(path.join(__dirname, 'src', 'index_easy.html')) },
      { label: 'ODDP', click: (_, win) => win.loadFile(path.join(__dirname, 'src', 'oddp_easy.html')) },
      { label: 'Caregiver', click: (_, win) => win.loadFile(path.join(__dirname, 'src', 'caregiver_easy.html')) },
      { type: 'separator' },
      { label: 'Keluar', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
    ]
  },
  {
    label: 'Tampilan',
    submenu: [
      { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
      { label: 'Zoom In', accelerator: 'CmdOrCtrl+=', role: 'zoomIn' },
      { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
      { label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
      { type: 'separator' },
      { label: 'Layar Penuh', accelerator: 'F11', role: 'togglefullscreen' }
    ]
  }
]

app.whenReady().then(() => {
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
