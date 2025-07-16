<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vai_tro', function (Blueprint $table) {
            $table->id();
            $table->string('ten_vai_tro', 50);
            $table->text('mo_ta')->nullable();
            $table->timestamps();
        });

        Schema::create('nguoi_dung', function (Blueprint $table) {
            $table->id();
            $table->string('ten', 100);
            $table->string('email', 100)->unique();
            $table->string('so_dien_thoai', 20)->nullable();
            $table->string('password', 255);
            $table->string('google_id', 100)->nullable();
            $table->string('anh_dai_dien', 255)->nullable();
            $table->dateTime('email_da_xac_thuc')->nullable();
            $table->boolean('trang_thai')->default(true);
            $table->foreignId('vai_tro_id')->constrained('vai_tro')->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('quyen_han', function (Blueprint $table) {
            $table->id();
            $table->string('quyen', 100);
            $table->text('mo_ta')->nullable();
            $table->timestamps();
        });

        Schema::create('quyen_truy_cap', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vai_tro_id')->constrained('vai_tro')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('quyen_han_id')->constrained('quyen_han')->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('the_loai', function (Blueprint $table) {
            $table->id();
            $table->string('ten_the_loai', 100);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('phim', function (Blueprint $table) {
            $table->id();
            $table->string('ten_phim', 255);
            $table->text('mo_ta')->nullable();
            $table->integer('thoi_luong');
            $table->string('trailer', 255)->nullable();
            $table->string('ngon_ngu', 100);
            $table->string('quoc_gia', 100);
            $table->string('anh_poster', 255)->nullable();
            $table->date('ngay_cong_chieu');
            $table->date('ngay_ket_thuc')->nullable();
            $table->string('do_tuoi_gioi_han', 50);
            $table->enum('loai_suat_chieu', ['Thường', 'Đặc biệt', 'Sớm']);
            $table->json('chuyen_ngu')->nullable();
            $table->json('the_loai_id')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('xac_nhan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nguoi_dung_id')->constrained('nguoi_dung')->onUpdate('cascade')->onDelete('cascade');
            $table->string('ma_xac_nhan', 100);
            $table->timestamps();
        });

        Schema::create('xac_nhan_dang_ky', function (Blueprint $table) {
            $table->id();
            $table->string('email', 100);
            $table->string('ma_xac_nhan', 100);
            $table->timestamps();
        });

        Schema::create('chuyen_ngu', function (Blueprint $table) {
            $table->id();
            $table->string('the_loai', 100);
            $table->timestamps();
        });

        Schema::create('danh_gia', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nguoi_dung_id')->constrained('nguoi_dung')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('phim_id')->constrained('phim')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('so_sao');
            $table->text('noi_dung');
            $table->timestamps();
        });

        Schema::create('rap', function (Blueprint $table) {
            $table->id();
            $table->string('ten_rap', 100);
            $table->string('dia_chi', 255);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('phong_chieu', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rap_id')->constrained('rap')->onUpdate('cascade')->onDelete('cascade');
            $table->string('ten_phong', 100);
            $table->string('loai_so_do', 10); // Ví dụ: 8x8, 12x12
            $table->integer('hang_thuong');
            $table->integer('hang_doi');
            $table->integer('hang_vip');
            $table->boolean('trang_thai')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('loai_ghe', function (Blueprint $table) {
            $table->id();
            $table->enum('ten_loai_ghe', ['Ghế Thường', 'Ghế Vip', 'Ghế Đôi']);
            $table->timestamps();
        });

        Schema::create('ghe', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phong_id')->constrained('phong_chieu')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('loai_ghe_id')->constrained('loai_ghe')->onUpdate('cascade')->onDelete('cascade');
            $table->string('so_ghe', 10);
            $table->char('hang', 1);
            $table->unsignedTinyInteger('cot');
            $table->boolean('trang_thai')->default(true); // true: còn sử dụng, false: đã hỏng
            $table->softDeletes();
            $table->timestamps();
        });


        Schema::create('lich_chieu', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phim_id')->constrained('phim')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('phong_id')->constrained('phong_chieu')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('chuyen_ngu_id')->constrained('chuyen_ngu');
            $table->dateTime('gio_chieu');
            $table->dateTime('gio_ket_thuc');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('gia_ve', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lich_chieu_id')->constrained('lich_chieu')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('loai_ghe_id')->constrained('loai_ghe')->onUpdate('cascade')->onDelete('cascade');
            $table->decimal('gia_ve', 12, 2);
            $table->timestamps();
        });

        Schema::create('dat_ve', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nguoi_dung_id')->constrained('nguoi_dung')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('lich_chieu_id')->constrained('lich_chieu')->onUpdate('cascade')->onDelete('cascade');
            $table->decimal('tong_tien', 10, 2);
            $table->timestamps();
        });

        Schema::create('dat_ve_chi_tiet', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dat_ve_id')->constrained('dat_ve')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('ghe_id')->constrained('ghe')->onUpdate('cascade')->onDelete('cascade');
            $table->decimal('gia_ve', 10, 2);
            $table->timestamps();
        });

        Schema::create('check_ghes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lich_chieu_id')->constrained('lich_chieu')->onUpdate('cascade')->onDelete('cascade');
            $table->string('nguoi_dung_id', 100)->nullable();
            $table->foreignId('ghe_id')->constrained('ghe')->onUpdate('cascade')->onDelete('cascade');
            $table->enum('trang_thai', ['trong', 'da_dat', 'dang_dat']);

            $table->timestamps();
        });

        Schema::create('phuong_thuc_thanh_toan', function (Blueprint $table) {
            $table->id();
            $table->string('ten', 100);
            $table->string('nha_cung_cap', 100);
            $table->text('mo_ta')->nullable();
            $table->timestamps();
        });

        Schema::create('thanh_toan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dat_ve_id')->constrained('dat_ve')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('nguoi_dung_id')->constrained('nguoi_dung')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('phuong_thuc_thanh_toan_id')->constrained('phuong_thuc_thanh_toan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('ma_giao_dich', 255)->unique();
            $table->string('email', 255);
            $table->string('ho_ten', 255);
            $table->text('qr_code')->nullable(); // base64
            $table->boolean('da_quet')->default(false);
            $table->timestamps();
        });

        Schema::create('do_an', function (Blueprint $table) {
            $table->id();
            $table->string('ten_do_an', 100);
            $table->string('image', 150);
            $table->text('mo_ta')->nullable();
            $table->decimal('gia_nhap', 10, 2);
            $table->decimal('gia_ban', 10, 2);
            $table->integer('so_luong_ton');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('don_do_an', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dat_ve_id')->constrained('dat_ve')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('do_an_id')->constrained('do_an')->onUpdate('cascade')->onDelete('cascade');
            $table->decimal('gia_ban', 10, 2);
            $table->integer('so_luong');
            $table->timestamps();
        });

        Schema::create('ma_giam_gia', function (Blueprint $table) {
            $table->id();
            $table->string('ma', 50)->unique();
            $table->string('image', 150)->nullable();
            $table->decimal('giam_toi_da', 10, 2)->nullable();
            $table->decimal('gia_tri_don_hang_toi_thieu', 10, 2)->nullable();
            $table->float('phan_tram_giam')->nullable();
            $table->date('ngay_bat_dau');
            $table->date('ngay_ket_thuc');
            $table->integer('so_lan_su_dung')->nullable();
            $table->integer('so_lan_da_su_dung')->default(0);
            $table->enum('trang_thai', ['CHƯA KÍCH HOẠT', 'KÍCH HOẠT', 'HẾT HẠN'])->default('KÍCH HOẠT');
            $table->timestamps();
        });

        Schema::create('tin_nhan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nguoi_dung_id')->constrained('nguoi_dung')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('nhan_vien_id')->constrained('nguoi_dung')->onUpdate('cascade')->onDelete('cascade');
            $table->text('noi_dung');
            $table->enum('trang_thai', ['chua_tra_loi', 'da_tra_loi', 'da_dong']);
            $table->timestamps();
        });

        Schema::create('tin_tuc', function (Blueprint $table) {
            $table->id();
            $table->string('tieu_de', 255);
            $table->text('noi_dung');
            $table->string('hinh_anh', 255)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('diem_thanh_vien', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nguoi_dung_id')->constrained('nguoi_dung')->onUpdate('cascade')->onDelete('cascade');
            $table->float('diem');
            $table->timestamps();
        });

        Schema::create('lich_su_diem', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nguoi_dung_id')->constrained('nguoi_dung')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('so_diem');
            $table->text('mo_ta')->nullable();
            $table->string('loai_giao_dich', 100);
            $table->timestamps();
        });

        Schema::create('phan_hoi_khach_hang', function (Blueprint $table) {
            $table->id();
            $table->string('ho_ten', 100);
            $table->string('email', 100);
            $table->string('so_dien_thoai', 15);
            $table->text('noi_dung');
            $table->boolean('trang_thai')->default(false);
            $table->timestamps();
        });

        Schema::create('dat_lai_mat_khau', function (Blueprint $table) {
            $table->string('email', 100);
            $table->string('token', 255);
            $table->timestamps();
        });
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->string('image_url', 255);
            $table->string('link_url', 255)->nullable();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        // Có thể thêm logic rollback ở đây nếu cần
    }
};
