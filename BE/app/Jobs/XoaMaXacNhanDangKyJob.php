<?php

namespace App\Jobs;

use App\Models\XacNhanDangKy;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable; 

class XoaMaXacNhanDangKyJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels; 

    protected $id;

    public function __construct($id)
    {
        $this->id = $id;
    }

    public function handle()
    {
        XacNhanDangKy::where('id', $this->id)->delete();
    }
}
