<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
    />

    @viteReactRefresh
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])

    @inertiaHead

    {{-- ✅ Livewire CSS --}}
    @livewireStyles
</head>

<body>
    <style>
        script[data-page] {
            display: none;
        }
    </style>

    @inertia

    {{-- ✅ TOKEN LISTENER --}}
    <livewire:push-notification-handler />

    {{-- ✅ Livewire JS --}}
    @livewireScripts
</body>
</html>