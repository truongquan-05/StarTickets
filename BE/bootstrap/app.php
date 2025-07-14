<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;



return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware) {
        $middleware->appendToGroup('web', [
            // Middleware cho web nếu có
        ]);

        $middleware->appendToGroup('api', [
            \Illuminate\Http\Middleware\HandleCors::class, // ✅ Bật CORS cho nhóm API
        ]);

        $middleware->alias([
            'CheckLogin' => \App\Http\Middleware\CheckLogin::class,
            'IsAdmin' => \App\Http\Middleware\IsAdmin::class,
            'permission' => \App\Http\Middleware\CheckPermission::class,
            'is.admin.area' => \App\Http\Middleware\IsAdminArea::class,

        ]);
    })


    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
