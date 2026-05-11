

        case 'музыка': case 'play':
          if (!isReg) return enviar(respuesta.registro)
          if (!q) return enviar('❌ Введите название\nПример: #музыка believer')
          enviar('🔍 Ищу...')
          try {
            const yts = require('yt-search')
            const fetch = require('node-fetch')
            let { videos } = await yts(q)
            if (!videos || videos.length === 0) return enviar('❌ Не найдено')
            let video = videos[0]
            const apis = [
              `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(video.url)}`,
              `https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${encodeURIComponent(video.url)}`,
              `https://exonity.tech/api/dl/playmp3?query=${encodeURIComponent(video.title)}`,
              `https://api.dorratz.com/v3/ytdl?url=${encodeURIComponent(video.url)}`
            ]
            let audioUrl = ''
            for (let api of apis) {
              try { let r = await fetch(api).then(r => r.json()); audioUrl = r?.dl || r?.result?.download?.url || r?.result?.download || r?.data?.url || r?.medias?.[0]?.url || ''; if (audioUrl) break } catch(e) {}
            }
            if (audioUrl) {
              let thumb = video.thumbnail || ''
              let title = video.title || ''
              let author = video.author?.name || ''
              let duration = video.timestamp || ''
              let views = video.views || ''
              await sock.sendMessage(from, { image: { url: thumb }, caption: `🎵 *${title}*\n👤 ${author}\n⏱ ${duration}\n👁 ${views}` }, { quoted: info })
              await sock.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mpeg', ptt: false }, { quoted: info })
            } else { enviar('❌ Все API недоступны') }
          } catch(e) { enviar('❌ Ошибка') }
          break

        case 'реакции': case 'reactions':
          if (!isGroupAdmins) return enviar(respuesta.admin)
          const reactPath = './settings/Grupo/Json/reactions.json'
          let reactData = fs.existsSync(reactPath) ? JSON.parse(fs.readFileSync(reactPath)) : { activo: false, grupos: [] }
          if (!reactData.grupos) reactData.grupos = []
          if (args[0] === 'включить' || args[0] === 'on') { if (reactData.grupos.includes(from)) return enviar('Уже включено'); reactData.grupos.push(from); fs.writeFileSync(reactPath, JSON.stringify(reactData)); enviar('✅ Реакции включены') }
          else if (args[0] === 'выключить' || args[0] === 'off') { if (!reactData.grupos.includes(from)) return enviar('Уже выключено'); reactData.grupos = reactData.grupos.filter(g => g !== from); fs.writeFileSync(reactPath, JSON.stringify(reactData)); enviar('❌ Реакции выключены') }
          else { const st = reactData.grupos.includes(from) ? '✅ Вкл' : '❌ Выкл'; enviar(`Реакции: ${st}`) }
          break

        case 'гороскоп': case 'horoscope':
          if (!q) return enviar('❌ Введите знак\nПример: #гороскоп овен')
          const signs = {
            'овен': '♈ Сегодня Овнам стоит быть решительнее.',
            'телец': '♉ Тельцам сегодня повезёт в делах.',
            'близнецы': '♊ Близнецы, будьте осторожны с обещаниями.',
            'рак': '♋ Ракам сегодня стоит отдохнуть.',
            'лев': '♌ Львы сегодня в центре внимания!',
            'дева': '♍ Девам сегодня лучше заняться уборкой.',
            'весы': '♎ Весы, сегодня день гармонии.',
            'скорпион': '♏ Скорпионам сегодня откроется тайна.',
            'стрелец': '♐ Стрельцы, отличный день для путешествий!',
            'козерог': '♑ Козерогам сегодня стоит заняться финансами.',
            'водолей': '♒ Водолеям сегодня придёт гениальная идея.',
            'рыбы': '♓ Рыбам сегодня снятся вещие сны.'
          }
          let sign = q.toLowerCase()
          if (signs[sign]) enviar(signs[sign])
          else enviar('❌ Знак не найден.\n♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓')
          break

        case 'мойид': case 'myid':
          enviar(`Твой ID: ${sender}`)
          break

        case 'чистить': case 'cleartmp':
          if (!isOwner) return enviar(respuesta.miowner)
          let deleted = 0
          for (let dir of ['./tmp', './temp']) {
            if (fs.existsSync(dir)) {
              try { const files = fs.readdirSync(dir); for (const f of files) { try { fs.unlinkSync(dir + '/' + f); deleted++ } catch(e) {} } } catch(e) {}
            }
          }
          enviar(`✅ Очищено ${deleted} файлов`)
          break

        case 'характер': case 'character':
          if (!isGroup) return enviar('👥 Только в группах')
          let target = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || info.message?.extendedTextMessage?.contextInfo?.participant
          if (!target) return enviar('❌ Упомяните кого-то\nПример: #характер @user')
          let traits = ['Умный', 'Креативный', 'Решительный', 'Заботливый', 'Харизматичный', 'Энергичный', 'Дружелюбный', 'Щедрый', 'Честный', 'Верный', 'Оптимистичный', 'Мудрый']
          let selected = []; for (let i = 0; i < 3; i++) { let t = traits[Math.floor(Math.random() * traits.length)]; if (!selected.includes(t)) selected.push(t) }
          let result = selected.map(t => `${t}: ${Math.floor(Math.random() * 41) + 60}%`).join('\n')
          let photo; try { photo = await sock.profilePictureUrl(target, 'image') } catch { photo = 'https://i.imgur.com/2wzGhpF.jpeg' }
          await sock.sendMessage(from, { image: { url: photo }, caption: `🔮 *Анализ характера*\n\n👤 @${target.split('@')[0]}\n\n${result}`, mentions: [target] }, { quoted: info })
          break

        case 'тествладельца': case 'testowner':
          let ownerList = owner.includes(',') ? owner.split(',') : [owner]
          let isOwnerTest = ownerList.some(o => sender.includes(o))
          enviar(`📋 *Информация*\n\n👤 Ваш номер: ${sender.split('@')[0]}\n👑 Владельцы: ${ownerList.join(', ')}\n✅ Вы владелец: ${isOwnerTest ? '✅ Да' : '❌ Нет'}`)
          break

        case 'предупреждение': case 'warn':
          if (!isGroup) return enviar('👥 Только в группах')
          if (!isGroupAdmins) return enviar(respuesta.admin)
          let tgt = obtenerMencionado(info)
          if (!tgt) return enviar('❌ Упомяните участника\nПример: #предупреждение @user')
          if (!global.warns) global.warns = {}
          if (!global.warns[from]) global.warns[from] = {}
          if (!global.warns[from][tgt]) global.warns[from][tgt] = 0
          global.warns[from][tgt]++
          let cw = global.warns[from][tgt]
          if (cw >= 3) {
            try { await sock.groupParticipantsUpdate(from, [tgt], 'remove'); await sock.sendMessage(from, { text: `🚫 @${tgt.split('@')[0]} удалён (${cw}/3)`, mentions: [tgt] }, { quoted: info }); delete global.warns[from][tgt] } catch(e) { await sock.sendMessage(from, { text: `⚠️ @${tgt.split('@')[0]} предупреждение ${cw}/3`, mentions: [tgt] }, { quoted: info }) }
          } else {
            await sock.sendMessage(from, { text: `⚠️ @${tgt.split('@')[0]} предупреждение ${cw}/3`, mentions: [tgt] }, { quoted: info })
          }
          break

        case 'антиудаление': case 'antidelete':
          if (!isGroupAdmins) return enviar(respuesta.admin)
          if (!global.antiDel) global.antiDel = {}
          if (args[0] === 'включить' || args[0] === 'on') {
            global.antiDel[from] = true
            enviar('✅ Антиудаление включено. Удалённые сообщения пересылаются владельцу.')
          } else if (args[0] === 'выключить' || args[0] === 'off') {
            delete global.antiDel[from]
            enviar('❌ Антиудаление выключено.')
          } else {
            let st = global.antiDel[from] ? '✅ Вкл' : '❌ Выкл'
            enviar(`Антиудаление: ${st}\n• антиудаление включить\n• антиудаление выключить`)
          }
          break

        default: {
          // АНТИССЫЛКА 1 — с предупреждениями (3 ссылки = кик)
          if (isGroup && isAntiLink && !isOwner) {
            const lt1 = (budy || '').toLowerCase()
            if (lt1.includes('.com') || lt1.includes('http://') || lt1.includes('https://')) {
              try { await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } }) } catch(e) {}
              if (!global.linkWarns) global.linkWarns = {}
              if (!global.linkWarns[from]) global.linkWarns[from] = {}
              if (!global.linkWarns[from][sender]) global.linkWarns[from][sender] = 0
              global.linkWarns[from][sender]++
              let warns = global.linkWarns[from][sender]
              if (warns >= 3) {
                try {
                  const { jidNormalizedUser } = require('baileys')
                  await sock.groupParticipantsUpdate(from, [jidNormalizedUser(sender)], 'remove')
                  await enviar(`🚫 @${sender.split('@')[0]} удалён за ссылки (${warns}/3)`, { mentions: [sender] })
                  delete global.linkWarns[from][sender]
                } catch(e) { await enviar(`⚠️ @${sender.split('@')[0]} ссылки запрещены! (${warns}/3) Бот не админ.`, { mentions: [sender] }) }
              } else {
                await enviar(`⚠️ @${sender.split('@')[0]} ссылки запрещены! Предупреждение ${warns}/3`, { mentions: [sender] })
              }
            }
          }
          // АНТИССЫЛКА 2 — сразу кик
          const al2Path2 = './settings/Grupo/Json/antilink2.json'
          if (isGroup && fs.existsSync(al2Path2)) {
            const al2Data = JSON.parse(fs.readFileSync(al2Path2))
            if (al2Data.includes(from)) {
              const lt2 = (budy || '').toLowerCase()
              if (lt2.includes('.com') || lt2.includes('http://') || lt2.includes('https://')) {
                try { await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } }) } catch(e) {}
                try {
                  const { jidNormalizedUser } = require('baileys')
                  await sock.groupParticipantsUpdate(from, [jidNormalizedUser(sender)], 'remove')
                  await enviar(`🚫 @${sender.split('@')[0]} удалён за ссылку`, { mentions: [sender] })
                } catch(e) { await enviar(`⚠️ @${sender.split('@')[0]} отправил ссылку! Бот не админ.`, { mentions: [sender] }) }
              }
            }
          }
          if (budy.startsWith('=>Duueño') && isOwner) {
            try { enviar(util.format(eval(`(async () => { return ${budy.slice(3)} })()`))) } catch (e) { enviar(String(e)) }
          }
        }
      }
    } catch (e) { if (!e.message?.includes('zero') && !e.message?.includes('MIME') && !e.message?.includes('conversation')) console.log('Error:', color(e.message, 'red')) }
  })
}
startProo()// NaufraBot - Полная версия (финальная)
const { default: makeWASocket, DisconnectReason, makeCacheableSignalKeyStore, useMultiFileAuthState, fetchLatestBaileysVersion, downloadContentFromMessage, jidDecode, proto } = require("baileys")
const fs = require('fs')
const { Boom } = require('@hapi/boom')
const NodeCache = require("node-cache")
const readline = require("readline")
const cfonts = require('cfonts');
const pino = require('pino')
const util = require("util")
const speed = require("performance-now");
const { exec } = require("child_process")
const chalk = require('chalk')
const color = (text, color) => { return !color ? chalk.green(text) : chalk.keyword(color)(text) };
const { fetchJson } = require('./fuction/download/gets.js')
const { sendImageAsSticker, sendVideoAsSticker } = require('./fuction/sticker/rename.js');
const { MoneyOfSender, addkoin, delkoin, AddReg, checkOfReg, addXp, xpOfsender, Rxp } = require('./settings/Grupo/Js/reg.js')
const Menu = require('./settings/Bot/Js/menu.js')
const welkom = JSON.parse(fs.readFileSync('./settings/Grupo/Json/welkom.json'))
const antilink = JSON.parse(fs.readFileSync('./settings/Grupo/Json/antilink.json'))
const bngp = JSON.parse(fs.readFileSync('./settings/Grupo/Json/grupo.json'))
const Antipv = JSON.parse(fs.readFileSync('./settings/Grupo/Json/chat.json'))
const moment = require("moment-timezone")
const time = moment.tz('Europe/Moscow').format('DD/MM HH:mm:ss')
const horap = moment().format('HH')
var timeFt = 'ДОБРО ПОЖАЛОВАТЬ'
if (horap >= '01' && horap <= '05') timeFt = 'ДОБРОЕ УТРО ☀️'
else if (horap >= '05' && horap <= '12') timeFt = 'ДОБРОЕ УТРО ☀️'
else if (horap >= '12' && horap <= '18') timeFt = 'ДОБРЫЙ ДЕНЬ ⛅'
else if (horap >= '18' && horap <= '23') timeFt = 'ДОБРЫЙ ВЕЧЕР 🌑'
var { owner, Bot, JpgBot, NAUFRA_KEY } = require("./settings/settings.json");
const prefixo = ['#', '/', '•', '.', '!', '?', '*']
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

