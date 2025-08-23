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

        // URL logo của website - thay đổi URL này thành logo thực tế của bạn
        $logoUrl = asset('https://i.imgur.com/EbQ3Ccc.png'); // hoặc URL trực tiếp như 'https://yourwebsite.com/logo.png'

        $emailHtml = "
        <!DOCTYPE html>
        <html lang='vi'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Vé Xem Phim</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f4f4f4;
                }
                
                .email-container {
                    max-width: 500px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    overflow: hidden;
                }
                
                .header {
                    background: linear-gradient(to right, #5d0eeb, #a943ec);;
                    padding: 10px 20px;
                    text-align: center;
                    color: white;
                }
                
                .logo {
                    width: 100%;
                    height: 80px;
                    margin: 0 auto 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .logo img {
                    border-radius: 50%;
                }
                
                .header h1 {
                    line-height: 80px;
                    margin-left: 20px;
                    font-size: 28px;
                    font-weight: 100;
                    font-family: 'Anton', sans-serif;
                }
                
                .header p {
                    font-size: 16px;
                    opacity: 0.9;
                }
                
                .ticket-container {
                    padding: 0;
                    overflow: hidden;
                    box-shadow: 0 8px 25px rgba(238, 90, 36, 0.3);
                }
                
                .ticket-body {
                    background-color: white;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 15px;
                    margin-bottom: 25px;
                }
                
                .info-item {
                    display: flex;
                    align-items: center;
                    padding: 5px;
                    background-color: #f8f9fa;
                }
                
                .info-content {
                    flex: 1;
                }
                
                .info-label {
                    font-size: 12px;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 600;
                }
                
                .info-value {
                    font-size: 16px;
                    color: #333;
                    font-weight: 600;
                }
                
                .qr-section {
                    text-align: center;
                    padding: 25px;
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border-radius: 10px;
                    margin-top: 20px;
                }
                
                .qr-title {
                    font-size: 18px;
                    color: #333;
                    margin-bottom: 15px;
                    font-weight: 600;
                }
                
                .qr-code {
                    display: inline-block;
                    padding: 15px;
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                
                .qr-code img {
                    display: block;
                    margin: 0 auto;
                    border-radius: 8px;
                }
                
                .qr-note {
                    margin-top: 15px;
                    font-size: 14px;
                    color: #666;
                    font-style: italic;
                }
                
                .footer {
                    background-color: #0c0b1f;
                    color: white;
                    text-align: center;
                    padding: 25px 20px;
                }
                
                .footer p {
                    margin-bottom: 10px;
                    font-size: 14px;
                    font-family: Alata, sans-serif;
                }
                
                .footer .company-name {
                    font-weight: 600;
                    font-size: 16px;
                    margin-bottom: 5px;
                }
                
                @media (max-width: 600px) {
                    .email-container {
                        margin: 0;
                        border-radius: 0;
                    }
                    
                    .ticket-container {
                        margin: 10px;
                    }
                    
                    .header {
                        padding: 20px 15px;
                    }
                    
                    .header h1 {
                        font-size: 24px;
                    }
                    
                    .ticket-body {
                        padding: 20px 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class='email-container'>
                <!-- Header với Logo -->
                <div class='header'>
                    <div class='logo'>
                        <img src='{$logoUrl}' alt='Logo' />
                        <h1>HÓA ĐƠN ĐIỆN TỬ</h1>
                    </div>
                    
                    <p>Vui lòng xuất trình mã QR đến quầy vé StarTickets để nhận vé.</p>
                </div>
                
                <!-- Nội dung vé -->
                <div class='ticket-container'>
                    <div class='ticket-body'>
                        <div class='info-grid'>
                            <h1 style='font-size: 20px; font-weight: 600; padding: 10px 0;'>THÔNG TIN VÉ</h1>
                            <div class='info-item'>
                                <div class='info-content'>
                                    <div class='info-label'>Phim</div>
                                    <div class='info-value'>{$this->Phim}</div>
                                </div>
                            </div>
                            
                            <div class='info-item'>
                                <div class='info-content'>
                                    <div class='info-label'>Rạp Chiếu</div>
                                    <div class='info-value'>{$this->Rap}</div>
                                </div>
                            </div>
                            
                            <div class='info-item'>
                                <div class='info-content'>
                                    <div class='info-label'>Ghế Ngồi</div>
                                    <div class='info-value'>{$this->Ghe}</div>
                                </div>
                            </div>
                            
                            <div class='info-item'>
                                <div class='info-content'>
                                    <div class='info-label'>Giờ Chiếu</div>
                                    <div class='info-value'>{$this->GioChieu}</div>
                                </div>
                            </div>
                            
                            " . (!empty($this->DoAn) ? "
                            <div class='info-item'>
                                <div class='info-content'>
                                    <div class='info-label'>Đồ Ăn & Thức Uống</div>
                                    <div class='info-value'>{$this->DoAn}</div>
                                </div>
                            </div>
                            " : "") . "
                        </div>
                        
                        <!-- QR Code Section -->
                        <div class='qr-section'>
                            <div class='qr-title'>Mã QR Vé Của Bạn</div>
                            <div class='qr-code'>
                                <img src='{$qrCodeUrl}' alt='Mã QR Vé' width='200' height='200' />
                            </div>
                            <div class='qr-note'>
                                Vui lòng trình mã QR này khi kiểm tra vé tại rạp
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Footer -->
                <div class='footer'>
                    <div class='company-name'>Hệ Thống Đặt Vé StarTickets</div>
                    <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!</p>
                    <p>📧 cskhstartickets@gmail.com | 📞 1900-1234</p>
                    <p style='font-size: 12px; opacity: 0.8; margin-top: 10px;'>
                        Email này được gửi tự động, vui lòng không phản hồi.
                    </p>
                </div>
            </div>
        </body>
        </html>
        ";

        return $this->from('support@yourStarTickets.com', 'StarTickets Booking System')
            ->subject('🎬 Vé Xem Phim Của Bạn - Đặt Vé Thành Công!')
            ->html($emailHtml);
    }
}
