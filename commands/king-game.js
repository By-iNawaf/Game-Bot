const fs = require('fs');
const path = './data/scores.json';

module.exports = {
  name: 'متصدرين',
  description: 'عرض قائمة المتصدرين حسب النقاط',
  async execute(message) {
    if (!fs.existsSync(path)) {
      return message.reply('لا توجد بيانات حالياً.');
    }

    const scores = JSON.parse(fs.readFileSync(path));
    const sorted = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    if (sorted.length === 0) {
      return message.reply('لا يوجد أي نقاط مسجلة حتى الآن.');
    }

    const leaderboard = sorted.map(([id, score], index) => {
      return `**${index + 1}. <@${id}> - ${score} نقطة**`;
    }).join('\n');

    message.channel.send({
      content: `🏆 **قائمة المتصدرين:**\n\n${leaderboard}`
    });
  }
};
