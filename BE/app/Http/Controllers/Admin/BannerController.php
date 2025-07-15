<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{

    public function __construct()
    {
        $this->middleware('IsAdmin');
        $this->middleware('permission:Banner-read')->only(['index', 'show']);
        $this->middleware('permission:Banner-create')->only(['store']);
        $this->middleware('permission:Banner-update')->only(['update']);
        $this->middleware('permission:Banner-delete')->only(['destroy', 'restore', 'forceDelete']);
    }


    public function index(Request $request)
    {
        $type = $request->query('type', 'active'); // Lọc theo active, expired, hoặc deleted

        $query = Banner::query();

        if ($type === 'expired') {
            $query->where('end_date', '<', Carbon::now())->whereNull('deleted_at');
        } elseif ($type === 'deleted') {
            $query->onlyTrashed(); // Banner xóa mềm
        } else {
            $query->where('is_active', true)
                ->where('start_date', '<=', Carbon::now())
                ->where(function ($query) {
                    $query->where('end_date', '>=', Carbon::now())
                        ->orWhereNull('end_date');
                });
        }
        // Tìm kiếm theo title
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Phân trang
        $perPage = $request->get('per_page', 10);
        $banners = $query->orderBy('id', 'desc')->paginate($perPage);
        return response()->json($banners);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,gif|max:2048',
            'link_url' => 'nullable|url',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        $imagePath = $request->file('image')->store('banners', 'public');

        $banner = Banner::create([
            'title' => $validated['title'],
            'image_url' => $imagePath,
            'link_url' => $validated['link_url'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json(['message' => 'Thêm banner thành công', "data" => $banner],  201);
    }

    public function show($id)
    {
        $banner = Banner::withTrashed()->findOrFail($id); // Lấy cả banner xóa mềm
        return response()->json($banner, 200);
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::withTrashed()->findOrFail($id); // Cho phép cập nhật banner xóa mềm

        $validated = $request->validate([
            'title' => 'string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,gif|max:2048',
            'link_url' => 'nullable|url',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($banner->image_url) {
                Storage::disk('public')->delete($banner->image_url);
            }
            $imagePath = $request->file('image')->store('banners', 'public');
            $validated['image_url'] = $imagePath;
        }

        $banner->update($validated);
        return response()->json(['message' => 'Cập nhật banner thành công', "data" => $banner]);
    }

    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);
        if (!$banner) {
            return response()->json(['message' => 'Banner không tồn tại hoặc đã bị xóa'], 200);
        }
        $banner->delete(); // Soft delete
        return response()->json(['message' => 'Xóa mềm banner thành công'], 204);
    }

    public function restore($id)
    {
        $banner = Banner::onlyTrashed()->findOrFail($id);
        $banner->restore(); // Khôi phục banner
        return response()->json(['message' => "Khôi phục banner đã xóa mềm thành công", "data" => $banner]);
    }

    public function forceDelete($id)
    {
        $banner = Banner::onlyTrashed()->findOrFail($id);
        if ($banner->image_url) {
            Storage::disk('public')->delete($banner->image_url); // Xóa ảnh
        }
        $banner->forceDelete(); // Xóa cứng
        return response()->json(['message' => 'Xóa cứng banner thành công'], 204);
    }
}