function getGroupAdmins(p) { let a = []; for (let i of p) { if (i.admin == 'admin' || i.admin == 'superadmin') a.push(i.id) } return a }
function truncateText(text, max) { return text && text.length > max ? text.substring(0, max) + '...' : text || '' }

async function startProo() {
// ============================================================
// ПОЛНОЭКРАННЫЙ ЦВЕТНОЙ БАННЕР
// ============================================================
console.clear();
console.log(chalk.cyan('╔══════════════════════════════════════════════════════════════╗'));
console.log(chalk.cyan('║') + '                                                              ' + chalk.cyan('║'));
console.log(chalk.cyan('║') + chalk.yellow('   ███╗░░░███╗██╗██╗░░██╗██╗░░██╗░█████╗░██╗██╗░░░░░   ') + chalk.cyan('║'));
console.log(chalk.cyan('║') + chalk.yellow('   ████╗░████║██║██║░██╔╝██║░░██║██╔══██╗██║██║░░░░░   ') + chalk.cyan('║'));
console.log(chalk.cyan('║') + chalk.yellow('   ██╔████╔██║██║█████═╝░███████║███████║██║██║░░░░░   ') + chalk.cyan('║'));
console.log(chalk.cyan('║') + chalk.yellow('   ██║╚██╔╝██║██║██╔═██╗░██╔══██║██╔══██║██║██║░░░░░   ') + chalk.cyan('║'));
console.log(chalk.cyan('║') + chalk.yellow('   ██║░╚═╝░██║██║██║░╚██╗██║░░██║██║░░██║██║███████╗   ') + chalk.cyan('║'));
console.log(chalk.cyan('║') + chalk.yellow('   ╚═╝░░░░░╚═╝╚═╝╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝╚═╝╚══════╝   ') + chalk.cyan('║'));
console.log(chalk.cyan('║') + chalk.white('                                          [] CODEX 1.5       ') + chalk.cyan('║'));
console.log(chalk.cyan('╚══════════════════════════════════════════════════════════════╝'));
console.log('');
console.log(chalk.magenta('               ⚡ БОТ УСПЕШНО ПОДКЛЮЧЁН ⚡'));
console.log(chalk.cyan('               ГОТОВ К РАБОТЕ 24/7'));
console.log('');
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({ version, logger: pino({ level: "silent" }), printQRInTerminal: false, browser: ["Ubuntu", "Chrome", "20.0.04"], auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })) }, markOnlineOnConnect: true, generateHighQualityLinkPreview: true, syncFullHistory: false });
  if (!sock.authState.creds.registered) { let n = await question(chalk.cyan("📱 Введите номер WhatsApp: ")); rl.close(); n = n.replace(/[^0-9]/g, ""); if (!n) { console.log(chalk.red("❌ Неверный номер.")); process.exit(1); } try { const c = await sock.requestPairingCode(n); console.log(chalk.bgGreen.black("✅ КОД:"), chalk.white(c)); } catch (e) { console.error(chalk.red("❌ Ошибка:"), e.message); process.exit(1); } }
  sock.ev.on("connection.update", async (u) => { const { connection, lastDisconnect } = u; if (connection === "close") { if (new Boom(lastDisconnect?.error)?.output?.statusCode === DisconnectReason.loggedOut) console.log(chalk.red("❌ Сессия закрыта.")); else { console.log(chalk.yellow("⚠️ Переподключение...")); startProo(); } } else if (connection === "open") { console.log(chalk.greenBright.bold("✅ ПОДКЛЮЧЕНО")); exec("rm -rf tmp && mkdir tmp"); } });
  sock.ev.on("creds.update", saveCreds);

// ========== ПРИВЕТСТВИЯ, ПРОВОДЫ, АДМИНЫ ==========
sock.ev.on("group-participants.update", async (anu) => {
  if (!welkom.includes(anu.id)) return
  try {
    const meta = await sock.groupMetadata(anu.id)
    for (let nu of anu.participants) {
      const n = anu.participants[0], g = meta.subject, m = meta.participants.length, d = meta.desc || 'Нет описания', mr = String.fromCharCode(8206).repeat(850)

      if (anu.action == 'add') {
        // АнтиБот — удаляем по имени бота
        if (global.antiBot && global.antiBot[anu.id]) {
          let nameToCheck = ''
          try { nameToCheck = (await sock.getContact(n)).pushname || '' } catch(e) {}
          if (/bot|assistant|robot|auto|ai/i.test(nameToCheck)) {
            try {
              await sock.groupParticipantsUpdate(anu.id, [n], 'remove')
              return
            } catch(e) {}
          }
        }
        
        // АнтиАраб — удаляем номера арабских стран
if (global.antiArab && global.antiArab[anu.id]) {
  const num = n.split('@')[0].replace(/[^0-9]/g, '')
  const arabCodes = ['20','211','212','213','216','218','220','221','222','223','224','225','226','227','228','229','230','231','232','233','234','235','236','237','238','239','240','241','242','243','244','245','246','247','248','249','250','251','252','253','254','255','256','257','258','260','261','262','263','264','265','266','267','268','269','27','290','291','297','298','299','355','374','375','380','381','385','386','387','389','40','41','43','44','45','46','47','48','49','51','52','53','54','55','56','57','58','60','61','62','63','64','65','66','81','82','84','86','90','91','92','93','94','95','98','212','213','216','218','249','252','253','254','255','256','257','258','260','261','262','263','264','265','266','267','268','269','27','290','291','297','298','299','355','213','216','218','20','211','212','221','222','223','224','225','226','227','228','229','230','231','232','233','234','235','236','237','238','239','240','241','242','243','244','245','246','247','248','249','250','251','252','253','254','255','256','257','258','260','261','262','263','264','265','266','267','268','269','27','290','291','297','298','299']
  if (arabCodes.includes(num.substring(0,3)) || arabCodes.includes(num.substring(0,2)) || arabCodes.includes(num.substring(0,1))) {
    try {
      await sock.groupParticipantsUpdate(anu.id, [n], 'remove')
      return
    } catch(e) {}
  }
}

        const welcomes = [
          `💌 Привет, @${n.split('@')[0]}! Добро пожаловать в *${g}*!`,
          `🌟 Ура! @${n.split('@')[0]} теперь с нами в *${g}*!`,
          `🎉 Встречайте! @${n.split('@')[0]} присоединился к *${g}*!`,
          `🔥 Огонь! @${n.split('@')[0]} залетел в *${g}*!`,
          `👋 Приветствуем @${n.split('@')[0]} в *${g}*!`,
          `🚀 @${n.split('@')[0]} приземлился в *${g}*!`,
          `✨ @${n.split('@')[0]} теперь часть *${g}*!`,
          `🍀 Удача привела @${n.split('@')[0]} в *${g}*!`,
          `💪 Новый боец @${n.split('@')[0]} в *${g}*!`,
          `🎈 Салют! @${n.split('@')[0]} теперь с нами!`
        ]
        const quotes = [
          'Лучший день чтобы начать что-то новое!', 'Улыбнись — ты в хорошей компании!',
          'Здесь говорят о важном и не очень.', 'Будь собой, остальные роли заняты.',
          'Жизнь слишком коротка для скучных чатов.', 'В этом чате рождаются легенды.',
          'Не откладывай на завтра то что можно сказать сегодня!', 'Добро пожаловать в лучшее место!',
          'Тише едешь — дальше будешь!', 'Сначала прочитай правила, потом шути!'
        ]
        const rw = welcomes[Math.floor(Math.random() * welcomes.length)]
        const rq = quotes[Math.floor(Math.random() * quotes.length)]
        await sock.sendMessage(anu.id, { image: { url: await sock.profilePictureUrl(n, 'image').catch(() => "https://i.postimg.cc/SR3KvGSj/IMG-20260429-WA0747.jpg") }, caption: `✦━─⌬༓༒༓⌬─━✦\n*ДОБРО ПОЖАЛОВАТЬ*\n\n${rw}\n『 👥 Участников: ${m} 』\n${mr}\n╭─「 📜 ПРАВИЛА 」─╮\n│ ${d}\n│\n│ 💬 ${rq}\n╰─────────────\n✦━─⌬༓༒༓⌬─━✦`, mentions: [n] })
      }

      if (anu.action == 'promote') {
        await sock.sendMessage(anu.id, { image: { url: await sock.profilePictureUrl(n, 'image').catch(() => "https://i.postimg.cc/SR3KvGSj/IMG-20260429-WA0747.jpg") }, caption: `✦━─┈༓༒༓┈─━✦\n*НОВЫЙ АДМИН*\n\n👤 @${n.split('@')[0]}\n🌐 ${meta.subject}\n✦━─┈༓༒༓┈─━✦`, mentions: [n] })
      }
      if (anu.action == 'demote') {
        await sock.sendMessage(anu.id, { image: { url: await sock.profilePictureUrl(n, 'image').catch(() => "https://i.postimg.cc/SR3KvGSj/IMG-20260429-WA0747.jpg") }, caption: `✦━─┈༓༒༓┈─━✦\n*АДМИН СНЯТ*\n\n👤 @${n.split('@')[0]}\n🌐 ${meta.subject}\n✦━─┈༓༒༓┈─━✦`, mentions: [n] })
      }
      if (anu.action == 'remove') {
        const goodbyes = [
          `👋 Пока, @${n.split('@')[0]}! Заходи ещё в *${g}*!`,
          `😢 Жаль что ты ушёл, @${n.split('@')[0]}...`,
          `🚪 @${n.split('@')[0]} покинул *${g}*. Двери открыты!`,
          `💨 @${n.split('@')[0]} испарился из *${g}*...`,
          `😔 Минус один... @${n.split('@')[0]}, возвращайся!`,
          `🌟 Удачи, @${n.split('@')[0]}! Будем ждать!`
        ]
        const goodbyeQuotes = [
          'Жизнь идёт дальше...', 'Возвращайся, мы не кусаемся!',
          'Группа стала чуточку тише...', 'Надеемся, ты вернёшься!'
        ]
        const rg = goodbyes[Math.floor(Math.random() * goodbyes.length)]
        const rgq = goodbyeQuotes[Math.floor(Math.random() * goodbyeQuotes.length)]
        await sock.sendMessage(anu.id, { image: { url: await sock.profilePictureUrl(n, 'image').catch(() => "https://i.postimg.cc/SR3KvGSj/IMG-20260429-WA0747.jpg") }, caption: `✦━─⌬༓༒༓⌬─━✦\n*ПРОЩАЙ*\n\n${rg}\n『 👥 Осталось: ${m} 』\n│\n│ 💬 ${rgq}\n✦━─⌬༓༒༓⌬─━✦`, mentions: [n] })
      }
    }
  } catch (e) {}
})

