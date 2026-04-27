<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    @viteReactRefresh
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])

    @inertiaHead
</head>
<body>
    <style>
    script[data-page] {
        display: none;
    }
</style>
    @inertia
</body>
</html>