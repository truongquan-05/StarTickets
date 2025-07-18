<?php

namespace App\Mail; // Đảm bảo namespace đúng

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log; // Để bạn vẫn có thể log URL QR

class MaQRVeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $ticketData; // Dữ liệu bạn muốn mã QR đại diện

    /**
     * Create a new message instance.
     *
     * @param string $ticketData Dữ liệu để tạo mã QR (ví dụ: ID vé, URL kiểm tra vé)
     * @return void
     */
    public function __construct($ticketData)
    {
        $this->ticketData = $ticketData;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        // 1. Dữ liệu mà bạn muốn mã QR chứa.
        // Ví dụ: một URL để kiểm tra vé, hoặc một chuỗi ID duy nhất của vé
        // Đảm bảo dữ liệu này được URL-encoded an toàn.
        $qrContent = urlencode($this->ticketData);

        // 2. Tạo URL mã QR từ QuickChart.io
        // size=200x200 pixels, margin=0 để gọn gàng
        $qrCodeUrl = "https://quickchart.io/qr?text={$qrContent}&size=200&margin=0";

        Log::info('[MaQRVeMail] QR Code URL: ' . $qrCodeUrl);

        return $this->from('support@yourapp.com', 'Hệ Thống Đặt Vé')
                    ->subject('Đơn hàng của bạn')
                    ->html("
                        <p>Mã QR của bạn là:</p>
                        <p>
                            <img src='{$qrCodeUrl}' alt='Mã QR Vé' style='max-width: 200px; height: auto; display: block; margin: 0 auto;' />
                        </p>
                        <p>Vui lòng trình mã QR này khi kiểm tra vé.</p>
                    ");
    }
}