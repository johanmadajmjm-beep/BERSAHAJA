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
      webSecurity: false
    },
    show: false
  })

  const indexPath = path.join(app.getAppPath(), 'src', 'index_easy.html')
  win.loadFile(indexPath)

  win.once('ready-to-show', () => {
    win.show()
  })

  win.webContents.on('did-fail-load', () => {
    win.loadURL('data:text/html,<h1 style="color:white;background:#070e1b;padding:40px">Loading...</h1>')
  })
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