// ========== ОБРАБОТКА СООБЩЕНИЙ ==========
  sock.ev.on('messages.upsert', async m => {
    try {
      const info = m.messages[0]
      if (!info.message || (info.key && info.key.remoteJid == "status@broadcast")) return
      // Авточтение сообщений
try { await sock.readMessages([info.key]) } catch(e) {}
      const type = Object.keys(info.message)[0] === "senderKeyDistributionMessage" ? Object.keys(info.message)[1] || Object.keys(info.message)[0] : Object.keys(info.message)[0]
      const from = info.key.remoteJid
      let body = (type === 'conversation') ? info.message.conversation : (type == 'imageMessage') ? info.message.imageMessage.caption : (type == 'videoMessage') ? info.message.videoMessage.caption : (type == 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''
      if (!body) body = ''
      const budy = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''
      const isGroup = from.endsWith('@g.us')
      const sender = isGroup ? (info.key.participant || from) : from
      const groupMetadata = isGroup ? await sock.groupMetadata(from) : ''
      const groupName = isGroup ? groupMetadata.subject : ''
      const groupMembers = isGroup ? groupMetadata.participants || [] : []
      const groupAdmins = groupMembers.filter(p => p.admin)
      const args = body.trim().split(/ +/).slice(1)
      const q = args.join(' ')
      const pushname = info.pushName || ''
      const isOwner = [`${owner}`].includes(sender)
      const isGroupAdmins = groupAdmins.some(a => a.id?.includes(sender))
      const isBotGroupAdmins = groupAdmins.some(a => a.id === sock.user.id || a.id?.split(':')[0] === sock.user.id?.split(':')[0])
      const isReg = checkOfReg(sender)
      const iswelkom = isGroup ? welkom.includes(from) : false
      const isBanGp = isGroup ? bngp.includes(from) : false
      const isAntipv = Antipv.includes('activo')
      const isAntiLink = isGroup ? antilink.includes(from) : false
      const coins = MoneyOfSender(sender)
      const isModoAdmin = isGroup ? (JSON.parse(fs.readFileSync('./settings/Grupo/Json/modo_admin.json')) || []).includes(from) : false
      const comando = (() => { for (let p of prefixo) { if (body.startsWith(p)) return body.slice(p.length).trim().split(' ')[0].toLowerCase() } return '' })()
      const isQuotedSticker = type === "extendedTextMessage" && JSON.stringify(info.message).includes("stickerMessage")
      const mentions = (t, m) => sock.sendMessage(from, { text: t, mentions: m })
      const enviar = (t) => sock.sendMessage(from, { text: t }, { quoted: info })
      const getFileBuffer = async (mk, mt) => { const s = await downloadContentFromMessage(mk, mt); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); return b }
      const DLT_FL = (f) => { try { fs.unlinkSync(f) } catch (e) {} }
      const obtenerMencionado = (i) => { const c = i.message?.extendedTextMessage?.contextInfo || i.message?.contextInfo; if (c?.mentionedJid?.length > 0) return c.mentionedJid[0]; if (c?.participant) return c.participant; return null }
      const runtime = (s) => { const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60); return `${d ? d + 'д ' : ''}${h ? h + 'ч ' : ''}${m}мин` }
      const respuesta = { admin: "🚫 вы не администратор", botadmin: "⚠️ бот должен быть администратором", grupos: "💬 команда только в группах", miowner: "⛔ вы не создатель", registro: "💬 Сначала зарегистрируйтесь: .reg", yaregistro: "💬 Вы уже зарегистрированы", coins: "💰 недостаточно монет" }

      // ============================================================
      // КРАСИВЫЕ ЛОГИ В КОНСОЛИ
      // ============================================================
      const horaLog = new Date().toLocaleTimeString('ru-RU')
      const dataLog = new Date().toLocaleDateString('ru-RU')
      const isCmdLog = body && body.startsWith(prefixo)
      const cmdNameLog = isCmdLog ? comando : ''

      if (!isGroup && isCmdLog) {
          console.log('\n  ╔─━━━━ ', chalk.blue(' КОМАНДА « ЛС »'), ' ━━━━─╗')
          console.log(chalk.green(' ИМЯ :'), chalk.cyan(pushname))
          console.log(chalk.green(' КОМАНДА :'), chalk.cyan(cmdNameLog))
          console.log(chalk.green(' ВРЕМЯ :'), chalk.cyan(horaLog))
          console.log(chalk.green(' ДАТА :'), chalk.cyan(dataLog))
          console.log(chalk.gray(' ╚─━━━━━━ '), chalk.red('Бот'), ' ━━━━━─╝\n')
      } else if (!isGroup && !isCmdLog && budy) {
          console.log('\n  ╔─━━━━━', chalk.blue(' ЧАТ « ЛС »'), ' ━━━━━─╗')
          console.log(chalk.green(' ИМЯ :'), chalk.cyan(pushname))
          console.log(chalk.green(' СООБЩЕНИЕ :'), chalk.cyan(truncateText(budy || body, 50)))
          console.log(chalk.green(' ВРЕМЯ :'), chalk.cyan(horaLog))
          console.log(chalk.green(' ДАТА :'), chalk.cyan(dataLog))
          console.log(chalk.gray(' ╚─━━━━━━━━ '), chalk.red('【✔】'), ' ━━━━━━━━━─╝\n')
      } else if (isGroup && isCmdLog) {
          console.log('\n  ╔─━━━ ', chalk.blue(' КОМАНДА « ГРУППА »'), ' ━━━─╗')
          console.log(chalk.green(' ГРУППА :'), chalk.cyan(groupName))
          console.log(chalk.green(' ИМЯ :'), chalk.cyan(pushname))
          console.log(chalk.green(' КОМАНДА :'), chalk.cyan(cmdNameLog))
          console.log(chalk.green(' ВРЕМЯ :'), chalk.cyan(horaLog))
          console.log(chalk.green(' ДАТА :'), chalk.cyan(dataLog))
          console.log(chalk.gray(' ╚─━━━━━━ '), chalk.red('Бот'), ' ━━━━━─╝\n')
      } else if (isGroup && !isCmdLog && budy) {
          console.log('\n  ╔─━━━━━', chalk.blue(' ЧАТ « ГРУППА »'), ' ━━━━━─╗')
          console.log(chalk.green(' ГРУППА :'), chalk.cyan(groupName))
          console.log(chalk.green(' ИМЯ :'), chalk.cyan(pushname))
          console.log(chalk.green(' СООБЩЕНИЕ :'), chalk.cyan(truncateText(budy || body, 50)))
          console.log(chalk.green(' ВРЕМЯ :'), chalk.cyan(horaLog))
          console.log(chalk.green(' ДАТА :'), chalk.cyan(dataLog))
          console.log(chalk.gray(' ╚─━━━━━━━━━ '), chalk.red('【✔】'), ' ━━━━━━━━━─╝\n')
      }

      if (isBanGp && !isOwner) return
      
// АНТИБОТ — удаление новичков за первую ссылку (24 часа)
if (isGroup && global.antiBot && global.antiBot[from]) {
  const newcomerPath = './settings/Grupo/Json/newcomers.json'
  let newcomers = {}
  try { if (fs.existsSync(newcomerPath)) newcomers = JSON.parse(fs.readFileSync(newcomerPath)) } catch(e) {}
  
  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000  // ← здесь меняй время (24, 48, 72 и т.д.)
  
  // Очищаем старые записи (старше 1 дня)
  for (let jid of Object.keys(newcomers)) {
    if (now - newcomers[jid] > oneDay) delete newcomers[jid]
  }
  
  if (!newcomers[sender]) {
    // Первое сообщение от участника — запоминаем
    newcomers[sender] = now
    fs.writeFileSync(newcomerPath, JSON.stringify(newcomers))
  } else if (now - newcomers[sender] < oneDay) {
    // Прошло меньше суток с первого сообщения
    let msgText = (budy || body || '').toLowerCase()
// Для чужих сообщений WhatsApp может не передать body, ищем в extendedTextMessage
if (!msgText && info.message?.extendedTextMessage?.text) {
  msgText = info.message.extendedTextMessage.text.toLowerCase()
}
if (!msgText && info.message?.conversation) {
  msgText = info.message.conversation.toLowerCase()
}
    if (msgText.includes('http://') || msgText.includes('https://') || msgText.includes('.com') || msgText.includes('.ru')) {
      try {
        await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } })
        const { jidNormalizedUser } = require('baileys')
        await sock.groupParticipantsUpdate(from, [jidNormalizedUser(sender)], 'remove')
        await sock.sendMessage(from, { text: `🤖 @${sender.split('@')[0]} удалён за спам-ссылку (антибот)`, mentions: [sender] })
        delete newcomers[sender]
        fs.writeFileSync(newcomerPath, JSON.stringify(newcomers))
        return
      } catch(e) {}
    }
  }
}      

      // АНТИПРИВАТ
      if (isAntipv && !isGroup && !isOwner) {
        if (!global._apw) global._apw = {}
        if (!global._apw[sender]) {
          global._apw[sender] = true
          await sock.sendMessage(from, { text: `❌ @${sender.split('@')[0]}, личные сообщения запрещены!`, mentions: [sender] }, { quoted: info })
        }
        return
      }
      
      // АНТИСТИКЕР — удаление стикеров
