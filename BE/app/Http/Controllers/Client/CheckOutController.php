<?php

namespace App\Http\Controllers\Client;

use App\Models\DoAn;
use App\Models\DatVe;
use App\Models\DonDoAn;
use App\Jobs\XoaDonHang;
use App\Mail\MaQRVeMail;
use App\Models\CheckGhe;
use App\Models\MaGiamGia;
use App\Models\ThanhToan;
use Illuminate\Http\Request;
use App\Models\DiemThanhVien;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class CheckOutController extends Controller
{

    public function execPostRequest($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data)
            )
        );
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        //execute post
        $result = curl_exec($ch);
        //close connection
        curl_close($ch);
        return $result;
    }


    public function momo_payment(Request $request)
    {
        XoaDonHang::dispatch($request->input('dat_ve_id'))->delay(now()->addMinutes(10));
        //Xử lý thanh toán bằng MOMO
        if ($request->input('phuong_thuc_thanh_toan_id') == 1) {
            $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
            $partnerCode = 'MOMOBKUN20180529';
            $accessKey = 'klm05TvNBzhg7h7j';
            $secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
            $orderInfo = "Thanh toán qua ATM MoMo";
            $amount = $request->input('tong_tien');
            $dat_ve_id = $request->input('dat_ve_id');
            $phuong_thuc_thanh_toan_id = $request->input('phuong_thuc_thanh_toan_id');
            $ma_giam_gia_id = $request->input('ma_giam_gia_id', null);
            $diem = $request->input('diem', null);
            $nguoi_dung_id = $request->input('nguoi_dung_id');
            $email = $request->input('email');
            $diem_thanh_vien = $request->input('diem_thanh_vien', 0);
            $ho_ten = $request->input('ho_ten');
            $orderId = time() . "";
            $redirectUrl = "http://localhost:8000/api/momo-ipn";
            $ipnUrl = "http://localhost:8000/api/momo-ipn";


            $requestId = time() . "";
            $requestType = "payWithATM";
            $extraData = json_encode([
                'dat_ve_id' => $dat_ve_id,
                'phuong_thuc_thanh_toan_id' => $phuong_thuc_thanh_toan_id,
                'nguoi_dung_id' => $nguoi_dung_id,
                'ma_giam_gia_id' => $ma_giam_gia_id,
                'diem' => $diem,
                'email' => $email,
                'ho_ten' => $ho_ten,
                'diem_thanh_vien' => $diem_thanh_vien,
            ]);

            // $extraData = ($_POST["extraData"] ? $_POST["extraData"] : "");
            //before sign HMAC SHA256 signature
            $rawHash = "accessKey=" . $accessKey . "&amount=" . $amount . "&extraData=" . $extraData . "&ipnUrl=" . $ipnUrl . "&orderId=" . $orderId . "&orderInfo=" . $orderInfo . "&partnerCode=" . $partnerCode . "&redirectUrl=" . $redirectUrl . "&requestId=" . $requestId . "&requestType=" . $requestType;
            $signature = hash_hmac("sha256", $rawHash, $secretKey);
            $data = array(
                'dat_ve_id' => $dat_ve_id,
                'phuong_thuc_thanh_toan_id' => $phuong_thuc_thanh_toan_id,
                'nguoi_dung_id' => $nguoi_dung_id,
                'partnerCode' => $partnerCode,
                'partnerName' => "Test",
                "storeId" => "MomoTestStore",
                'requestId' => $requestId,
                'amount' => $amount,
                'orderId' => $orderId,
                'orderInfo' => $orderInfo,
                'redirectUrl' => $redirectUrl,
                'ipnUrl' => $ipnUrl,
                'lang' => 'vi',
                'extraData' => $extraData,
                'requestType' => $requestType,
                'signature' => $signature
            );
            $result = $this->execPostRequest($endpoint, json_encode($data));
            $jsonResult = json_decode($result, true);  // decode json

            return response()->json([
                'data' => $jsonResult,
                'message' => 'Payment request sent successfully',
                'status' => 200
            ]);
        }
        // Xử lý thanh toán bằng VNPAY
        if ($request->input('phuong_thuc_thanh_toan_id') == 2) {
            $data = $request->all();
            $code_cart = time(); // Mã đơn hàng

            $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            $dat_ve_id = $request->input('dat_ve_id');
            $phuong_thuc_thanh_toan_id = $request->input('phuong_thuc_thanh_toan_id');
            $ma_giam_gia_id = $request->input('ma_giam_gia_id', null);
            $nguoi_dung_id = $request->input('nguoi_dung_id');
            $email = $request->input('email');
            $ho_ten = $request->input('ho_ten');
            $diem = $request->input('diem', null);
            $diem_thanh_vien = $request->input('diem_thanh_vien', 0);


            $vnp_Returnurl = "http://localhost:8000/api/momo-ipn?"
                . "dat_ve_id={$dat_ve_id}"
                . "&phuong_thuc_thanh_toan_id={$phuong_thuc_thanh_toan_id}"
                . "&nguoi_dung_id={$nguoi_dung_id}"
                . "&ma_giam_gia_id=" . ($ma_giam_gia_id ?? null)
                . "&email={$email}"
                . "&diem={$diem}"
                . "&ho_ten=" . ($ho_ten)
                . "&diem_thanh_vien=" . ($diem_thanh_vien);;



            $vnp_TmnCode = "0YDOPCOD";
            $vnp_HashSecret = "4QBR5J042GRID1BWUREA2SMOV6CI216M";

            $vnp_TxnRef = $code_cart;
            $vnp_OrderInfo = 'Thanh toán đơn hàng ';
            $vnp_OrderType = 'billpayment';
            $vnp_Amount = $request->input('tong_tien'); // ví dụ: 100000

            $vnp_Locale = 'vn';
            $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];

            $startTime = date("YmdHis");
            $expire = date('YmdHis', strtotime('+10 minutes', strtotime($startTime)));

            $inputData = array(
                "vnp_Version" => "2.1.0",
                "vnp_TmnCode" => $vnp_TmnCode,
                "vnp_Amount" => $vnp_Amount * 100, // nhân 100
                "vnp_Command" => "pay",
                "vnp_CreateDate" => date('YmdHis'),
                "vnp_CurrCode" => "VND",
                "vnp_IpAddr" => $vnp_IpAddr,
                "vnp_Locale" => $vnp_Locale,
                "vnp_OrderInfo" => $vnp_OrderInfo,
                "vnp_OrderType" => $vnp_OrderType,
                "vnp_ReturnUrl" => $vnp_Returnurl,
                "vnp_TxnRef" => $vnp_TxnRef,
                "vnp_ExpireDate" => $expire
            );

            // Nếu muốn thêm bank
            // $inputData['vnp_BankCode'] = 'NCB';

            ksort($inputData);
            $hashdata = "";
            $query = "";
            $i = 0;
            foreach ($inputData as $key => $value) {
                if ($i == 1) {
                    $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
                } else {
                    $hashdata .= urlencode($key) . "=" . urlencode($value);
                    $i = 1;
                }
                $query .= urlencode($key) . "=" . urlencode($value) . '&';
            }

            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url = $vnp_Url . "?" . $query . "vnp_SecureHash=" . $vnpSecureHash;

            $returnData = array(
                'code' => '01',
                'message' => 'success',
                'payUrl' => $vnp_Url
            );

            return response()->json([
                'data' => $returnData,
                'message' => 'Payment request sent successfully',
                'status' => 200
            ]);
        }
    }

    public function handleIpn(Request $request)
    {
        XoaDonHang::dispatch($request->input('dat_ve_id'))->delay(now()->addMinutes(10));

        try {
            $data = $request->all();

            if (isset($data['extraData'])) {
                $extraData = json_decode($data['extraData'], true);
                $extraData['ma_giao_dich'] = $data['orderId'];

                if ($extraData['phuong_thuc_thanh_toan_id'] == 1) {

                    if ($data['resultCode'] == 0) {

                        //TẠO QR MÃ GIAO DỊCH
                        $qrSvg = QrCode::format('svg')->size(250)->generate($extraData['ma_giao_dich']);
                        $extraData['qr_code'] = 'data:image/svg+xml;base64,' . base64_encode($qrSvg);
                        $thanhToan = ThanhToan::create($extraData);
                        $DatVe = DatVe::find($thanhToan->dat_ve_id);
                        $diemCong = $DatVe->tong_tien * 0.05;

                        $DiemThanhVien = DiemThanhVien::find($thanhToan->nguoi_dung_id);

                        if ($DiemThanhVien) {
                            $DiemThanhVien->diem += $diemCong - $extraData['diem_thanh_vien'];
                            $DiemThanhVien->save();
                        } else {
                            DiemThanhVien::create([
                                'nguoi_dung_id' => $thanhToan->nguoi_dung_id,
                                'diem' => $diemCong
                            ]);
                        }
                        Mail::to($thanhToan->email)->send(new MaQRVeMail($extraData['ma_giao_dich']));


                        // Redirect về trang history với dữ liệu truyền qua query string
                        $queryParams = http_build_query([
                            'dat_ve_id' => $thanhToan->dat_ve_id,
                            'phuong_thuc_thanh_toan_id' => $thanhToan->phuong_thuc_thanh_toan_id,
                            'nguoi_dung_id' => $thanhToan->nguoi_dung_id,
                            'ma_giao_dich' => $thanhToan->ma_giao_dich,
                        ]);


                        return redirect("http://localhost:5173/check?$queryParams");
                    } else {
                        if (isset($data['extraData'])) {
                            $dataVe = json_decode($data['extraData'], true);
                            $dataVeId = $dataVe['dat_ve_id'];
                            $dataVe = DatVe::with(['DatVeChiTiet', 'DonDoAn'])->find($dataVeId);
                            $dat_ve_chi_tiet = $dataVe->DatVeChiTiet ?? null;
                            $don_do_an = $dataVe->DonDoAn ?? null;
                            if ($dat_ve_chi_tiet->isNotEmpty()) {
                                $dat_ve_chi_tiet->each(function ($item) use ($dataVe) {
                                    $checkGhe = CheckGhe::where('ghe_id', $item->ghe_id)
                                        ->where('lich_chieu_id', $dataVe->lich_chieu_id)
                                        ->first();
                                    if ($checkGhe) {
                                        $checkGhe->update(['trang_thai' => 'trong']);
                                    }
                                });
                            }
                            if ($dataVe['ma_giam_gia_id']) {
                                $MaGiamGia = MaGiamGia::find($dataVe['ma_giam_gia_id']);
                                if ($MaGiamGia->so_lan_da_su_dung > 0) {
                                    $MaGiamGia->so_lan_da_su_dung -= 1;
                                    $MaGiamGia->save();
                                }
                            }
                            if ($don_do_an->isNotEmpty()) {
                                $don_do_an->each(function ($item) {
                                    $doAn = DoAn::find($item->do_an_id);
                                    if ($doAn) {
                                        $doAn->update(['so_luong' => $doAn->so_luong + $item->so_luong]);
                                    }
                                });
                            }
                            $dataVe->delete();
                        } else {
                            $dataVe = null;
                        }

                        return redirect("http://localhost:5173/check?error=1");
                    }
                }
            }
            if ($request->phuong_thuc_thanh_toan_id == 2) {

                // $data['vnp_TxnRef' MÃ ĐƠN HÀNG

                if ($data['vnp_ResponseCode'] == "00") {
                    $data['ma_giao_dich'] = $data['vnp_TxnRef'];

                    //TẠO QR MÃ GIAO DỊCH
                    $qrSvg = QrCode::format('svg')->size(250)->generate($data['ma_giao_dich']);
                    $data['qr_code'] = 'data:image/svg+xml;base64,' . base64_encode($qrSvg);

                    $thanhToan = ThanhToan::create($data);
                    $DatVe = DatVe::find($thanhToan->dat_ve_id);
                    Mail::to($thanhToan->email)->send(new MaQRVeMail($data['ma_giao_dich']));
                    $diemCong = $DatVe->tong_tien * 0.05;
                    $DiemThanhVien = DiemThanhVien::find($thanhToan->nguoi_dung_id);

                    if ($DiemThanhVien) {
                        $DiemThanhVien->diem += $diemCong - $data['diem_thanh_vien'];
                        $DiemThanhVien->save();
                    } else {
                        DiemThanhVien::create([
                            'nguoi_dung_id' => $thanhToan->nguoi_dung_id,
                            'diem' => $diemCong
                        ]);
                    }

                    // Redirect về trang history với dữ liệu truyền qua query string
                    $queryParams = http_build_query([
                        'dat_ve_id' => $thanhToan->dat_ve_id,
                        'phuong_thuc_thanh_toan_id' => $thanhToan->phuong_thuc_thanh_toan_id,
                        'nguoi_dung_id' => $thanhToan->nguoi_dung_id,
                        'ma_giao_dich' => $thanhToan->ma_giao_dich,
                    ]);

                    return redirect("http://localhost:5173/check?$queryParams");
                } else {
                    $dataVeId = $data['dat_ve_id'];
                    $dataVe = DatVe::with(['DatVeChiTiet', 'DonDoAn'])->find($dataVeId);
                    $dat_ve_chi_tiet = $dataVe->DatVeChiTiet ?? null;
                    $don_do_an = $dataVe->DonDoAn ?? null;
                    if ($dat_ve_chi_tiet->isNotEmpty()) {
                        $dat_ve_chi_tiet->each(function ($item) use ($dataVe) {
                            $checkGhe = CheckGhe::where('ghe_id', $item->ghe_id)
                                ->where('lich_chieu_id', $dataVe->lich_chieu_id)
                                ->first();
                            if ($checkGhe) {
                                $checkGhe->update(['trang_thai' => 'trong']);
                            }
                        });
                    }
                    if ($data['ma_giam_gia_id']) {
                        $MaGiamGia = MaGiamGia::find($data['ma_giam_gia_id']);
                        if ($MaGiamGia->so_lan_da_su_dung > 0) {
                            $MaGiamGia->so_lan_da_su_dung -= 1;
                            $MaGiamGia->save();
                        }
                    }
                    if ($don_do_an->isNotEmpty()) {
                        $don_do_an->each(function ($item) {
                            $doAn = DoAn::find($item->do_an_id);
                            if ($doAn) {
                                $doAn->update(['so_luong' => $doAn->so_luong + $item->so_luong]);
                            }
                        });
                    }

                    $dataVe->delete();
                    return redirect("http://localhost:5173/check?error=1");
                }
            }
        } catch (\Throwable $th) {
            $dataVeId = $data['dat_ve_id'];
            $dataVe = DatVe::with(['DatVeChiTiet', 'DonDoAn'])->find($dataVeId);
            if (!$dataVe) {
                return response()->json([
                    'message' => 'Đơn vé không tồn tại',
                ], 404);
            }
            $dat_ve_chi_tiet = $dataVe->DatVeChiTiet ?? null;
            $don_do_an = $dataVe->DonDoAn ?? null;
            if ($dat_ve_chi_tiet) {
                $dat_ve_chi_tiet->each(function ($item) use ($dataVe) {
                    $checkGhe = CheckGhe::where('ghe_id', $item->ghe_id)
                        ->where('lich_chieu_id', $dataVe->lich_chieu_id)
                        ->first();
                    if ($checkGhe) {
                        $checkGhe->update(['trang_thai' => 'trong']);
                    }
                });
            }
            if ($don_do_an) {
                $don_do_an->each(function ($item) {
                    $doAn = DoAn::find($item->do_an_id);
                    if ($doAn) {
                        $doAn->update(['so_luong' => $doAn->so_luong + $item->so_luong]);
                    }
                });
            }

            $dataVe->delete();

            return redirect("http://localhost:5173/check?error=1");
        }
    }






    public function show(string $id)
    {
        //
    }
}
