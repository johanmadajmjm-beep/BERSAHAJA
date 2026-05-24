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
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    },
    show: false
  })

  win.loadFile('index_easy.html')

  win.once('ready-to-show', () => {
    win.show()

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
      \`;

      function makeBtn(label, hoverColor) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.cssText = \`
          width: 28px; height: 28px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.12);
          color: #fff;
          font-size: 13px;
          cursor: pointer;
        \`;
        btn.onmouseover = () => btn.style.background = hoverColor;
        btn.onmouseout = () => btn.style.background = 'rgba(255,255,255,0.12)';
        return btn;
      }

      const btnMin = makeBtn('—', 'rgba(255,255,255,0.25)');
      const btnMax = makeBtn('⛶', 'rgba(255,255,255,0.25)');
      const btnClose = makeBtn('✕', 'rgba(244,63,94,0.8)');

      btnMin.onclick = () => window.electronAPI && window.electronAPI.minimize();
      btnMax.onclick = () => window.electronAPI && window.electronAPI.maximize();
      btnClose.onclick = () => window.electronAPI && window.electronAPI.close();

      bar.appendChild(btnMin);
      bar.appendChild(btnMax);
      bar.appendChild(btnClose);
      document.body.appendChild(bar);
    `)
  })

  ipcMain.on('win-minimize', () => win.minimize())
  ipcMain.on('win-maximize', () => {
    if (win.isMaximized()) win.unmaximize()
    else win.maximize()
  })
  ipcMain.on('win-close', () => win.close())
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
