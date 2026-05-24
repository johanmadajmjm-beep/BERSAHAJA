const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')

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
      webSecurity: false,
      preload: path.join(app.getAppPath(), 'preload.js')
    },
    show: false
  })

  win.loadFile('index_easy.html')

  // Fungsi inject tombol — dipanggil setiap kali halaman selesai load
  function injectControls() {
    win.webContents.executeJavaScript(`
      // Hapus tombol lama kalau ada
      const old = document.getElementById('__win_controls__');
      if (old) old.remove();

      // Fix font rendering
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

      // Buat tombol controls
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

  // Inject setiap kali halaman selesai load (termasuk pindah halaman)
  win.webContents.on('did-finish-load', () => {
    injectControls()
  })

  win.once('ready-to-show', () => {
    win.show()
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
