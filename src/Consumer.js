// berkas yang digunakan untuk menuliskan program consumer queue.
// serta di berkas ini juga kita akan mengatur segala dependencies yang sudah dibuat sebelumnya
require("dotenv").config();
const amqp = require("amqplib");
const NotesService = require("./NotesService");
const MailSender = require("./MailSender");
const Listener = require("./Listener");

const init = async () => {
  const notesService = new NotesService();
  const mailSender = new MailSender();
  const listener = new Listener(notesService, mailSender);
  // Karena kita memanfaatkan environment variable CLOUDAMQP_SERVER dalam menetapkan alamat server RabbitMQ,
  // maka silakan buat variable dan tetapkan nilainya pada berkas .env.
  const connection = await amqp.connect(process.env.CLOUDAMQP_SERVER);
  //create channel
  const channel = await connection.createChannel();
  //kita pastikan queue dengan nama export:notes telah terbuat menggunakan fungsi channel.assertQueue.
  await channel.assertQueue("export_2:notes", {
    durable: true,
  });

  channel.consume("export_2:notes", listener.listen, { noAck: true });
};

init();
