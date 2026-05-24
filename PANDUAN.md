# BERSAHAJA App — Panduan Build via GitHub Actions

## Struktur Folder

```
bersahaja-app/
├── .github/
│   └── workflows/
│       └── build.yml        ← GitHub Actions otomatis build
├── src/
│   ├── index_easy.html      ← Halaman utama dashboard
│   ├── caregiver_easy.html  ← Halaman caregiver
│   ├── oddp_easy.html       ← Halaman ODDP
│   └── styles.css           ← Stylesheet global
├── main.js                  ← Entry point Electron (.exe)
├── capacitor.config.json    ← Konfigurasi Android (.apk)
├── package.json
└── .gitignore
```

---

## Cara Upload ke GitHub & Build Otomatis

### Langkah 1 — Install Git
Download dari: https://git-scm.com/download/win  
Install dengan pengaturan default.

### Langkah 2 — Buat repository baru di GitHub
1. Buka https://github.com
2. Klik tombol **"New"** (pojok kiri atas)
3. Nama repository: `bersahaja-app`
4. Pilih **Private** (agar data aman)
5. Klik **"Create repository"**
6. **Salin URL repository** (contoh: `https://github.com/username-kamu/bersahaja-app.git`)

### Langkah 3 — Upload project dari komputer
Buka **Command Prompt** atau **Git Bash**, lalu jalankan satu per satu:

```bash
# Masuk ke folder project (sesuaikan path-nya)
cd C:\Users\NamaKamu\Downloads\bersahaja-app

# Inisialisasi git
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit - BERSAHAJA App"

# Hubungkan ke GitHub (ganti URL dengan milik kamu)
git remote add origin https://github.com/username-kamu/bersahaja-app.git

# Upload ke GitHub
git push -u origin main
```

### Langkah 4 — Pantau proses build
1. Buka repository di GitHub
2. Klik tab **"Actions"**
3. Akan muncul workflow **"Build BERSAHAJA App"** yang sedang berjalan
4. Tunggu sekitar **10–20 menit**
5. Setelah selesai (✅ hijau), klik workflow tersebut

### Langkah 5 — Download hasil build
1. Di dalam halaman workflow, scroll ke bawah ke bagian **"Artifacts"**
2. Klik **"BERSAHAJA-Windows-EXE"** → download file `.exe`
3. Klik **"BERSAHAJA-Android-APK"** → download file `.apk`

---

## Catatan Penting

- **File .exe**: Installer Windows, bisa langsung dijalankan di Windows 10/11
- **File .apk**: Debug APK, bisa diinstall di Android (aktifkan "Unknown Sources" dulu di pengaturan HP)
- Setiap kali kamu push perubahan ke GitHub, build otomatis berjalan lagi
- Artifacts tersimpan selama **30 hari** di GitHub

---

## Troubleshooting

| Masalah | Solusi |
|---|---|
| `git` tidak dikenal | Restart Command Prompt setelah install Git |
| Push ditolak | Pastikan sudah login GitHub di browser, jalankan `git config --global user.email "email@kamu.com"` |
| Build gagal di Actions | Klik workflow yang gagal, baca log errornya, hubungi developer |

---

*Dibuat otomatis untuk project BERSAHAJA*
