const { app, BrowserWindow, Menu, ipcMain } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#070e1b',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    show: false
  })

  win.loadFile('index_easy.html')

  win.once('ready-to-show', () => {
    win.show()

    // Inject tombol window controls
    win.webContents.executeJavaScript(`
      const bar = document.createElement('div');
      bar.style.cssText = \`
        position: fixed;
        top: 0;
        right: 0;
        z-index: 99999;
        display: flex;
        gap: 6px;
        padding: 8px 12px;
        -webkit-app-region: no-drag;
      \`;

      const btnMin = document.createElement('button');
      btnMin.textContent = '—';
      btnMin.style.cssText = \`
        width: 28px; height: 28px;
        border-radius: 50%;
        border: none;
        background: rgba(255,255,255,0.12);
        color: #fff;
        font-size: 13px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      \`;
      btnMin.onmouseover = () => btnMin.style.background = 'rgba(255,255,255,0.25)';
      btnMin.onmouseout = () => btnMin.style.background = 'rgba(255,255,255,0.12)';
      btnMin.onclick = () => require('electron').ipcRenderer.send('minimize');

      const btnMax = document.createElement('button');
      btnMax.textContent = '⛶';
      btnMax.style.cssText = btnMin.style.cssText;
      btnMax.onmouseover = () => btnMax.style.background = 'rgba(255,255,255,0.25)';
      btnMax.onmouseout = () => btnMax.style.background = 'rgba(255,255,255,0.12)';
      btnMax.onclick = () => require('electron').ipcRenderer.send('maximize');

      const btnClose = document.createElement('button');
      btnClose.textContent = '✕';
      btnClose.style.cssText = btnMin.style.cssText;
      btnClose.onmouseover = () => btnClose.style.background = 'rgba(244,63,94,0.7)';
      btnClose.onmouseout = () => btnClose.style.background = 'rgba(255,255,255,0.12)';
      btnClose.onclick = () => require('electron').ipcRenderer.send('close');

      bar.appendChild(btnMin);
      bar.appendChild(btnMax);
      bar.appendChild(btnClose);
      document.body.appendChild(bar);
    `)
  })

  ipcMain.on('minimize', () => win.minimize())
  ipcMain.on('maximize', () => {
    if (win.isMaximized()) win.unmaximize()
    else win.maximize()
  })
  ipcMain.on('close', () => win.close())
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
