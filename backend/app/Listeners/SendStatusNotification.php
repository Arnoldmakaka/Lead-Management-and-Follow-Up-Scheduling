<?php

namespace App\Listeners;

use App\Events\FollowUpStatusChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notifications\FollowUpMissed;
use Illuminate\Support\Facades\Notification;
use App\Models\User;

class SendStatusNotification implements ShouldQueue
{
    public $tries = 5;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(FollowUpStatusChanged $event): void
    {
        $followUp = $event->followUp;
        $users = User::all();
        
        if($followUp && $users) {
            if($followUp->status == 'missed') {
                Notification::sendNow($users, new FollowUpMissed($followUp));
            }
        }
    }
}
