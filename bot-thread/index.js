const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TARGET_CHANNELS = ["plugin-showcase", "rendering-plugins"];

client.on('messageCreate', async (message) => {
  // 1. Abaikan pesan dari bot lain/diri sendiri
  if (message.author.bot) return;

  // 2. Filter nama channel
  if (!TARGET_CHANNELS.includes(message.channel.name)) return;

  // 3. Pastikan ada file yang diunggah
  if (message.attachments.size === 0) return;

  const files = message.attachments.map(att => att.name.toLowerCase());

  // 4. Filter ekstensi file
  const allowed = files.find(name =>
    name.endsWith('.zip') ||
    name.endsWith('.ttplugin') ||
    name.endsWith('.plugin')
  );

  if (!allowed) return;

  try {
    // Memperbaiki typo regex dari ttpplugin menjadi ttplugin dan menambahkan $ di akhir
    const cleanName = allowed.replace(/\.(zip|ttplugin|plugin)$/, '');
    const threadName = `${cleanName} discussion`;

    // 5. Tambahkan reaction 👍🏻 dan 👎🏻 ke pesan utama
    await message.react('👍🏻');
    await message.react('👎🏻');

    // 6. Buat thread (tanpa mengirim pesan di dalamnya)
    const thread = await message.startThread({
      name: threadName,
      autoArchiveDuration: 1440
    });

    console.log(`Berhasil memberikan reaction dan membuat thread: ${threadName}`);
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
  }
});

client.login(process.env.MTQ5MDkyNjU3MTIwNzUyODUyOA.GV8ZN0.LMtfYXumo-iFSH6GpqAt2mdR5LHx2mRq3VNNkU);
