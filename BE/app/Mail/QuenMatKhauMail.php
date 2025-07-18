<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class QuenMatKhauMail extends Mailable
{
    use Queueable, SerializesModels;

    public $maXacNhan;

    public function __construct($maXacNhan)
    {
        $this->maXacNhan = $maXacNhan;
    }

    public function build()
    {
        return $this->subject('Mã xác nhận của bạn')
            ->html("
            <p>Mã xác nhận của bạn là: <strong>{$this->maXacNhan}</strong></p>
            <p><em>Lưu ý: Mã xác nhận này chỉ có hiệu lực trong vòng 2 phút.</em></p>
        ");
    }
}
