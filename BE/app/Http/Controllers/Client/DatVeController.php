<?php

namespace App\Http\Controllers\Client;

use App\Models\DatVe;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DatVeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $dat_ve = $request->all('dat_ve');

        $DatVe = DatVe::insert($dat_ve);

        return response()->json([
            'data' => $DatVe
        ]);














    }

    /**
     * Display the specified resource.
     */
    public function show(DatVe $datVe)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DatVe $datVe)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DatVe $datVe)
    {
        //
    }
}
