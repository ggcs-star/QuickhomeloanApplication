<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Native\Mobile\Facades\PushNotifications;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if (!app()->runningInConsole()) {
            PushNotifications::enroll();
        }
    }
}