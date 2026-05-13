<?php

namespace App\Livewire;

use Livewire\Component;
use Illuminate\Support\Facades\Http;

class PushNotificationHandler extends Component
{
    public function mount()
    {
        $this->dispatch('request-notification-permission');
    }

    public function saveToken($token)
    {
        \Log::info('FCM Token: ' . $token);

        Http::post('https://backend.quickhomeloan.in/public/api/fcm/save-token', [
            'fcm_token' => $token,
            'device' => 'android'
        ]);
    }

    public function render()
    {
        return view('livewire.push-notification-handler');
    }
}