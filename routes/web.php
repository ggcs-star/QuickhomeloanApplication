<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', fn() => Inertia::render('Home'));
Route::get('/login', fn() => Inertia::render('Login'));
Route::get('/register', fn() => Inertia::render('Register'));
Route::get('/dashboard', fn() => Inertia::render('Dashboard'));

Route::get('/education', fn() => Inertia::render('Education'));
// Route::get('/education/{category}', function ($category) {
//     return Inertia::render('EducationDetails', [
//         'category' => urldecode($category),
//     ]);
// });

Route::get('/education/modules/audio', fn() => Inertia::render('ModulesAudio'));
Route::get('/education/audio-details', fn() => Inertia::render('AudioDetails'));
Route::get('/courses', function () {
    return Inertia::render('Courses', [
        'type' => request('type')
    ]);
});
Route::get('/courses/{id}/modules', function ($id) {
    return Inertia::render('Modules', [
        'courseId' => $id,
        'type' => request('type')
    ]);
});


Route::get('/modules/{id}/audio', function ($id) {
    return Inertia::render('AudioContents', [
        'moduleId' => $id
    ]);
});

Route::get('/modules/{id}/video', function ($id) {
    return Inertia::render('VideoContents', [
        'moduleId' => $id
    ]);
});

Route::get('/audio-player', function () {
    return Inertia::render('AudioPlayer', [
       
    ]);
})->name('audio-player');
Route::get('/video-player', function () {
    return Inertia::render('VideoPlayer');
})->name('video-player');

Route::get('/reels', fn () => Inertia::render('Reels'));

Route::get('/profile', fn() => Inertia::render('Profile'));