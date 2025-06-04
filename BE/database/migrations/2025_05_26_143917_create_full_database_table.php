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
            $table->foreignId('vai_tro_id')->constrained('vai_tro')->onUpdate('cascade')->onDelete('cascade');
            $table->string('quyen', 100);
            $table->text('mo_ta')->nullable();
            $table->timestamps();
        });

        Schema::create('the_loai', function (Blueprint $table) {
            $table->id();
            $table->string('ten_the_loai', 100);
            $table->timestamps();
             $table->softDeletes();
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
            $table->string('tinh_trang', 20);
            $table->string('do_tuoi_gioi_han', 50);
            $table->boolean('trang_thai')->default(true);
            $table->foreignId('the_loai_id')->constrained('the_loai')->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
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
            $table->integer('loai_so_do');
            $table->integer('hang_thuong');
            $table->integer('hang_doi');
            $table->integer('hang_vip');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('loai_ghe', function (Blueprint $table) {
            $table->id();
            $table->string('ten_loai_ghe', 100);
            $table->timestamps();
        });

        Schema::create('ghe', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phong_id')->constrained('phong_chieu')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('loai_ghe_id')->constrained('loai_ghe')->onUpdate('cascade')->onDelete('cascade');
            $table->string('so_ghe', 10);
            $table->char('hang', 1);
            $table->unsignedTinyInteger('cot');
            $table->boolean('trang_thai')->default(true);
            $table->timestamps();
        });

        Schema::create('lich_chieu', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phim_id')->constrained('phim')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('phong_id')->constrained('phong_chieu')->onUpdate('cascade')->onDelete('cascade');
            $table->dateTime('thoi_gian_chieu');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('gia_ve', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lich_chieu_id')->constrained('lich_chieu')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('loai_ghe_id')->constrained('loai_ghe')->onUpdate('cascade')->onDelete('cascade');
            $table->decimal('gia_ve', 10, 2);
            $table->timestamps();
        });

        Schema::create('dat_ve', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nguoi_dung_id')->constrained('nguoi_dung')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('lich_chieu_id')->constrained('lich_chieu')->onUpdate('cascade')->onDelete('cascade');
            $table->dateTime('ngay_dat');
            $table->decimal('tong_tien', 10, 2);
            $table->string('trang_thai', 20);
            $table->timestamps();
        });

        Schema::create('dat_ve_chi_tiet', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dat_ve_id')->constrained('dat_ve')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('ghe_id')->constrained('ghe')->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('check_ghes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lich_chieu_id')->constrained('lich_chieu')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('phong_id')->constrained('phong_chieu')->onUpdate('cascade')->onDelete('cascade');
            $table->string('so_ghe', 10);
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
            $table->foreignId('phuong_thuc_thanh_toan_id')->constrained('phuong_thuc_thanh_toan')->onUpdate('cascade')->onDelete('cascade');
            $table->string('trang_thai', 20);
            $table->dateTime('thoi_gian');
            $table->string('ma_giao_dich', 255);
            $table->timestamps();
        });

        Schema::create('do_an', function (Blueprint $table) {
            $table->id();
            $table->string('ten_do_an', 100);
            $table->text('mo_ta')->nullable();
            $table->decimal('gia', 10, 2);
            $table->integer('so_luong_ton');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('don_do_an', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dat_ve_id')->constrained('dat_ve')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('do_an_id')->constrained('do_an')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('so_luong');
            $table->timestamps();
        });

        Schema::create('ma_giam_gia', function (Blueprint $table) {
            $table->id();
            $table->string('ma', 50)->unique();
            $table->integer('phan_tram_giam');
            $table->json('dieu_kien');
            $table->date('han_su_dung');
            $table->date('ngay_bat_dau');
            $table->integer('so_lan_su_dung');
            $table->boolean('trang_thai')->default(false);
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
            $table->string('hinh_anh', 255);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('diem_thanh_vien', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nguoi_dung_id')->constrained('nguoi_dung')->onUpdate('cascade')->onDelete('cascade');
            $table->float('diem');
            $table->float('tong_diem');
            $table->string('cap_do', 50);
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

        Schema::create('dat_lai_mat_khau', function (Blueprint $table) {
            $table->string('email', 100);
            $table->string('token', 255);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Có thể thêm logic rollback ở đây nếu cần
    }
};
