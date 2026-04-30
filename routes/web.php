<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


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


Route::get('/tools', function () {
    return Inertia::render('Tools');
});

Route::get('/tools/first-time', function () {
    return Inertia::render('Tools/FirstTime');
});

Route::get('/tools/existing', function () {
    return Inertia::render('Tools/Existing');
});

Route::get('/tools/calculator', function () {
    return Inertia::render('Tools/Calculator');
});

Route::get('/tools/calendar', function () {
    return Inertia::render('Tools/Calendar');
});

Route::get('/calculator/emi', function () {
    return Inertia::render('Calculator/EMI');
});

Route::get('/calculator/loan-eligibility', function () {
    return Inertia::render('Calculator/LoanEligibility');
});

Route::get('/calculator/interest-rate', function () {
    return Inertia::render('Calculator/InterestRate');
});

Route::get('/calculator/LoanTenure', function () {
    return Inertia::render('Calculator/LoanTenure');
});
Route::get('/calculator/Prepayment', function () {
    return Inertia::render('Calculator/Prepayment');
});

Route::get('/calculator/RentVsBuy', function () {
    return Inertia::render('Calculator/RentVsBuy');
});

Route::get('/calculator/PropertyInvestment', function () {
    return Inertia::render('Calculator/PropertyInvestment');
});

Route::get('/calculator/FinancialComparison', function () {
    return Inertia::render('Calculator/FinancialComparison');
});

Route::get('/calculator/StampDuty', function () {
    return Inertia::render('Calculator/StampDuty');
});

Route::get('/existing/InterestReview', function () {
    return Inertia::render('Existing/InterestReview');
});

Route::get('/existing/audio/{slug}', function ($slug) {
    return Inertia::render('Existing/Audio/CalculatorAudio', [
        'slug' => $slug
    ]);
});



Route::get('/existing/video/{slug}', function ($slug) {
    return Inertia::render('Existing/Video/CalculatorVideo', [
        'slug' => $slug
    ]);
});


Route::get('/profile', fn() => Inertia::render('Profile/Profile'));

Route::get('/membership', function () {
    return Inertia::render('Membership/Membership');
});