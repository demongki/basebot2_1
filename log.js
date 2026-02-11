// log.js
const color = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m"
};

const printLog = (type, sender, pushname, body) => {
    const time = new Date().toLocaleTimeString();
    const shortID = sender.split('@')[0];
    const cleanType = type.replace('Message', '').toUpperCase();

    console.log(`${color.bold}${color.cyan}┌──────────────────────────────────────────────────────────┐${color.reset}`);
    console.log(`${color.bold}${color.cyan}│${color.reset} ${color.bgGreen}${color.white} INCOMING MESSAGE ${color.reset} ${color.yellow}[${time}]${color.reset}                ${color.bold}${color.cyan}│${color.reset}`);
    console.log(`${color.bold}${color.cyan}├──────────────────────────────────────────────────────────┤${color.reset}`);
    console.log(`${color.bold}${color.cyan}│${color.reset} ${color.blue}FROM    :${color.reset} ${color.bold}${pushname}${color.reset} (${color.green}${shortID}${color.reset})`);
    console.log(`${color.bold}${color.cyan}│${color.reset} ${color.blue}TYPE    :${color.reset} ${color.magenta}${cleanType}${color.reset}`);
    console.log(`${color.bold}${color.cyan}│${color.reset} ${color.blue}MESSAGE :${color.reset} ${color.white}${body}${color.reset}`);
    console.log(`${color.bold}${color.cyan}└──────────────────────────────────────────────────────────┘${color.reset}\n`);
};

module.exports = { printLog };
