<?php

use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

Route::apiResource('users', UserController::class);
Route::patch('users/{user}/toggle-status', [UserController::class, 'toggleStatus']);
Route::apiResource('customers', CustomerController::class);
