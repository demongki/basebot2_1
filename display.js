// display.js

// 1. Daftar Warna (ANSI Codes) untuk tampilan Terminal
const color = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    reset: "\x1b[0m",
    bold: "\x1b[1m"
};

/**
 * Mengonversi detik menjadi format waktu yang estetik
 * @param {number} seconds 
 * @returns {string}
 */
const runtime = (seconds) => {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    
    var dDisplay = d > 0 ? d + " Hari 🌞, " : "";
    var hDisplay = h > 0 ? h + " Jam 🕒, " : "";
    var mDisplay = m > 0 ? m + " Menit ⏳, " : "";
    var sDisplay = s > 0 ? s + " Detik ⚡" : s + " Detik ⚡";
    
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

/**
 * Mendapatkan waktu saat ini dalam format WIB
 * @returns {string}
 */
const getWIBTime = () => {
    const offset = 7; // WIB adalah UTC+7
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const wibDate = new Date(utc + (3600000 * offset));
    
    const hours = wibDate.getHours().toString().padStart(2, '0');
    const minutes = wibDate.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes} WIB`;
}

/**
 * Menampilkan Banner ASCII Art "BLOODSWORD" saat bot dijalankan
 * @param {string} botName 
 * @param {string} ownerName 
 */
const showBanner = (botName, ownerName) => {
    console.clear(); 
    const bannerASCII = `
${color.red}${color.bold}
██████╗ ██╗      ██████╗  ██████╗ ██████╗ 
██╔══██╗██║     ██╔═══██╗██╔═══██╗██╔══██╗
██████╔╝██║     ██║   ██║██║   ██║██║  ██║
██╔══██╗██║     ██║   ██║██║   ██║██║  ██║
██████╔╝███████╗╚██████╔╝╚██████╔╝██████╔╝
╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝ 
███████╗██╗    ██╗ ██████╗ ██████╗ ██████╗
██╔════╝██║    ██║██╔═══██╗██╔══██╗██╔══██╗
███████╗██║ █╗ ██║██║   ██║██████╔╝██║  ██║
╚════██║██║███╗██║██║   ██║██╔══██╗██║  ██║
███████║╚███╔███╔╝╚██████╔╝██║  ██║██████╔╝
╚══════╝ ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═════╝
${color.reset}
    ${color.yellow}⚔️  ${botName.toUpperCase()} IS ACTIVE ⚔️${color.reset}
`;

    console.log(bannerASCII);
    console.log(`${color.cyan}==========================================${color.reset}`);
    console.log(`${color.green}[+] CREATOR  : ${color.white}${ownerName}${color.reset}`);
    console.log(`${color.green}[+] VERSION  : ${color.white}2.1.0 (BloodSword Edition)${color.reset}`);
    console.log(`${color.green}[+] LIBRARY  : ${color.white}Baileys (Socket)${color.reset}`);
    console.log(`${color.green}[+] TIME     : ${color.white}${getWIBTime()}${color.reset}`);
    console.log(`${color.cyan}==========================================${color.reset}\n`);
}

/**
 * Log pesan masuk dengan tampilan yang berwarna dan informatif
 */
const logChat = (type, sender, pushname, body) => {
    const time = new Date().toLocaleTimeString();
    console.log(
        `${color.cyan}[${time}] ` +
        `${color.magenta}[${type}] ` +
        `${color.green}${pushname || "Guest"} ` +
        `${color.white}(${sender.split('@')[0]}) ` +
        `${color.yellow}>> ` +
        `${color.reset}${body}`
    );
}

const logSuccess = (text) => {
    console.log(`${color.green}${color.bold}[SUCCESS]${color.reset} ${text}`);
}

const logError = (text) => {
    console.log(`${color.red}${color.bold}[ERROR]${color.reset} ${text}`);
}

module.exports = { 
    runtime, 
    getWIBTime, 
    showBanner, 
    logChat, 
    logSuccess, 
    logError 
};
