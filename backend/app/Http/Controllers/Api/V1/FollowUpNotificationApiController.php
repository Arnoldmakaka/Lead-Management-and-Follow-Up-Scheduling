<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Exception;

class FollowUpNotificationApiController extends Controller
{
    /**
     * Fetch unread notifications for the authenticated user
     */
    public function index(Request $request)
    {
        try {
            $notifications = $request->user()->unreadNotifications;
            return response()->json([
                'remark' => 'all notifications',
                'status' => 'success',
                'data' => [
                    'notifications' => $notifications
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'remark' => 'failed fetching notifications',
                'status' => 'error',
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Mark single notification as read
     */
    public function markAsRead(Request $request, $notificationId)
    {
        $notification = $request->user()->notifications()->find($notificationId);

        if ($notification) {
            $notification->markAsRead();
            return response()->json([
                'remark' => 'notification read',
                'status' => 'success',
                'message' => "Notification marked as read.",
            ]);
        }

        return response()->json([
            'remark' => 'wrong notification id',
            'status' => 'error',
            'message' => "Notification not found.",
        ], 404);
    }

    /**
     *  Mark Notifications as read
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json([
            'remark' => 'notifications read',
            'status' => 'success',
            'message' => "Notifications marked as read.",
        ]);
    }
}
