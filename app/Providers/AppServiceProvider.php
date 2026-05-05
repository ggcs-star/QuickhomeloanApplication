<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Native\Mobile\Facades\PushNotifications;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Log::info("🚀 getToken called");
       if (app()->runningInConsole()) return;

    PushNotifications::getToken();
    }
}
