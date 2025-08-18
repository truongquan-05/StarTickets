<?php

namespace App\Jobs;

use App\Models\ThanhToan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class XoaThanhToanJob implements ShouldQueue
{
    use Queueable;

    protected $id;
    public function __construct($id)
    {
        $this->id = $id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $data = ThanhToan::where('dat_ve_id', $this->id)->get();

        if ($data->isEmpty()) {
            $res =  Http::delete("http://127.0.0.1:8000/api/dat_ve/$this->id");

            Log::info("Xoa DatVe: " . $res->body()); 
        }
    }
}
