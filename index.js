const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeCacheableSignalKeyStore 
} = require('@whiskeysockets/baileys')

const { Boom } = require('@hapi/boom')
const pino = require('pino')
const config = require('./config')

const { runtime, getWIBTime, showBanner, logSuccess } = require('./display')
const { printLog } = require('./log')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const { version } = await fetchLatestBaileysVersion()

    showBanner(config.botName, config.ownerName)

    const sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
        },
        printQRInTerminal: config.pairingMethod === 'qr',
        logger: pino({ level: 'fatal' }),
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect =
                (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            if (shouldReconnect) startBot()
        } else if (connection === 'open') {
            logSuccess(`${config.botName} Berhasil Terhubung ke Server!`)
        }
    })

    // ================= WELCOME MESSAGE SYSTEM (LID FIX) =================
    sock.ev.on('group-participants.update', async (anu) => {
        console.log("GROUP UPDATE DETECTED:", anu)

        try {
            if (anu.action !== 'add') return

            const metadata = await sock.groupMetadata(anu.id)

            for (let user of anu.participants) {

                // FIX LID → ambil phoneNumber kalau ada
                let jid = user.phoneNumber 
                    ? user.phoneNumber 
                    : user.id.includes('@s.whatsapp.net')
                        ? user.id
                        : null

                if (!jid) continue

                let ppuser
                try {
                    ppuser = await sock.profilePictureUrl(jid, 'image')
                } catch {
                    ppuser = 'https://files.catbox.moe/zt1r7j.jpg'
                }

                const welcomeText =
`Halo @${jid.split("@")[0]} 👋

Selamat datang di grup *${metadata.subject}*

Semoga betah di komunitas *BloodSword* dan jangan lupa baca deskripsi grup ya! ⚔️`

                await sock.sendMessage(anu.id, {
                    text: welcomeText,
                    mentions: [jid],
                    contextInfo: {
                        externalAdReply: {
                            title: 'WELCOME NEW MEMBER',
                            body: `Member ke-${metadata.participants.length}`,
                            thumbnailUrl: ppuser,
                            sourceUrl: 'https://whatsapp.com/channel/0029Va7gIOyBKfi4aw2cYy24',
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                })
            }

        } catch (err) {
            console.log("WELCOME ERROR:", err)
        }
    })

    // ================= MESSAGE HANDLER =================
    sock.ev.on('messages.upsert', async (m) => {
        try {
            const msg = m.messages[0]
            if (!msg.message || msg.key.fromMe) return

            const from = msg.key.remoteJid
            const pushName = msg.pushName || "Guest"
            const type = Object.keys(msg.message)[0]

            let body = type === 'conversation' ? msg.message.conversation :
                       type === 'extendedTextMessage' ? msg.message.extendedTextMessage.text :
                       type === 'imageMessage' ? msg.message.imageMessage.caption :
                       type === 'videoMessage' ? msg.message.videoMessage.caption : ''

            if (!body) return

            printLog(type, from, pushName, body)

            const prefix = '!'
            if (!body.startsWith(prefix)) return

            const args = body.slice(prefix.length).trim().split(/ +/)
            const command = args.shift().toLowerCase()

            const isGroup = from.endsWith('@g.us')
            const sender = msg.key.participant || msg.key.remoteJid
            
            let isAdmins = false
            let isOwner = sender.split('@')[0] === config.ownerNumber

            if (isGroup) {
                try {
                    const groupMetadata = await sock.groupMetadata(from)
                    const participants = groupMetadata.participants
                    const adminList = participants.filter(p => p.admin !== null).map(p => p.id)
                    isAdmins = adminList.includes(sender)
                } catch { isAdmins = false }
            }

            const getTarget = () => {
                let mention = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || []
                let reply = msg.message.extendedTextMessage?.contextInfo?.participant
                    ? [msg.message.extendedTextMessage.contextInfo.participant]
                    : []
                return mention.length > 0 ? mention : reply
            }

            switch (command) {
                case 'ping':
                    await sock.sendMessage(from, { text: 'Bot aktif.' })
                    break

                case 'menu':
                case 'help': {
                    const uptimeText = runtime(process.uptime())
                    const timeNow = getWIBTime()

                    const menuEstetik = `╔═══━━━━━━─── • ───━━━━━━═══╗
║     『 ⚔️ *${config.botName.toUpperCase()}* ⚔️ 』
╠═══━━━━━━─── • ───━━━━━━═══╝
║
║ ❀ *Creator* : ${config.ownerName}
║ ❀ *Time* : ${timeNow}
║ ❀ *Runtime* : ${uptimeText}
║
╠═══━━━━━━─── • ───━━━━━━═══╗
║           *LIST FEATURES*
╠═══━━━━━━─── • ───━━━━━━═══╝
║ ❀ !ping
║ ❀ !runtime
║ ❀ !owner
║ ❀ !read
║ ❀ !help
║ ❀ !kick / !promote / !demote
╚═══━━━━━━─── • ───━━━━━━═══╝`

                    await sock.sendMessage(from, { text: menuEstetik })
                    break
                }

                case 'kick': {
                    if (!isGroup) return await sock.sendMessage(from, { text: '❌ Hanya bisa di grup!' })
                    if (!isAdmins && !isOwner) return await sock.sendMessage(from, { text: '❌ Kamu bukan Admin!' })
                    let target = getTarget()
                    if (target.length === 0) return await sock.sendMessage(from, { text: 'Tag atau reply orangnya!' })
                    
                    await sock.groupParticipantsUpdate(from, target, "remove")
                    await sock.sendMessage(from, { text: 'Berhasil dikeluarkan 👋' })
                    break
                }

                case 'promote': {
                    if (!isGroup) return await sock.sendMessage(from, { text: '❌ Hanya bisa di grup!' })
                    if (!isAdmins && !isOwner) return await sock.sendMessage(from, { text: '❌ Kamu bukan Admin!' })
                    let target = getTarget()
                    if (target.length === 0) return await sock.sendMessage(from, { text: 'Tag atau reply orangnya!' })
                    
                    await sock.groupParticipantsUpdate(from, target, "promote")
                    await sock.sendMessage(from, { text: 'Sekarang dia jadi Admin 👑' })
                    break
                }

                case 'demote': {
                    if (!isGroup) return await sock.sendMessage(from, { text: '❌ Hanya bisa di grup!' })
                    if (!isAdmins && !isOwner) return await sock.sendMessage(from, { text: '❌ Kamu bukan Admin!' })
                    let target = getTarget()
                    if (target.length === 0) return await sock.sendMessage(from, { text: 'Tag atau reply orangnya!' })
                    
                    await sock.groupParticipantsUpdate(from, target, "demote")
                    await sock.sendMessage(from, { text: 'Jabatan admin dicabut 📉' })
                    break
                }

                case 'owner': {
                    const vcard = 'BEGIN:VCARD\nVERSION:3.0\n' +
                                  `FN:${config.ownerName}\n` +
                                  `TEL;type=CELL;type=VOICE;waid=${config.ownerNumber}:+${config.ownerNumber}\n` +
                                  'END:VCARD'
                    await sock.sendMessage(from, { 
                        contacts: { displayName: config.ownerName, contacts: [{ vcard }] } 
                    })
                    break
                }

                case 'runtime':
                    await sock.sendMessage(from, { 
                        text: `🚀 Bot sudah aktif selama:\n${runtime(process.uptime())}` 
                    })
                    break

                case 'read':
                    await sock.readMessages([msg.key])
                    await sock.sendMessage(from, { text: 'Chat ini telah ditandai sebagai dibaca ✅' })
                    break
            }

        } catch (err) {
            console.log("ERROR MESSAGE:", err)
        }
    })
}

startBot()
