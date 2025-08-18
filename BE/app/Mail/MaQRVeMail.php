<?php

namespace App\Mail; // Đảm bảo namespace đúng

use App\Models\DatVe;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log; // Để bạn vẫn có thể log URL QR

class MaQRVeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $ticketData; // Dữ liệu bạn muốn mã QR đại diện
    public $subject;
    public $Phim;
    public $Ghe;
    public $DoAn;
    public $GioChieu;
    public $Rap;

    /**
     * Create a new message instance.
     *
     * @param string $ticketData Dữ liệu để tạo mã QR (ví dụ: ID vé, URL kiểm tra vé)
     * @return void
     */
    public function __construct($ticketData, $id)
    {
        $this->ticketData = $ticketData;
        $data =  DatVe::with(['DatVeChiTiet.GheDat', 'DonDoAn.DoAn', 'lichChieu.phim'])
            ->where('id', $id)
            ->first();
        $this->subject = $data;

        $this->Phim = $data->lichChieu->phim->ten_phim;
        $this->Rap = $data->lichChieu->phong_chieu->rap->ten_rap;
        $this->Ghe  = $data->DatVeChiTiet->pluck('GheDat.so_ghe')->implode(', ');
        $this->DoAn = $data->DonDoAn->pluck('doAn.ten_do_an')->implode(', ');
        $this->GioChieu = \Carbon\Carbon::parse($data->lichChieu->gio_chieu)
            ->format('H:i d-m-Y');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {

        $qrContent = urlencode($this->ticketData);


        $qrCodeUrl = "https://quickchart.io/qr?text={$qrContent}&size=200&margin=0";


        return $this->from('support@yourapp.com', 'Hệ Thống Đặt Vé')
            ->subject('Đơn hàng của bạn')
            ->html("
                    <h1>Thông tin vé của bạn</h1>
                    <p>Rạp: {$this->Rap}</p>
                    <p>Phim: {$this->Phim}</p>
                    <p>Ghế:  {$this->Ghe}    </p>
                    <p>Đồ ăn: {$this->DoAn}</p>
                    <p>Giờ chiếu: {$this->GioChieu}</p>
                        <p>Mã QR của bạn là:</p>
                        <p>
                            <img src='{$qrCodeUrl}' alt='Mã QR Vé' style='max-width: 200px; height: auto; display: block; margin: 0 auto;' />
                        </p>
                        <p>Vui lòng trình mã QR này khi kiểm tra vé.</p>
                    ");
    }
}
