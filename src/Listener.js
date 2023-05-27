// berkas yang digunakan untuk menuliskan fungsi callback yang akan dijalankan setiap kali consumer menerima pesan.
//  Fungsi listener ini membutuhkan NotesService dan MailSender untuk mendapatkan catatan dan mengirimnya melalui email
class Listener {
  constructor(notesService, mailSender) {
    this._notesService = notesService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  /**
   *
   * message merupakan pesan yang didapat dari queue karena fungsi listen akan kita delegasikan sebagai fungsi callback pada consumer.
   * Oke, lanjut. Di dalam fungsi listen, tuliskan penanganan eror terlebih dahulu,
   *  karena nantinya kita akan menggunakan beberapa fungsi yang dapat membangkitkan eror.
   */
  async listen(message) {
    /**
     * panggil fungsi getNotes dan sendEmail.
     * Namun sebelum itu, kita perlu dapatkan nilai userId dan targetEmail yang dikirimkan melalui message.
     */
    try {
      // mendapatkan konten aslinya menggunakan fungsi message.content.toString() serta mengubah string menjadi objek menggunakan JSON.parse
      const { userId, targetEmail } = JSON.parse(message.content.toString());
      //   memanggil fungsi getNotes dan sendEmail melalui this._notesService dan this._mailSender
      const notes = await this._notesService.getNotes(userId);
      //   sendEmail hanya menerima content dalam bentuk string, itulah alasan mengapa kita menggunakan JSON.stringify pada pengiriman notes.
      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(notes)
      );
      //   result pada console yang dikembalikan oleh sendEmail agar kita bisa mengetahui apakah email berhasil terkirim atau tidak
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Listener;
