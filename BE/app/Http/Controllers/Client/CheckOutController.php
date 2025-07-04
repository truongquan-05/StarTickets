<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\ThanhToan;
use Illuminate\Http\Request;

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

        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        $partnerCode = 'MOMOBKUN20180529';
        $accessKey = 'klm05TvNBzhg7h7j';
        $secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
        $orderInfo = "Thanh toán qua ATM MoMo";
        $amount = $request->input('tong_tien');
        $dat_ve_id = $request->input('dat_ve_id');
        $phuong_thuc_thanh_toan_id = $request->input('phuong_thuc_thanh_toan_id');
        $nguoi_dung_id = $request->input('nguoi_dung_id');
        $orderId = time() . "";
        $redirectUrl = "http://localhost:8000/api/momo-ipn";
        $ipnUrl = "http://localhost:8000/api/momo-ipn";


        $requestId = time() . "";
        $requestType = "payWithATM";
        $extraData = json_encode([
            'dat_ve_id' => $dat_ve_id,
            'phuong_thuc_thanh_toan_id' => $phuong_thuc_thanh_toan_id,
            'nguoi_dung_id' => $nguoi_dung_id,
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

    public function handleIpn(Request $request)
{
    $data = $request->all();

    if (!isset($data['extraData']) || !isset($data['orderId'])) {
        return response()->json(['message' => 'Dữ liệu không hợp lệ'], 400);
    }

    $extraData = json_decode($data['extraData'], true);
    $extraData['ma_giao_dich'] = $data['orderId'];

    if ($data['resultCode'] == 0) {
        $thanhToan = ThanhToan::create($extraData);

        // Redirect về trang history với dữ liệu truyền qua query string
        $queryParams = http_build_query([
            'dat_ve_id' => $thanhToan->dat_ve_id,
            'phuong_thuc_thanh_toan_id' => $thanhToan->phuong_thuc_thanh_toan_id,
            'nguoi_dung_id' => $thanhToan->nguoi_dung_id,
            'ma_giao_dich' => $thanhToan->ma_giao_dich,
        ]);

        return redirect("http://localhost:5173/history?$queryParams");
    } else {
        return redirect("http://localhost:5173/history?error=1");
    }
}










    public function index() {}


    public function store(Request $request)
    {
        //
    }


    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }


    public function destroy(string $id)
    {
        //
    }
}
