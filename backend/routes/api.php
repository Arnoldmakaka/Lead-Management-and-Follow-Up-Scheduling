<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthenticationApiController;
use App\Http\Controllers\Api\V1\LeadsApiController;
use App\Http\Controllers\Api\V1\FollowUpApiController;
use App\Http\Controllers\Api\V1\FollowUpNotificationApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::middleware(['api'])->name('api.')->group(function () {
    
    //Login User
    Route::post('/login', [AuthenticationApiController::class, 'login']);

    //Sign-up User
    Route::post('/sign-up', [AuthenticationApiController::class, 'signUp']);

    // leads api resource
    Route::apiResource('leads', LeadsApiController::class)->middleware('auth:sanctum')->only(['index', 'store']);

    // All followups
    Route::get('/followups', [FollowUpApiController::class, 'index'])->middleware('auth:sanctum');

    //Schedule a followup
    Route::post('/followups', [FollowUpApiController::class, 'store'])->middleware('auth:sanctum');

    //Update followup status
    Route::put('/followups/{followup}/status', [FollowUpApiController::class, 'updateStatus'])->middleware(['auth:sanctum', 'can:update,followup']);

    //All User Notifiications
    Route::get('/notifications', [FollowUpNotificationApiController::class, 'index'])->middleware('auth:sanctum');

    //Mark a single notification as read
    Route::post('/notifications/{id}/read', [FollowUpNotificationApiController::class, 'markAsRead'])->middleware('auth:sanctum');

    //Mark all notifications as read
    Route::post('/notifications/read', [FollowUpNotificationApiController::class, 'markAllAsRead'])->middleware('auth:sanctum');

});