const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TARGET_CHANNELS = ["share-plugins", "rendering-plugins"];

// Cache biar message cuma diproses 1x
const processedMessages = new Set();

client.on('messageCreate', async (message) => {
  // 1. Abaikan bot
  if (message.author.bot) return;

  // 2. Cegah double trigger
  if (processedMessages.has(message.id)) return;
  processedMessages.add(message.id);

  // 3. Filter channel
  if (!TARGET_CHANNELS.includes(message.channel.name)) return;

  // 4. Harus ada attachment
  if (message.attachments.size === 0) return;

  const files = message.attachments.map(att => att.name.toLowerCase());

  // 5. Filter ekstensi
  const allowed = files.find(name =>
    name.endsWith('.zip') ||
    name.endsWith('.ttplugin') ||
    name.endsWith('.plugin')
  );

  if (!allowed) return;

  try {
    // 6. Cek kalau sudah ada thread → skip
    if (message.hasThread) return;

    // 7. Cek kalau sudah ada reaction → skip
    if (message.reactions.cache.size > 0) return;

    const cleanName = allowed.replace(/\.(zip|ttplugin|plugin)$/, '');
    const threadName = `${cleanName} discussion`;

    // 8. Reaction
    await message.react('👍');
    await message.react('👎');

    // 9. Buat thread
    await message.startThread({
      name: threadName,
      autoArchiveDuration: 60
    });

    console.log(`✔ Thread dibuat: ${threadName}`);

  } catch (err) {
    console.error('❌ Error:', err);
  }
});


client.login(process.env.TOKEN);