if (isGroup && global.antiSticker && global.antiSticker[from]) {
  if (info.message?.stickerMessage) {
    try { await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } }) } catch(e) {}
    // Опционально: предупреждение
    // await sock.sendMessage(from, { text: `⚠️ @${sender.split('@')[0]}, стикеры запрещены!`, mentions: [sender] }, { quoted: info })
    return
  }
}

      // АНТИУДАЛЕНИЕ — сохранение текста и медиа
      if (isGroup && global.antiDel && global.antiDel[from]) {
        try {
          if (!global.msgStore2) global.msgStore2 = new Map()
          let msg = { sender, pushname, body: budy || body || '', type, time: Date.now() }
          
          if (info.message?.imageMessage) {
            let buf = await getFileBuffer(info.message.imageMessage, 'image')
            msg.mediaType = 'image'; msg.mediaBuffer = buf.toString('base64')
          } else if (info.message?.videoMessage) {
            let buf = await getFileBuffer(info.message.videoMessage, 'video')
            msg.mediaType = 'video'; msg.mediaBuffer = buf.toString('base64')
          } else if (info.message?.audioMessage) {
            let buf = await getFileBuffer(info.message.audioMessage, 'audio')
            msg.mediaType = 'audio'; msg.mediaBuffer = buf.toString('base64')
          } else if (info.message?.stickerMessage) {
            let buf = await getFileBuffer(info.message.stickerMessage, 'sticker')
            msg.mediaType = 'sticker'; msg.mediaBuffer = buf.toString('base64')
          }
          global.msgStore2.set(info.key.id, msg)
        } catch(e) {}
      }

      // АНТИУДАЛЕНИЕ — пересылка удалённого владельцу
      if (isGroup && info.message?.protocolMessage?.type === 0 && global.msgStore2) {
        let deletedId = info.message.protocolMessage.key.id
        let msg = global.msgStore2.get(deletedId)
        if (msg) {
          let ownerJid = owner.includes('@') ? owner : owner + '@s.whatsapp.net'
          let text = `🗑 АНТИУДАЛЕНИЕ\n👤 ${msg.pushname}\n💬 ${msg.body || '(без текста)'}\n🕒 ${new Date(msg.time).toLocaleTimeString()}`
          try {
            if (msg.mediaBuffer && msg.mediaType) {
              let buf = Buffer.from(msg.mediaBuffer, 'base64')
              let caption = `🗑 АНТИУДАЛЕНИЕ\n👤 ${msg.pushname}`
              if (msg.mediaType === 'image') await sock.sendMessage(ownerJid, { image: buf, caption, mentions: [msg.sender] })
              else if (msg.mediaType === 'video') await sock.sendMessage(ownerJid, { video: buf, caption, mentions: [msg.sender] })
              else if (msg.mediaType === 'audio') await sock.sendMessage(ownerJid, { audio: buf, mimetype: 'audio/mpeg', ptt: false })
              else if (msg.mediaType === 'sticker') await sock.sendMessage(ownerJid, { sticker: buf })
              else await sock.sendMessage(ownerJid, { text })
            } else {
              await sock.sendMessage(ownerJid, { text })
            }
          } catch(e) {}
          global.msgStore2.delete(deletedId)
        }
      }

      // АВТООТВЕТЧИК
      const arp = './settings/Grupo/Json/autoresponder.json'
      let ard = { activo: false, grupos: [] }
      if (fs.existsSync(arp)) { try { ard = JSON.parse(fs.readFileSync(arp)) } catch (e) {} }
      if (!ard.grupos) ard.grupos = []
      if (isGroup && ard.activo && ard.grupos.includes(from)) {
        const bl = (budy || '').toLowerCase(); let vn = null
        if (bl.match(/(привет|здравствуй|хай)/i)) vn = './media/здравствуй.mp3'
        if (bl.match(/(как дела)/i)) vn = './media/как дела.mp3'
        if (bl.match(/(пока|ушёл)/i)) vn = './media/пока.webp'
        if (bl.match(/(спокойной ночи|спать)/i)) vn = './media/спокойной ночи.mp3'
        if (bl.match(/(дурак|дура)/i)) vn = './media/дура.mp3'
        if (bl.match(/(сука)/i)) vn = './media/сука.webp'
        if (bl.match(/(смешно|ржу)/i)) vn = './media/смешно.mp3'
        if (bl.match(/(группа)/i)) vn = './media/группа.mp3'
        if (bl.match(/(от души)/i)) vn = './media/от души.mp3'
        if (bl.match(/(админ)/i)) vn = './media/админы.webp'
        if (bl.match(/(ты кто)/i)) vn = './media/ты кто.webp'
        if (bl.match(/(хочу)/i)) vn = './media/хочу.mp3'
        if (bl.match(/(отвали)/i)) vn = './media/отвали.mp3'
        if (bl.match(/(дорогая|скучаю)/i)) vn = './media/дорогая.mp4'
        if (bl.match(/(родная)/i)) vn = './media/роднуль.mp3'
        if (bl.match(/(спам)/i)) vn = './media/спам.mp3'
        if (bl.match(/(лс|личку)/i)) vn = './media/лс.mp4'
        if (bl.match(/(выходной)/i)) vn = './media/выходной.mp4'
        if (bl.match(/(дождь)/i)) vn = './media/дождь.mp4'
        if (bl.match(/(сиськи)/i)) vn = './media/сиськи.mp4'
        if (bl.match(/(мечта)/i)) vn = './media/мечта.mp3'
        if (bl.match(/(молчуны)/i)) vn = './media/молчуны.mp3'
        if (bl.match(/(ветер|холод)/i)) vn = './media/я приду к тебе.mp3'
        if (bl.match(/(пиздишь)/i)) vn = './media/пиздишь.webp'
        if (bl.match(/(дай|давай)/i)) vn = './media/дай.mp3'
        if (bl.match(/(время)/i)) vn = './media/время.mp3'
        if (bl.match(/(правила)/i)) vn = './media/правила.webp'
        if (bl.match(/(отдыхаю)/i)) vn = './media/отдыхаю.webp'
        if (bl.match(/(чё делаешь)/i)) vn = './media/чё делаешь.webp'
        if (bl.match(/(ссылку)/i)) vn = './media/ссылка.webp'
        if (bl.match(/(пидор)/i)) vn = './media/пидор.mp3'
        if (bl.match(/(дела)/i)) vn = './media/дела.mp3'
        if (bl.match(/(работу)/i)) vn = './media/на_работу.mp3'
        if (bl.match(/(козёл)/i)) vn = './media/казел.mp3'
        if (bl.match(/(пошла спать)/i)) vn = './media/пошла спать.mp3'
        if (bl.match(/(с днём рождения)/i)) vn = './media/с днём рождения.mp3'
        if (bl.match(/(хуею)/i)) vn = './media/хуею.jpg'
        if (bl.match(/(михаил|миша)/i)) vn = './media/мишка.mp3'
        if (bl.match(/(александр|саня)/i)) vn = './media/саня.mp3'
        if (bl.match(/(сергей)/i)) vn = './media/сергей.mp3'
        if (bl.match(/(олег)/i)) vn = './media/олег.mp3'
        if (bl.match(/(павел|паша)/i)) vn = './media/пашка.mp3'
        if (bl.match(/(пётр|петя)/i)) vn = './media/петя.mp3'
        if (bl.match(/(василий|вася)/i)) vn = './media/вася.mp3'
        if (bl.match(/(иван|ваня)/i)) vn = './media/ваня.mp3'
        if (bl.match(/(вова|володя)/i)) vn = './media/влва.mp3'
        if (bl.match(/(коля|николай)/i)) vn = './media/коля.mp3'
        if (bl.match(/(рома|роман)/i)) vn = './media/рома.mp3'
        if (bl.match(/(юра)/i)) vn = './media/юра.mp3'
        if (bl.match(/(анна|аня)/i)) vn = './media/аня.mp3'
        if (bl.match(/(елена|лена)/i)) vn = './media/лена.mp3'
        if (bl.match(/(ольга|оля)/i)) vn = './media/оля.mp3'
        if (bl.match(/(татьяна|таня)/i)) vn = './media/таня.mp3'
        if (bl.match(/(ирина|ира)/i)) vn = './media/ира.mp3'
        if (bl.match(/(марина)/i)) vn = './media/марина.mp3'
        if (bl.match(/(екатерина|катя)/i)) vn = './media/кат.mp3'
        if (bl.match(/(дарья|даша)/i)) vn = './media/дша.mp3'
        if (bl.match(/(елизавета|лиза)/i)) vn = './media/лиза.mp3'
        if (bl.match(/(ксения|ксюша)/i)) vn = './media/ксюша.mp3'
        if (bl.match(/(валерия|лера)/i)) vn = './media/лера.mp3'
        if (bl.match(/(алиса)/i)) vn = './media/алиса.mp3'
        if (bl.match(/(маргарита)/i)) vn = './media/маргарита.mp3'
        if (bl.match(/(алина)/i)) vn = './media/алина.mp3'
        if (bl.match(/(алёна)/i)) vn = './media/алёнка.mp3'
        if (bl.match(/(ева)/i)) vn = './media/ева.mp3'
        if (bl.match(/(нина)/i)) vn = './media/нина.mp3'
        if (bl.match(/(роза)/i)) vn = './media/роза.mp3'
        if (bl.match(/(яна)/i)) vn = './media/яна.mp3'
        if (bl.match(/(люба)/i)) vn = './media/люба.mp3'
        if (bl.match(/(надя|надежда)/i)) vn = './media/надя.mp3'
        if (bl.match(/(лариса)/i)) vn = './media/лариса.mp3'
        if (vn && vn.includes('|')) { for (const f of vn.split('|')) { if (fs.existsSync(f)) { const b = fs.readFileSync(f); const e = f.split('.').pop(); try { if (e === 'mp3') await sock.sendMessage(from, { audio: b, mimetype: 'audio/mpeg', ptt: false }, { quoted: info }); else if (e === 'webp') await sock.sendMessage(from, { sticker: b }, { quoted: info }); else if (e === 'mp4') await sock.sendMessage(from, { video: b, mimetype: 'video/mp4' }, { quoted: info }); else if (e === 'jpg') await sock.sendMessage(from, { image: b }, { quoted: info }) } catch (e) {} } } }
        else if (vn && fs.existsSync(vn)) { const b = fs.readFileSync(vn); const e = vn.split('.').pop(); try { if (e === 'mp3') await sock.sendMessage(from, { audio: b, mimetype: 'audio/mpeg', ptt: false }, { quoted: info }); else if (e === 'webp') await sock.sendMessage(from, { sticker: b }, { quoted: info }); else if (e === 'mp4') await sock.sendMessage(from, { video: b, mimetype: 'video/mp4' }, { quoted: info }); else if (e === 'jpg') await sock.sendMessage(from, { image: b }, { quoted: info }) } catch (e) {} }
      }

      // АВТОСТИКЕР
      const astPath = './settings/Grupo/Json/autosticker.json'
      if (isGroup && fs.existsSync(astPath)) {
        let ast = JSON.parse(fs.readFileSync(astPath))
        if (ast.grupos && ast.grupos.includes(from) && !body.startsWith(prefixo)) {
          const qm = info.message; const mime3 = Object.values(qm)[0]?.mimetype || ''
          if ((mime3.includes('image') || mime3.includes('video')) && !mime3.includes('webp')) {
            try { let buf = await getFileBuffer(qm.imageMessage || qm.videoMessage, mime3.includes('video') ? 'video' : 'image'); let res = await sendImageAsSticker(sock, from, buf, info, { packname: '', author: '꧁☠︎︎🅼🅸🅺🅷🅰︎🅸🅻☠︎︎꧂' }); DLT_FL(res) } catch(e) {}
          }
        }
      }

      // АКТИВНОСТЬ
      if (isGroup) { try { const ap = './settings/Grupo/Json/actividad.json'; let a = {}; if (fs.existsSync(ap)) a = JSON.parse(fs.readFileSync(ap)); if (!a[from]) a[from] = {}; a[from][sender] = Date.now(); fs.writeFileSync(ap, JSON.stringify(a)) } catch (e) {} }

      if (isModoAdmin && !isGroupAdmins && !isOwner) return
      if (!JSON.parse(fs.readFileSync('./settings/estadoBot.json')).activo && !isOwner) return

      // ========== КОМАНДЫ ==========
      switch (comando) {

        case 'меню': case 'menu':
          if (!isGroup || !isReg) return enviar(respuesta.registro)
          let menuPhoto = JpgBot
          try { menuPhoto = await sock.profilePictureUrl(sender, 'image') } catch(e) {}
          await sock.sendMessage(from, { image: { url: menuPhoto }, caption: Menu(timeFt, Bot, sender, groupName, groupMembers), mentions: [sender] }, { quoted: info })
          break

        case 'меню2': case 'menu2': case 'голосовые':
          if (!isGroup || !isReg) return enviar(respuesta.registro)
          const m2 = require('./settings/Bot/Js/menu2.js')(timeFt, Bot, sender)
          await sock.sendMessage(from, { image: { url: JpgBot }, caption: m2, mentions: [sender] }, { quoted: info })
          break

        case 'пинг': case 'ping':
          if (!isGroup) return
          let lat = speed(); lat = speed() - lat
          await sock.sendMessage(from, { image: { url: JpgBot }, caption: `🤖 ${Bot}\n⚡ ${lat.toFixed(4)} сек\n⏳ ${runtime(process.uptime())}\n👤 ${pushname}` }, { quoted: info })
          break

               case 'инфобот': case 'botinfo':
  if (!isGroup) return enviar('👥 Только в группах')
  const wStatus = iswelkom ? '✅' : '❌'
  const aStatus = isAntiLink ? '✅' : '❌'
  const a2Status = (() => { try { return JSON.parse(fs.readFileSync('./settings/Grupo/Json/antilink2.json')).includes(from) ? '✅' : '❌' } catch { return '❌' } })()
  let abStatus = '❌'
  if (global.antiBot && global.antiBot[from]) abStatus = '✅'
  let aaStatus = '❌'
  if (global.antiArab && global.antiArab[from]) aaStatus = '✅'
  let atsStatus = '❌'
  if (global.antiSticker && global.antiSticker[from]) atsStatus = '✅'
  const mStatus = isModoAdmin ? '✅' : '❌'
  const pStatus = isAntipv ? '✅' : '❌'
  const arStatus = (() => { try { const d = JSON.parse(fs.readFileSync('./settings/Grupo/Json/autoresponder.json')); return (d.grupos || []).includes(from) ? '✅' : '❌' } catch { return '❌' } })()
  const asStatus = (() => { try { const d = JSON.parse(fs.readFileSync('./settings/Grupo/Json/autosticker.json')); return (d.grupos || []).includes(from) ? '✅' : '❌' } catch { return '❌' } })()
  let gPhoto; try { gPhoto = await sock.profilePictureUrl(from, 'image') } catch { gPhoto = 'https://i.postimg.cc/SR3KvGSj/IMG-20260429-WA0747.jpg' }
  await sock.sendMessage(from, { image: { url: gPhoto }, caption: `╭─НАСТРОЙКИ ГРУППЫ─╮\n│\n│ ${wStatus} Приветствие\n│ ${aStatus} Антиссылка\n│ ${a2Status} Антиссылка 2\n│ ${abStatus} АнтиБот\n│ ${aaStatus} АнтиАраб\n│ ${atsStatus} АнтиСтикер\n│ ${mStatus} Режим админа\n│ ${pStatus} Антиприват\n│ ${arStatus} Автоответчик\n│ ${asStatus} Автостикер\n│\n╰─────────────` }, { quoted: info })
break

        case 'ботвкл': case 'boton':
          if (!isOwner) return enviar(respuesta.miowner)
          fs.writeFileSync('./settings/estadoBot.json', JSON.stringify({ activo: true }))
          enviar('🤖 Бот включён')
          break

        case 'ботвыкл': case 'botoff':
          if (!isOwner) return enviar(respuesta.miowner)
          fs.writeFileSync('./settings/estadoBot.json', JSON.stringify({ activo: false }))
          enviar('😴 Бот выключен')
          break

        case 'приветствие': case 'welcome':
          if (!isGroup || !isGroupAdmins) return enviar(respuesta.admin)
          if (args[0] === 'включить' || args[0] === 'on') { if (iswelkom) return enviar('Уже включено'); welkom.push(from); fs.writeFileSync('./settings/Grupo/Json/welkom.json', JSON.stringify(welkom)); enviar('✅ Приветствие включено') }
          else if (args[0] === 'выключить' || args[0] === 'off') { if (!iswelkom) return enviar('Уже выключено'); welkom.splice(welkom.indexOf(from), 1); fs.writeFileSync('./settings/Grupo/Json/welkom.json', JSON.stringify(welkom)); enviar('❌ Приветствие выключено') }
          else enviar('включить / выключить')
          break

        case 'антиссылка': case 'antilink':
          if (!isGroupAdmins) return enviar(respuesta.admin)
          if (args[0] === 'включить' || args[0] === 'on') { if (isAntiLink) return enviar('Уже включено'); antilink.push(from); fs.writeFileSync('./settings/Grupo/Json/antilink.json', JSON.stringify(antilink)); enviar('✅ Антиссылка включена') }
          else if (args[0] === 'выключить' || args[0] === 'off') { if (!isAntiLink) return enviar('Уже выключено'); antilink.splice(antilink.indexOf(from), 1); fs.writeFileSync('./settings/Grupo/Json/antilink.json', JSON.stringify(antilink)); enviar('❌ Антиссылка выключена') }
          else enviar('включить / выключить')
          break

        case 'антиссылка2': case 'antilink2':
          if (!isGroupAdmins) return enviar(respuesta.admin)
          const al2Path = './settings/Grupo/Json/antilink2.json'
          let al2 = fs.existsSync(al2Path) ? JSON.parse(fs.readFileSync(al2Path)) : []
          if (args[0] === 'включить' || args[0] === 'on') { if (al2.includes(from)) return enviar('Уже включена'); al2.push(from); fs.writeFileSync(al2Path, JSON.stringify(al2)); enviar('✅ Антиссылка 2 включена') }
          else if (args[0] === 'выключить' || args[0] === 'off') { if (!al2.includes(from)) return enviar('Уже выключена'); al2 = al2.filter(g => g !== from); fs.writeFileSync(al2Path, JSON.stringify(al2)); enviar('❌ Антиссылка 2 выключена') }
          else { let st2 = al2.includes(from) ? '✅ Вкл' : '❌ Выкл'; enviar(`Антиссылка 2: ${st2}`) }
          break

        case 'модадмин': case 'modoadmin':
          if (!isGroup || !isGroupAdmins) return enviar(respuesta.admin)
          let ma = JSON.parse(fs.readFileSync('./settings/Grupo/Json/modo_admin.json'))
          if (args[0] === 'включить' || args[0] === 'on') { if (!ma.includes(from)) { ma.push(from); fs.writeFileSync('./settings/Grupo/Json/modo_admin.json', JSON.stringify(ma)); enviar('✅ Режим админа включён') } else enviar('Уже включён') }
          else if (args[0] === 'выключить' || args[0] === 'off') { if (ma.includes(from)) { ma = ma.filter(g => g !== from); fs.writeFileSync('./settings/Grupo/Json/modo_admin.json', JSON.stringify(ma)); enviar('🟢 Режим админа выключен') } else enviar('Уже выключен') }
          else enviar('включить / выключить')
          break

        case 'антиприват': case 'antiprivado':
          if (!isOwner) return enviar(respuesta.miowner)
          if (args[0] === 'включить' || args[0] === 'on') {
            if (isAntipv) return enviar('Уже включено')
            Antipv.push('activo')
            fs.writeFileSync('./settings/Grupo/Json/chat.json', JSON.stringify(Antipv))
            enviar('✅ Антиприват включён')
          } else if (args[0] === 'выключить' || args[0] === 'off') {
            if (!isAntipv) return enviar('Уже выключено')
            Antipv.length = 0
            fs.writeFileSync('./settings/Grupo/Json/chat.json', JSON.stringify(Antipv))
            enviar('❌ Антиприват выключен')
          } else {
            enviar(`Статус: ${isAntipv ? '✅ Вкл' : '❌ Выкл'}`)
          }
          break

        case 'перезагрузка': case 'reiniciar':
          if (!isOwner) return enviar(respuesta.miowner)
          enviar('Перезагрузка...'); setTimeout(() => process.exit(0), 1000)
          break

        case 'все': case 'todos':
          if (!isGroup || !isGroupAdmins || !isReg) return enviar(respuesta.admin)
          let mid = [], t = `ВСЕГО: ${groupMembers.length}\n`, nn = 0
          for (let mem of groupMembers) { nn++; t += `➫[${nn}] @${mem.id.split('@')[0]}\n`; mid.push(mem.id) }
          mentions(`📢 ВНИМАНИЕ ВСЕМ!\n\n${t}`, mid)
          break

        case 'вызов': case 'notify':
          if (!isGroup || !isGroupAdmins || !isReg) return enviar(respuesta.admin)
          let g2 = await sock.groupMetadata(from), mb2 = g2.participants, mm2 = []
          const acp = './settings/Grupo/Json/actividad.json'
          let ac = {}; if (fs.existsSync(acp)) ac = JSON.parse(fs.readFileSync(acp))
          let ga = ac[from] || {}, now = Date.now(), lim = 86400000
          let actv = [], inactv = []
          for (let m of mb2) { mm2.push(m.id); let ult = ga[m.id] || 0; if (now - ult < lim) actv.push(m.id); else inactv.push(m.id) }
          let ord = actv.concat(inactv), lst = ''
          for (let i = 0; i < ord.length; i++) { let m = ord[i], ult = ga[m] || 0, h = Math.floor((now - ult) / 3600000); let st = ult === 0 ? '⚠️' : h < 1 ? '🟢' : h < 24 ? '🟡' : '🔴'; lst += `│ 👤 ${i + 1}. @${m.split('@')[0]} ${st}\n` }
          await sock.sendMessage(from, { text: `╭─「 📢 ВНИМАНИЕ 」─╮\n│\n│ 👤 @${sender.split('@')[0]}\n│ 👥 Актив: ${actv.length}\n│ 👥 Неактив: ${inactv.length}\n│____________________\n${lst}╰──────────────────`, mentions: mm2 }, { quoted: info })
          break

        case 'админы': case 'admins':
          if (!isGroup) return enviar('👥 Только в группах')
          if (!isReg) return enviar(respuesta.registro)
          let adminList = groupMembers.filter(p => p.admin)
          if (adminList.length === 0) return enviar('Нет администраторов')
          let adminText = `👑 *АДМИНИСТРАТОРЫ ГРУППЫ*\n\n`
          let adminMentions = []
          adminList.forEach((a, i) => { adminText += `${i+1}. @${a.id.split('@')[0]}\n`; adminMentions.push(a.id) })
          let callerPhoto; try { callerPhoto = await sock.profilePictureUrl(sender, 'image') } catch(e) { callerPhoto = JpgBot }
          await sock.sendMessage(from, { image: { url: callerPhoto }, caption: adminText, mentions: adminMentions }, { quoted: info })
          break

        case 'кик': case 'удалить': case 'kick':
          if (!isGroup) return
          let mn = obtenerMencionado(info)
          if (!mn) return enviar("Упомяните кого-то")
          try { await sock.groupParticipantsUpdate(from, [mn], 'remove'); enviar('✅ Удалён') } catch(e) { enviar('❌ Бот должен быть админом') }
          break

        case 'выход': case 'out': case 'leave':
          if (!isGroup) return enviar('👥 Только в группах')
          if (!isOwner) return enviar(respuesta.miowner)
          try { await sock.sendMessage(from, { text: '👋 Прощай, бот уходит!' }); await sock.groupLeave(from) } catch(e) { enviar('❌ Не удалось') }
          break

        case 'автоадмин': case 'autoadmin':
          if (!isGroup || !isOwner) return enviar(respuesta.miowner)
          try { await sock.groupParticipantsUpdate(from, [sender], "promote"); enviar('✅ Теперь вы админ!') } catch(e) { enviar('❌ Бот должен быть админом') }
          break

        case 'групплист': case 'grouplist':
          if (!isOwner) return enviar(respuesta.miowner)
          try { let txt = '📋 *Группы бота:*\n\n'; let groups = Object.entries(await sock.groupFetchAllParticipating()); for (let [jid, chat] of groups) { txt += `📌 ${chat.subject}\n📎 ${jid}\n\n` }; enviar(txt) } catch(e) { enviar('❌ Ошибка') }
          break

        case 'соединять': case 'join':
          if (!isOwner) return enviar(respuesta.miowner)
          let link = q; if (!link && info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation) link = info.message.extendedTextMessage.contextInfo.quotedMessage.conversation
          if (!link) return enviar('❌ Введите ссылку\nПример: #соединять https://chat.whatsapp.com/...')
          let code = link.match(/chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i)
          if (!code) return enviar('❌ Неверная ссылка')
          try { await sock.groupAcceptInvite(code[1]); enviar('✅ Бот присоединился!') } catch(e) { enviar('❌ Не удалось') }
          break

        case 'ссылка': case 'link':
          if (!isGroup || !isGroupAdmins) return enviar(respuesta.admin)
          try {
            const ic = await sock.groupInviteCode(from)
            let ph; try { ph = await sock.profilePictureUrl(from, 'image') } catch { ph = 'https://i.postimg.cc/0ygy14nq/20251017-152852.jpg' }
            await sock.sendMessage(from, { image: { url: ph }, caption: `╭─🔗ПРИГЛАШЕНИЕ─╮\n│\n│ 📛 *${groupName}*\n│ 🔗 https://chat.whatsapp.com/${ic}\n╰──────────` }, { quoted: info })
          } catch(e) { enviar('❌ Не удалось') }
          break

        case 'пригласить': case 'invite':
          if (!isGroup) return enviar('👥 Только в группах')
          if (!isGroupAdmins) return enviar(respuesta.admin)
          if (!q) return enviar('❌ Введите номер\nПример: #пригласить 77057722770')
          let tgtNumber = q.replace(/[^0-9]/g, '')
          if (!tgtNumber) return enviar('❌ Неверный номер')
          try {
            let tgtJid = tgtNumber + '@s.whatsapp.net'
            let inviteCode = await sock.groupInviteCode(from)
            let groupLink = `https://chat.whatsapp.com/${inviteCode}`
            let gName = groupMetadata.subject || 'Группа'
            await sock.sendMessage(tgtJid, { text: `📨 *Приглашение в группу*\n\n👤 От: @${sender.split('@')[0]}\n📞 Кому: ${tgtNumber}\n👥 В группу: ${gName}\n🔗 ${groupLink}`, mentions: [sender] })
            await sock.sendMessage(from, { text: `✅ *Приглашение отправлено!*\n\n👤 От: @${sender.split('@')[0]}\n📞 Кому: ${tgtNumber}\n👥 В группу: ${gName}\n🔗 ${groupLink}`, mentions: [sender] }, { quoted: info })
          } catch(e) { enviar('❌ Не удалось') }
          break

        case 'владелец': case 'owner':
          await sock.sendMessage(from, { contacts: { displayName: '👑 Михаил', contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Михаил\nTEL;waid=${owner}:+${owner}\nEND:VCARD` }] } }, { quoted: info })
          break

        case 'стикер': case 'с':
          if (!isReg) return enviar(respuesta.registro)
          if (coins < 1) return enviar(respuesta.coins)
          var R = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
          var bi = R?.imageMessage || info.message?.imageMessage
          var bv = R?.videoMessage || info.message?.videoMessage
          if (bi) {
            enviar('Создаю стикер...')
            try { let buf = await getFileBuffer(bi, 'image'); let res = await sendImageAsSticker(sock, from, buf, info, { packname: '', author: '꧁☠︎︎🅼🅸🅺🅷🅰︎🅸🅻☠︎︎꧂' }); DLT_FL(res); addXp(sender, 1); delkoin(sender, 1) } catch(e) { enviar('❌ Ошибка') }
          } else if (bv && bv.seconds < 11) {
            enviar('Создаю видео-стикер...')
            try { let buf = await getFileBuffer(bv, 'video'); let res = await sendVideoAsSticker(sock, from, buf, info, { packname: '', author: '꧁☠︎︎🅼🅸🅺🅷🅰︎🅸🅻☠︎︎꧂' }); DLT_FL(res); addXp(sender, 1); delkoin(sender, 1) } catch(e) { enviar('❌ Ошибка') }
          } else enviar('Отметьте фото или видео до 10 сек')
          break

        case 'вкартинку': case 'toimg':
          if (!isReg) return enviar(respuesta.registro); if (!isQuotedSticker) return enviar('Ответьте на стикер')
          try { let buf = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker'); await sock.sendMessage(from, { image: buf }, { quoted: info }); addXp(sender, 2); delkoin(sender, 1) } catch { enviar('Ошибка') }
          break

        case 'ввидео': case 'sav':
          if (!isReg) return enviar(respuesta.registro); if (!isQuotedSticker) return enviar('Ответьте на стикер')
          try { let buf = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker'); await sock.sendMessage(from, { document: buf, mimetype: 'image/webp', fileName: 'sticker.webp' }, { quoted: info }) } catch { enviar('Ошибка') }
          break

        case 'открыть': case 'раскрыть':
          if (!isOwner) return enviar(respuesta.miowner)
          try {
            const fm = info.message?.extendedTextMessage?.contextInfo?.quotedMessage; if (!fm) return enviar('Ответьте на сообщение')
            if (fm.imageMessage) { const s = await downloadContentFromMessage(fm.imageMessage, 'image'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(from, { image: b }, { quoted: info }) }
            else if (fm.videoMessage) { const s = await downloadContentFromMessage(fm.videoMessage, 'video'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(from, { video: b }, { quoted: info }) }
            else enviar('Не поддерживается')
          } catch(e) { enviar('Ошибка') }
          break

        case 'рег': case 'регистрация': case 'reg':
          if (isReg) return enviar(respuesta.yaregistro); await AddReg(sender, pushname)
          await sock.sendMessage(from, { image: { url: JpgBot }, caption: `★━━━━★\n*РЕГИСТРАЦИЯ*\n🎉 ${pushname}\n🪙 +50 рупий` }, { quoted: info })
          break

        case 'профиль': case 'perfil':
          if (!isReg) return enviar(respuesta.registro)
          let pf; try { pf = await sock.profilePictureUrl(sender, 'image') } catch { pf = 'https://i.postimg.cc/SR3KvGSj/IMG-20260429-WA0747.jpg' }
          await sock.sendMessage(from, { image: { url: pf }, caption: `╔═✦ ПРОФИЛЬ ✦═╗\n🏷️ @${sender.split('@')[0]}\n📚 ОПЫТ ${xpOfsender(sender)}/${Rxp(sender) + 1000}`, mentions: [sender] }, { quoted: info })
          break

        case 'группу': case 'grupo':
          if (!isGroup) return enviar('👥 Только в группах')
          if (!isGroupAdmins) return enviar(respuesta.admin)
          if (!args[0]) return enviar('Используйте:\n#группу открыть\n#группу закрыть')
          if (args[0] === 'открыть') { await sock.groupSettingUpdate(from, 'not_announcement'); enviar('🔓 Группа открыта') }
          else if (args[0] === 'закрыть') { await sock.groupSettingUpdate(from, 'announcement'); enviar('🔒 Группа закрыта') }
          else enviar('открыть или закрыть')
          break

        case 'автоответчик': case 'autoresponder':
          if (!isGroup || !isGroupAdmins) return enviar(respuesta.admin)
          let ad = { activo: false, grupos: [] }; if (fs.existsSync(arp)) ad = JSON.parse(fs.readFileSync(arp)); if (!ad.grupos) ad.grupos = []
          if (args[0] === 'включить' || args[0] === 'on') { if (ad.grupos.includes(from)) return enviar('Уже включён'); ad.grupos.push(from); ad.activo = true; fs.writeFileSync(arp, JSON.stringify(ad)); enviar('✅ Автоответчик включён') }
          else if (args[0] === 'выключить' || args[0] === 'off') { if (!ad.grupos.includes(from)) return enviar('Уже выключен'); ad.grupos = ad.grupos.filter(g => g !== from); ad.activo = ad.grupos.length > 0; fs.writeFileSync(arp, JSON.stringify(ad)); enviar('❌ Автоответчик выключен') }
          else { const st = ad.grupos.includes(from) ? '✅ Вкл' : '❌ Выкл'; enviar(`Автоответчик: ${st}`) }
          break

        case 'автостикер': case 'autosticker':
          if (!isGroup || !isGroupAdmins) return enviar(respuesta.admin)
          const autoStPath = './settings/Grupo/Json/autosticker.json'
          let autoSt = fs.existsSync(autoStPath) ? JSON.parse(fs.readFileSync(autoStPath)) : { activo: false, grupos: [] }
          if (!autoSt.grupos) autoSt.grupos = []
          if (args[0] === 'включить' || args[0] === 'on') { if (autoSt.grupos.includes(from)) return enviar('Уже включен'); autoSt.grupos.push(from); fs.writeFileSync(autoStPath, JSON.stringify(autoSt)); enviar('✅ Автостикер включен') }
          else if (args[0] === 'выключить' || args[0] === 'off') { if (!autoSt.grupos.includes(from)) return enviar('Уже выключен'); autoSt.grupos = autoSt.grupos.filter(g => g !== from); fs.writeFileSync(autoStPath, JSON.stringify(autoSt)); enviar('❌ Автостикер выключен') }
          else { enviar(`Автостикер: ${autoSt.grupos.includes(from) ? '✅ Вкл' : '❌ Выкл'}`) }
          break

        case 'статус': case 'status':
          let up = process.uptime(), dd = Math.floor(up / 86400), hh = Math.floor((up % 86400) / 3600), mm = Math.floor((up % 3600) / 60), ss = Math.floor(up % 60)
          await sock.sendMessage(from, { text: `╭─「 🤖 СТАТУС 」─╮\n│\n│ 👋 @${sender.split('@')[0]}\n│ ⏳ ${dd}д ${hh}ч ${mm}м ${ss}с\n│ 👑 Михаил\n╰──────────`, mentions: [sender] }, { quoted: info })
          break

        case 'музыка': case 'play':
  if (!isReg) return enviar(respuesta.registro)
  if (!q) return enviar('❌ Введите название\nПример: #музыка believer')
  enviar('🔍 Ищу...')
  try {
    const yts = require('yt-search')
    const fetch = require('node-fetch')
    let { videos } = await yts(q)
    if (!videos || videos.length === 0) return enviar('❌ Не найдено')
    let video = videos[0]
    
    const apis = [
  `https://api.davidcyriltech.my.id/ytmp3?url=${encodeURIComponent(video.url)}`,
  `https://apis-keith.vercel.app/download/dlmp3?url=${encodeURIComponent(video.url)}`
]
    
    let audioUrl = ''
    for (let api of apis) {
      try {
        let r = await fetch(api).then(r => r.json())
        audioUrl = r?.dl || r?.data?.dl || r?.data?.downloadUrl || r?.downloads?.url || ''
        if (audioUrl) break
      } catch(e) {}
    }
    
    if (audioUrl) {
      let thumb = video.thumbnail || ''
      let title = video.title || ''
      let author = video.author?.name || ''
      let duration = video.timestamp || ''
      let views = video.views || ''
      await sock.sendMessage(from, { image: { url: thumb }, caption: `🎵 *${title}*\n👤 ${author}\n⏱ ${duration}\n👁 ${views}` }, { quoted: info })
      await sock.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mpeg', ptt: false }, { quoted: info })
    } else {
      enviar('❌ Все API недоступны. Попробуйте позже.')
    }
  } catch(e) {
    enviar('❌ Ошибка загрузки')
  }
break

        case 'реакции': case 'reactions':
          if (!isGroupAdmins) return enviar(respuesta.admin)
          const reactPath = './settings/Grupo/Json/reactions.json'
          let reactData = fs.existsSync(reactPath) ? JSON.parse(fs.readFileSync(reactPath)) : { activo: false, grupos: [] }
          if (!reactData.grupos) reactData.grupos = []
          if (args[0] === 'включить' || args[0] === 'on') { if (reactData.grupos.includes(from)) return enviar('Уже включено'); reactData.grupos.push(from); fs.writeFileSync(reactPath, JSON.stringify(reactData)); enviar('✅ Реакции включены') }
          else if (args[0] === 'выключить' || args[0] === 'off') { if (!reactData.grupos.includes(from)) return enviar('Уже выключено'); reactData.grupos = reactData.grupos.filter(g => g !== from); fs.writeFileSync(reactPath, JSON.stringify(reactData)); enviar('❌ Реакции выключены') }
          else { const st = reactData.grupos.includes(from) ? '✅ Вкл' : '❌ Выкл'; enviar(`Реакции: ${st}`) }
          break

        case 'гороскоп': case 'horoscope':
          if (!q) return enviar('❌ Введите знак\nПример: #гороскоп овен')
          const signs = {
            'овен': '♈ Сегодня Овнам стоит быть решительнее.',
            'телец': '♉ Тельцам сегодня повезёт в делах.',
            'близнецы': '♊ Близнецы, будьте осторожны с обещаниями.',
            'рак': '♋ Ракам сегодня стоит отдохнуть.',
            'лев': '♌ Львы сегодня в центре внимания!',
            'дева': '♍ Девам сегодня лучше заняться уборкой.',
            'весы': '♎ Весы, сегодня день гармонии.',
            'скорпион': '♏ Скорпионам сегодня откроется тайна.',
            'стрелец': '♐ Стрельцы, отличный день для путешествий!',
            'козерог': '♑ Козерогам сегодня стоит заняться финансами.',
            'водолей': '♒ Водолеям сегодня придёт гениальная идея.',
            'рыбы': '♓ Рыбам сегодня снятся вещие сны.'
          }
          let sign = q.toLowerCase()
          if (signs[sign]) enviar(signs[sign])
          else enviar('❌ Знак не найден.\n♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓')
          break

        case 'мойид': case 'myid':
          enviar(`Твой ID: ${sender}`)
          break

        case 'чистить': case 'cleartmp':
          if (!isOwner) return enviar(respuesta.miowner)
          let deleted = 0
          for (let dir of ['./tmp', './temp']) {
            if (fs.existsSync(dir)) {
              try { const files = fs.readdirSync(dir); for (const f of files) { try { fs.unlinkSync(dir + '/' + f); deleted++ } catch(e) {} } } catch(e) {}
            }
          }
          enviar(`✅ Очищено ${deleted} файлов`)
          break

        case 'характер': case 'character':
          if (!isGroup) return enviar('👥 Только в группах')
          let target = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || info.message?.extendedTextMessage?.contextInfo?.participant
          if (!target) return enviar('❌ Упомяните кого-то\nПример: #характер @user')
          let traits = ['Умный', 'Креативный', 'Решительный', 'Заботливый', 'Харизматичный', 'Энергичный', 'Дружелюбный', 'Щедрый', 'Честный', 'Верный', 'Оптимистичный', 'Мудрый']
          let selected = []; for (let i = 0; i < 3; i++) { let t = traits[Math.floor(Math.random() * traits.length)]; if (!selected.includes(t)) selected.push(t) }
          let result = selected.map(t => `${t}: ${Math.floor(Math.random() * 41) + 60}%`).join('\n')
          let photo; try { photo = await sock.profilePictureUrl(target, 'image') } catch { photo = 'https://i.imgur.com/2wzGhpF.jpeg' }
          await sock.sendMessage(from, { image: { url: photo }, caption: `🔮 *Анализ характера*\n\n👤 @${target.split('@')[0]}\n\n${result}`, mentions: [target] }, { quoted: info })
          break

        case 'тествладельца': case 'testowner':
          let ownerList = owner.includes(',') ? owner.split(',') : [owner]
          let isOwnerTest = ownerList.some(o => sender.includes(o))
          enviar(`📋 *Информация*\n\n👤 Ваш номер: ${sender.split('@')[0]}\n👑 Владельцы: ${ownerList.join(', ')}\n✅ Вы владелец: ${isOwnerTest ? '✅ Да' : '❌ Нет'}`)
          break

        case 'предупреждение': case 'warn':
          if (!isGroup) return enviar('👥 Только в группах')
          if (!isGroupAdmins) return enviar(respuesta.admin)
          let tgt = obtenerMencionado(info)
          if (!tgt) return enviar('❌ Упомяните участника\nПример: #предупреждение @user')
          if (!global.warns) global.warns = {}
          if (!global.warns[from]) global.warns[from] = {}
          if (!global.warns[from][tgt]) global.warns[from][tgt] = 0
          global.warns[from][tgt]++
          let cw = global.warns[from][tgt]
          if (cw >= 3) {
            try { await sock.groupParticipantsUpdate(from, [tgt], 'remove'); await sock.sendMessage(from, { text: `🚫 @${tgt.split('@')[0]} удалён (${cw}/3)`, mentions: [tgt] }, { quoted: info }); delete global.warns[from][tgt] } catch(e) { await sock.sendMessage(from, { text: `⚠️ @${tgt.split('@')[0]} предупреждение ${cw}/3`, mentions: [tgt] }, { quoted: info }) }
          } else {
            await sock.sendMessage(from, { text: `⚠️ @${tgt.split('@')[0]} предупреждение ${cw}/3`, mentions: [tgt] }, { quoted: info })
          }
          break

        case 'антиудаление': case 'antidelete':
          if (!isGroupAdmins) return enviar(respuesta.admin)
          if (!global.antiDel) global.antiDel = {}
          if (args[0] === 'включить' || args[0] === 'on') {
            global.antiDel[from] = true
            enviar('✅ Антиудаление включено. Удалённые сообщения пересылаются владельцу.')
          } else if (args[0] === 'выключить' || args[0] === 'off') {
            delete global.antiDel[from]
            enviar('❌ Антиудаление выключено.')
          } else {
            let st = global.antiDel[from] ? '✅ Вкл' : '❌ Выкл'
            enviar(`Антиудаление: ${st}\n• антиудаление включить\n• антиудаление выключить`)
          }
          break
case 'антибот': case 'antibot':
  if (!isGroupAdmins) return enviar(respuesta.admin)
  if (!global.antiBot) global.antiBot = {}
  
  if (args[0] === 'включить' || args[0] === 'on') {
    global.antiBot[from] = true
    enviar('✅ АнтиБот включён. Защита от ботов активирована.')
  } else if (args[0] === 'выключить' || args[0] === 'off') {
    delete global.antiBot[from]
    enviar('❌ АнтиБот выключен.')
  } else {
    let st = global.antiBot[from] ? '✅ Вкл' : '❌ Выкл'
    enviar(`🤖 АнтиБот: ${st}\n• антибот включить\n• антибот выключить`)
  }
break

case 'антиараб': case 'antiarab':
  if (!isGroupAdmins) return enviar(respuesta.admin)
  if (!global.antiArab) global.antiArab = {}
  
  if (args[0] === 'включить' || args[0] === 'on') {
    global.antiArab[from] = true
    enviar('🕌 АнтиАраб включён. Номера арабских стран — кик.')
  } else if (args[0] === 'выключить' || args[0] === 'off') {
    delete global.antiArab[from]
    enviar('❌ АнтиАраб выключен.')
  } else {
    let st = global.antiArab[from] ? '✅ Вкл' : '❌ Выкл'
    enviar(`🕌 АнтиАраб: ${st}\n• антиараб включить\n• антиараб выключить`)
  }
break

case 'команды': case 'help': case 'хелп':
  if (!isGroup) return enviar('👥 Только в группах')
  const helpText = `╭━━━━━━━━━━━━━━━━━╮
┊  📖 *СПИСОК КОМАНД БОТА*  ┊
╰━━━━━━━━━━━━━━━━━╯

╭─ 📄 *ИНФОРМАЦИЯ* ─╮
│ #меню — главное меню
│ #меню2 — голосовые команды
│ #пинг — скорость ответа
┊ #погода Погода в городе
┊ #комплимент Случайный
│ #статус — время работы
│ #профиль — ваш профиль
│ #характер @юзер — анализ
│ #владелец — контакт создателя
│ #инфобот — настройки группы
│ #тествладельца — проверка
│ #мойид — показать ваш ID
╰─────────────╯

╭─ 👑 *АДМИНЫ* ─╮
┊ #антистикер Удаление стикеров
┊ #антибот Защита от ботов
┊ #антиараб Авто-кик арабов
│ #админы — вызвать админов
│ #приветствие вкл/выкл
│ #антиссылка вкл/выкл
│ #антиссылка2 вкл/выкл
│ #антиудаление вкл/выкл
│ #модадмин вкл/выкл
│ #все — упомянуть всех
│ #группу открыть/закрыть
│ #вызов — активность
│ #удалить @юзер
│ #ссылка — ссылка группы
│ #пригласить номер
│ #предупреждение @юзер
│ #групплист — группы бота
│ #реакции вкл/выкл
│ #автостикер вкл/выкл
│ #автоответчик вкл/выкл
╰─────────────╯

╭─ 🎨 *СТИКЕРЫ* ─╮
│ #стикер — фото/видео→стикер
│ #вкартинку — стикер→фото
│ #ввидео — стикер файлом
╰─────────────╯

╭─ 🎵 *МЕДИА* ─╮
│ #музыка название — трек
│ #гороскоп — шуточный
│ #характер @юзер — анализ
╰─────────────╯

╭─ 💰 *ЭКОНОМИКА* ─╮
│ #рег — регистрация
│ #профиль — баланс и опыт
╰─────────────╯

╭─ 👑 *СОЗДАТЕЛЬ* ─╮
│ #антиприват вкл/выкл
│ #ботвкл / #ботвыкл
│ #перезагрузка
│ #соединять ссылка
│ #автоадмин
│ #чистить — удалить tmp
│ #выход — бот покидает группу
│ #открыть — view once
╰─────────────╯`
  
  await sock.sendMessage(from, { text: helpText }, { quoted: info })
break

case 'погода': case 'weather':
  if (!q) return enviar('❌ Введите город\nПример: #погода Москва')
  enviar('🌤 Узнаю погоду...')
  try {
    const fetch = require('node-fetch')
    // Бесплатное API погоды (без ключа)
    let url = `https://wttr.in/${encodeURIComponent(q)}?format=%C+%t+%w+%h&lang=ru`
    let res = await fetch(url)
    let text = await res.text()
    if (text && text.length > 0) {
      await sock.sendMessage(from, { 
        image: { url: `https://wttr.in/${encodeURIComponent(q)}_0pq_lang=ru.png` },
        caption: `🌍 *Погода в ${q}*\n\n${text.trim()}\n\n# ${q} #погода`
      }, { quoted: info })
    } else {
      enviar('❌ Город не найден')
    }
  } catch(e) {
    enviar('❌ Ошибка получения погоды')
  }
break

case 'комплимент': case 'compliment':
  const compliments = [
    'Ты сегодня выглядишь потрясающе! ✨',
    'Твоя улыбка освещает этот чат! 😊',
    'С тобой всегда интересно общаться! 💬',
    'Ты — душа этой группы! 🎉',
    'Твой юмор — это нечто! 😂',
    'Ты делаешь этот мир лучше! 🌍',
    'С тобой приятно иметь дело! 🤝',
    'Ты просто космос! 🚀',
    'Твоя энергия заряжает всех вокруг! ⚡',
    'Ты — легенда этого чата! 👑',
    'Твои идеи всегда гениальны! 💡',
    'Ты как солнечный луч в пасмурный день! ☀️',
    'С тобой хоть в разведку! 🕵️',
    'Ты неотразим(а) сегодня! 💫',
    'Твой стиль — просто огонь! 🔥'
  ]
  let comp = compliments[Math.floor(Math.random() * compliments.length)]
  if (info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
    let who = info.message.extendedTextMessage.contextInfo.mentionedJid[0]
    enviar(`💐 @${who.split('@')[0]}, ${comp}`, { mentions: [who] })
  } else {
    enviar(`💐 ${comp}`)
  }
break

case 'антистикер': case 'antisticker':
  if (!isGroupAdmins) return enviar(respuesta.admin)
  if (!global.antiSticker) global.antiSticker = {}
  
  if (args[0] === 'включить' || args[0] === 'on') {
    global.antiSticker[from] = true
    enviar('🚫 АнтиСтикер включён. Все стикеры будут удаляться.')
  } else if (args[0] === 'выключить' || args[0] === 'off') {
    delete global.antiSticker[from]
    enviar('✅ АнтиСтикер выключен.')
  } else {
    let st = global.antiSticker[from] ? '✅ Вкл' : '❌ Выкл'
    enviar(`🚫 АнтиСтикер: ${st}\n• антистикер включить\n• антистикер выключить`)
  }
break

                                                default: {
          // АНТИССЫЛКА 1 — только удаление ссылки
          if (isGroup && isAntiLink) {
            const msgText = (budy || body || '').toLowerCase()
            if (msgText.includes('http') || msgText.includes('https://') || msgText.includes('.com') || msgText.includes('.ru') || msgText.includes('chat.whatsapp.com')) {
              try { await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } }) } catch(e) {}
            }
          }
          
          // АНТИССЫЛКА 2 — удаление + кик
          const al2Path = './settings/Grupo/Json/antilink2.json'
          if (isGroup && fs.existsSync(al2Path)) {
            const al2Data = JSON.parse(fs.readFileSync(al2Path))
            if (al2Data.includes(from)) {
              const msgText2 = (budy || body || '').toLowerCase()
              if (msgText2.includes('http') || msgText2.includes('https://') || msgText2.includes('.com') || msgText2.includes('.ru') || msgText2.includes('chat.whatsapp.com')) {
                try { await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } }) } catch(e) {}
                try {
                  const { jidNormalizedUser } = require('baileys')
                  await sock.groupParticipantsUpdate(from, [jidNormalizedUser(sender)], 'remove')
                  await enviar(`🚫 @${sender.split('@')[0]} удалён за ссылку`, { mentions: [sender] })
                } catch(e) { await enviar(`⚠️ @${sender.split('@')[0]} отправил ссылку! Бот не админ.`, { mentions: [sender] }) }
              }
            }
          }
        }
      }
    } catch (e) { if (!e.message?.includes('zero') && !e.message?.includes('MIME') && !e.message?.includes('conversation')) console.log('Error:', color(e.message, 'red')) }
  })
}
startProo()
