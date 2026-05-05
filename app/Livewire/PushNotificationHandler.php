<?php

namespace App\Livewire;

use Livewire\Component;
use Native\Mobile\Facades\PushNotifications;
use Native\Mobile\Attributes\OnNative;
use Native\Mobile\Events\PushNotification\TokenGenerated;
use Illuminate\Support\Facades\Http;

class PushNotificationHandler extends Component
{
    public function mount()
    {

        PushNotifications::enroll();
    }

    #[OnNative(TokenGenerated::class)]
    public function storeToken(string $token)
    {
        \Log::info('🔥 FCM TOKEN:', ['token' => $token]);

        Http::post('https://backend.quickhomeloan.in/public/api/fcm/save-token', [
            'fcm_token' => $token,
        ]);
    }

    public function render()
    {
        return view('livewire.push-notification-handler');
    }
}