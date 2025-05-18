const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const game = require('../utils/gameManager');

module.exports = {
  name: 'ابدأ',
  description: 'ابدأ لعبة أسرع شخص يكتب الكلمة',
  async execute(message) {
    if (game.isRunning()) return message.reply('🚫 اللعبة تعمل حالياً.');

    game.startGame();
    await startNextRound(message);
  }
};

async function startNextRound(message) {
  const word = game.nextRound();
  let countdown = 10;

  const countdownMsg = await message.channel.send(`⏳ الجولة ${game.getRound()} تبدأ خلال: **${countdown}** ثانية`);

  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      countdownMsg.edit(`⏳ الجولة ${game.getRound()} تبدأ خلال: **${countdown}** ثانية`);
    }
  }, 1000);

  setTimeout(() => {
    clearInterval(countdownInterval);
    message.channel.send(`✍️ الجولة ${game.getRound()}: اكتب الكلمة **${word}**`);
    startCollector(message, word);
  }, countdown * 1000);
}

function startCollector(message, word) {
  const collector = message.channel.createMessageCollector({ time: 15000 });

  collector.on('collect', async msg => {
    if (msg.content.trim() === word && !game.getWinner()) {
      game.setWinner(msg.author.id);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('points')
          .setLabel(`لديك الآن ${game.getScores()[msg.author.id]} نقطة`)
          .setStyle(ButtonStyle.Success)
          .setDisabled(true)
      );

      await message.channel.send({
        content: `👑 - فاز <@${msg.author.id}> في الجولة`,
        components: [row]
      });

      collector.stop();
    }
  });

  collector.on('end', async () => {
    if (game.isGameOver()) {
      game.stopGame();
      await message.channel.send('🏁 انتهت اللعبة! استخدم !متصدرين لمشاهدة النتائج.');
    } else {
      game.clearWinner();
      await startNextRound(message);
    }
  });
}