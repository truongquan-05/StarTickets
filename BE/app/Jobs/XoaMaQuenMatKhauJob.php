<?php

namespace App\Jobs;

use App\Models\CheckGhe;
use App\Models\DatLaiMatKhau;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;


class XoaMaQuenMatKhauJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $id;

    public function __construct($id)
    {
        $this->id = $id;
    }

    public function handle()
    {
        // Xử lý logic xóa mã quên mật khẩu
        $data = DatLaiMatKhau::find($this->id);

        if ($data) {
            $data->delete();
        }
    }
}
