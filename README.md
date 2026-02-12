⚔️ BloodSword Bot V2.1

BloodSword Bot V2.1 adalah WhatsApp Bot berbasis Baileys (WhiskeySockets) dengan sistem admin grup, welcome message otomatis, prefix command system (!), serta tampilan terminal estetik dan modular. Bot ini dibuat untuk kebutuhan personal maupun komunitas.

🚀 Features

!ping

!runtime

!owner

!read

!help / !menu

!kick

!promote

!demote

Welcome Message Otomatis

Admin Detection System

Colored Terminal Log

Pairing QR & Pairing Code

🛠 Tech Stack

Node.js

Baileys (WhiskeySockets)

Pino Logger

Multi File Auth State

ANSI Terminal Styling

📦 Installation (Termux / VPS / Windows)
1. Install Dependencies

Termux:

pkg update && pkg upgrade
pkg install nodejs git


Windows:
Install Node.js dari https://nodejs.org

2. Clone Repository
git clone https://github.com/demongki/basebot2_1.git
cd basebot2_1

3. Install Module
npm install

4. Jalankan Bot
node index.js


Scan QR atau gunakan pairing sesuai konfigurasi.

⚙️ Configuration

Edit file config.js

const config = {
    ownerNumber: '628xxxxxxxxxx',
    ownerName: 'Nama Kamu',
    botName: 'BloodSword Bot',
    pairingMethod: 'qr' // 'qr' atau 'pairing'
}

module.exports = config

👑 Command Usage

!ping → Cek bot aktif
!runtime → Lama bot berjalan
!owner → Kirim kontak owner
!read → Tandai chat sebagai dibaca
!kick @user → Keluarkan member
!promote @user → Jadikan admin
!demote @user → Hapus admin

🔐 Admin Requirement

Untuk menggunakan fitur !kick, !promote, dan !demote:

Bot harus menjadi Admin grup

User yang menjalankan perintah harus Admin

🖥 Terminal System

BloodSword Bot memiliki:

Banner ASCII saat startup

Log pesan masuk

Status koneksi realtime

Success & error indicator

🛡 License

MIT License
Bebas digunakan dan dikembangkan kembali.

👑 Creator

Achmad Zakky Anwar
BloodSword Bot V2.1
Powered by Baileys Socket
2026 ⚔️
