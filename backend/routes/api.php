<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\QuoteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->group(function () {
    Route::get('/csrf-token', function (Request $request) {
        $request->session()->regenerateToken();

        return response()->json([
            'csrf_token' => csrf_token(),
        ]);
    });


    //--- Public routes

    //auth
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    //movies
    Route::get('/movies', [MovieController::class, 'index']);
    Route::get('/movies/{movie}', [MovieController::class, 'show']);

    //quotes
    Route::get('/quotes', [QuoteController::class, 'index']);
    Route::get('/quotes/{quote}', [QuoteController::class, 'show']);

    //--- Authenticated routes
    Route::middleware('auth:web')->group(function () {
        //auth
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user/me', [AuthController::class, 'me']);

        //movies
        Route::post('/movies', [MovieController::class, 'store']);
        Route::put('/movies/{movie}', [MovieController::class, 'update']);
        Route::patch('/movies/{movie}', [MovieController::class, 'update']);
        Route::delete('/movies/{movie}', [MovieController::class, 'destroy']);

        //quotes
        Route::post('/quotes', [QuoteController::class, 'store']);
        Route::put('/quotes/{quote}', [QuoteController::class, 'update']);
        Route::patch('/quotes/{quote}', [QuoteController::class, 'update']);
        Route::delete('/quotes/{quote}', [QuoteController::class, 'destroy']);
    });


});
