const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent'] });

const prefix = '!';

// هنا حط ايدي السيرفر والرتبة المسموح لهم
const allowedGuildId = 'ايدي_السيرفر';
const allowedRoleId = 'ايدي_الرول_لاتسخدام_الاوامر';

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // تحقق ان الرسالة في السيرفر المحدد فقط
  if (!message.guild || message.guild.id !== allowedGuildId) return;

  // تحقق ان المستخدم عنده الرتبة المطلوبة
  if (!message.member.roles.cache.has(allowedRoleId)) {
    return message.reply('❌ أنت لا تملك الرتبة المسموح بها لاستخدام هذا الأمر.');
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('حدث خطأ أثناء تنفيذ الأمر.');
  }
});

client.login('توكن_البوت_هنا');
