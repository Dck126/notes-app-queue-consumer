// berkas yang digunakan untuk menuliskan fungsi dalam mengirim pesan melalui email.
const nodemailer = require("nodemailer");

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: "Notes Apps",
      to: targetEmail,
      subject: "Ekspor Catatan",
      text: "Terlampir hasil dari ekspor catatan",
      attachments: [
        {
          filename: "notes.json",
          content,
        },
      ],
    };
    // Fungsi sendMail akan mengembalikan promise yang membawa status pengiriman email. Kita bisa manfaatkan itu sebagai nilai return.
    // Tujuannya, agar kita bisa menggunakan async/await ketika menggunakan fungsi sendEmail untuk mendapatkan status pengirimannya
    return this._transporter.sendMail(message);
  }
}
module.exports = MailSender;
