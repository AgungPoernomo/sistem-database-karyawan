# Struktur Project: SISTEM-DATABASE-KARYAWAN

```text
SISTEM-DATABASE-KARYAWAN/
├── pages // Kumpulan file antarmuka (UI/UX) HTML
│   ├── activity-log.html
│   ├── dashboard.html
│   ├── data-karyawan.html
│   ├── plotting-area.html
│   └── recovery.html
├── public
│   ├── assets // Aset statis seperti gambar, ikon, dan font
│   │   └── logo-satoria.png
│   ├── favicon.svg
│   └── icons.svg
├── src // Folder utama source code aplikasi
│   ├── assets // Aset statis seperti gambar, ikon, dan font
│   │   ├── hero.png
│   │   ├── javascript.svg
│   │   └── vite.svg
│   ├── components
│   │   ├── activity
│   │   │   └── ActivityTable.js
│   │   ├── dashboard
│   │   │   ├── DataTable.js
│   │   │   ├── ModalEngine.js
│   │   │   ├── StatsCards.js
│   │   │   └── TopModules.js
│   │   ├── dataKaryawan
│   │   │   ├── DataTable.js
│   │   │   └── EmployeeModal.js
│   │   ├── plotting
│   │   │   ├── areaoutdoor
│   │   │   │   └── OutdoorEngine.js
│   │   │   ├── cleaningmachine
│   │   │   │   └── MachineEngine.js
│   │   │   ├── cleaningroom
│   │   │   │   └── RoomEngine.js
│   │   │   ├── PlottingEngine.js
│   │   │   └── PlottingModals.js
│   │   └── recovery
│   │       ├── RecoveryModals.js
│   │       └── RecoveryTable.js
│   ├── config // Konfigurasi sistem (API, Variabel Global)
│   │   └── api.js
│   ├── layouts
│   │   └── AppLayout.js
│   ├── pages // Kumpulan file antarmuka (UI/UX) HTML
│   │   ├── plottingarea
│   │   │   ├── mainPlottingOrchestrator.js
│   │   │   ├── plottingMachineController.js
│   │   │   ├── plottingOutdoorController.js
│   │   │   └── plottingRoomController.js
│   │   ├── activityLogController.js
│   │   ├── dashboardController.js
│   │   ├── dataKaryawanController.js
│   │   └── recoveryController.js
│   ├── services
│   │   └── employeeService.js
│   ├── utils
│   │   └── security.js
│   ├── main.js
│   └── style.css
├── .gitignore
├── index.html // Halaman utama (Pintu masuk / Login System)
├── package.json // Konfigurasi project Node.js dan dependensi
├── PROJECT_MAP.md // Dokumentasi struktur project (Auto-generated)
└── vite.config.js

```

*Terakhir diperbarui pada: 3/5/2026, 17.12.16 WIB*