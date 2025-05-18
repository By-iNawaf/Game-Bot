// commands/ايقاف.js

const game = require('../utils/gameManager');

module.exports = {
  name: 'ايقاف',
  description: 'إيقاف اللعبة الحالية',
  execute(message) {
    if (!game.isRunning()) return message.reply('🚫 لا توجد لعبة قيد التشغيل.');

    game.stopGame();
    message.channel.send('🛑 تم إيقاف اللعبة!');
  }
};
