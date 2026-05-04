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

Route::get('/reels', fn() => Inertia::render('Reels'));

Route::get('/profile', fn() => Inertia::render('Profile'));


Route::get('/tools', function () {
    return Inertia::render('Tools');
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


Route::get('/existing/journeyCompletion', function () {
    return Inertia::render('Existing/JourneyCompletion');
});

Route::get('/existing/rateTracker', function () {
    return Inertia::render('Existing/RateTracker');
});

Route::get('/existing/benchmark-transmission', function () {
    return Inertia::render('Existing/BenchmarkTransmission');
});

Route::get('/existing/hidden-costs-audit', function () {
    return Inertia::render('Existing/HiddenCostsAudit');
});


Route::get('/existing/emi-stress-audit', function () {
    return Inertia::render('Existing/EMIStressAudit');
});


Route::get('/existing/yearly-interest-projections', function () {
    return Inertia::render('Existing/YearlyInterestProjections');
});

Route::get('/existing/prepayment-foreclosure', function () {
    return Inertia::render('Existing/PrepaymentForeclosure');
});

Route::get('/existing/tax-intelligence', function () {
    return Inertia::render('Existing/TaxIntelligence');
});

Route::get('/existing/emi-repayment-health', function () {
    return Inertia::render('Existing/EMIRepaymentHealth');
});


Route::get('/existing/freedom-roadmap', function () {
    return Inertia::render('Existing/FreedomRoadmap');
});


Route::get('/existing/freedom-roadmap', function () {
    return Inertia::render('Existing/FreedomRoadmap');
});


Route::get('/tools/first-time', function () {
    return Inertia::render('Tools/FirstTime');
});

Route::get('/first-time/safety-engine', function () {
    return Inertia::render('FirstTime/SafetyEngine');
});

Route::get('/first-time/interest-truth', function () {
    return Inertia::render('FirstTime/InterestTruth');
});

Route::get('/first-time/rate-shock-simulator', function () {
    return Inertia::render('FirstTime/RateShockSimulator');
});

Route::get('/first-time/tenure-trap-detector', function () {
    return Inertia::render('FirstTime/TenureTrapDetector');
});

Route::get('/first-time/offer-decoder', function () {
    return Inertia::render('FirstTime/OfferDecoder');
});

Route::get('/news', function () {
    return Inertia::render('News/NewsPage');
});

Route::get('/news/{slug}', function ($slug) {
    return Inertia::render('News/PostDetails', [
        'slug' => $slug
    ]);
});

// Route::get('/profile', fn() => Inertia::render('Profile'));
Route::get('/profile', fn() => Inertia::render('Profile/Profile'));
Route::get('/profile/smart-setup', fn() => Inertia::render('Profile/SmartProfileSetup'));

Route::get('/tools/calendar', function () {
    return Inertia::render('Tools/Calendar');
});

Route::get('/analysis', function () {
    return Inertia::render('Analysis/AnalysisPage');
});

Route::get('/analysis/statement-analyzer', function () {
    return Inertia::render('Analysis/StatementAnalyzer');
});


Route::get('/analysis/rate-change-risk', function () {
    return Inertia::render('Analysis/RateChangeRisk');
});

Route::get('/analysis/rate-change-tracker', function () {
    return Inertia::render('Analysis/RateChangeTracker');
});