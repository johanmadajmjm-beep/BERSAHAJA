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

      const oldConfirm = document.getElementById('__win_confirm__');
      if (oldConfirm) oldConfirm.remove();

      let styleEl = document.getElementById('__win_style__');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = '__win_style__';
        styleEl.textContent = \`
          * {
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-rendering: geometricPrecision !important;
            text-shadow: none !important;
            filter: none !important;
          }
          h1,h2,h3,h4,h5,h6,p,span,div,a,td,th,label,button {
            text-shadow: none !important;
            filter: none !important;
          }
          #__win_confirm__ {
            filter: none !important;
          }
        \`;
        document.head.appendChild(styleEl);
      }

      // ── Tombol controls ──
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
          width: 28px; height: 28px;
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
          text-shadow: none !important;
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

      // ── Dialog konfirmasi close ──
      const confirmBox = document.createElement('div');
      confirmBox.id = '__win_confirm__';
      confirmBox.style.cssText = \`
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(7,14,27,0.85);
        z-index: 999999;
        align-items: center;
        justify-content: center;
      \`;

      const confirmCard = document.createElement('div');
      confirmCard.style.cssText = \`
        background: #0c1625;
        border: 1px solid #1b2e4a;
        border-radius: 16px;
        padding: 28px 32px;
        text-align: center;
        min-width: 280px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      \`;

      confirmCard.innerHTML = \`
        <div style="font-size:28px;margin-bottom:12px">👋</div>
        <div style="font-size:15px;font-weight:600;color:#fff;margin-bottom:6px">Keluar dari BERSAHAJA?</div>
        <div style="font-size:12px;color:#7090b8;margin-bottom:20px">Pastikan data kamu sudah tersimpan.</div>
        <div style="display:flex;gap:10px;justify-content:center">
          <button id="__btn_cancel__" style="
            padding: 8px 22px;
            border-radius: 8px;
            border: 1px solid #1b2e4a;
            background: #111e33;
            color: #7090b8;
            font-size: 12px;
            cursor: pointer;
            font-weight: 600;
          ">Batal</button>
          <button id="__btn_confirm__" style="
            padding: 8px 22px;
            border-radius: 8px;
            border: none;
            background: #f43f5e;
            color: #fff;
            font-size: 12px;
            cursor: pointer;
            font-weight: 600;
          ">Ya, Keluar</button>
        </div>
      \`;

      confirmBox.appendChild(confirmCard);
      document.body.appendChild(confirmBox);

      btnClose.onclick = () => {
        confirmBox.style.display = 'flex';
      };

      document.getElementById('__btn_cancel__') && 
        document.getElementById('__btn_cancel__').addEventListener('click', () => {
          confirmBox.style.display = 'none';
        });

      document.getElementById('__btn_confirm__') &&
        document.getElementById('__btn_confirm__').addEventListener('click', () => {
          window.electronAPI.close();
        });

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
  })
}

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

  app.on('browser-window-created', (_, window) => {
    window.webContents.on('before-input-event', (event, input) => {
      if (input.control && input.shift && input.key === 'I') {
        window.webContents.openDevTools()
      }
    })
  })

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
