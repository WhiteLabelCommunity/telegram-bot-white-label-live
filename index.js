const TelegramBot = require('node-telegram-bot-api');
const fs = require("fs");
const parole = require("./parole.json");
const token = require("./config/token.json").token;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
let userData = [];
let nextFunction = [];


bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;
    let name = msg.from.first_name;
    userData[chatId] = {
        name,
    }

    let resp = "Ciao, benvenuto " + name;
    bot.sendMessage(chatId, resp);
});


bot.onText(/\/parolaccia (.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    let name = msg.from.first_name;
    let param = match[1] || 1
    let res = "";

    for (let i = 0; i < param; i++) {
        let p = parole[Math.ceil(Math.random() * parole.length)];
        res = res + " " + p
    }

    bot.sendMessage(chatId, res);
});


bot.onText(/\/location/, (msg, match) => {
    const chatId = msg.chat.id;
    let name = msg.from.first_name;
    bot.sendLocation(chatId, 45.544072, 8.105173);
});


bot.onText(/\/menu/, (msg, match) => {
    const chatId = msg.chat.id;
    let name = msg.from.first_name;

    let resp = `Cosa vuoi sapere 🔫
- panini
- insalate
- foto`;
    nextFunction[chatId] = tipoMenu
    bot.sendMessage(chatId, resp);
});





// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (nextFunction[chatId]) {
        const c = nextFunction[chatId];
        delete nextFunction[chatId]
        c(chatId, msg);
    }
    // send a message to the chat acknowledging receipt of their message
});


function tipoMenu(chatId, msg) {

    switch (msg.text) {
        case "panini":
            bot.sendMessage(chatId, "Non li tengo")
            break;

        case "insalate":
            bot.sendMessage(chatId, "Cha schifo")
            break;

        case 'foto':
            stream = fs.createReadStream('./static/.jpeg');
            bot.sendPhoto(chatId, stream)
            break;
        default:
            bot.sendMessage(chatId, "Minchia dici?")
            nextFunction[chatId] = tipoMenu;
            break;
    }
}
