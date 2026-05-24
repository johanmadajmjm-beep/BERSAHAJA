const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#070e1b',
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false
  })

  mainWindow.loadFile('index_easy.html')

  function injectControls() {
    mainWindow.webContents.executeJavaScript(`
      const old = document.getElementById('__win_controls__');
      if (old) old.remove();

      let styleEl = document.getElementById('__win_style__');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = '__win_style__';
        styleEl.textContent = \`
          * {
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-rendering: optimizeLegibility !important;
            text-shadow: none !important;
          }
        \`;
        document.head.appendChild(styleEl);
      }

      const bar = document.createElement('div');
      bar.id = '__win_controls__';
      bar.style.cssText = \`
        position: fixed;
        top: 8px;
        right: 12px;
        z-index: 99999;
        display: flex;
        gap: 6px;
      \`;

      function makeBtn(label, hoverColor) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.cssText = \`
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.12);
          color: #fff;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          padding: 0;
        \`;
        btn.onmouseover = () => btn.style.background = hoverColor;
        btn.onmouseout = () => btn.style.background = 'rgba(255,255,255,0.12)';
        return btn;
      }

      const btnMin = makeBtn('–', 'rgba(255,255,255,0.3)');
      const btnMax = makeBtn('□', 'rgba(255,255,255,0.3)');
      const btnClose = makeBtn('✕', 'rgba(244,63,94,0.85)');

      btnMin.onclick = () => window.electronAPI.minimize();
      btnMax.onclick = () => window.electronAPI.maximize();
      btnClose.onclick = () => window.electronAPI.close();

      bar.appendChild(btnMin);
      bar.appendChild(btnMax);
      bar.appendChild(btnClose);
      document.body.appendChild(bar);
    `)
  }

  mainWindow.webContents.on('did-finish-load', () => {
    injectControls()
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.webContents.openDevTools()
  })
}

// Handle IPC di luar createWindow
ipcMain.on('win-minimize', () => {
  if (mainWindow) mainWindow.minimize()
})

ipcMain.on('win-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) mainWindow.unmaximize()
    else mainWindow.maximize()
  }
})

ipcMain.on('win-close', () => {
  if (mainWindow) mainWindow.close()
})

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
