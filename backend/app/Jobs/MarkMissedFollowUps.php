<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\FollowUp;
use App\Notifications\FollowUpMissed;
use Illuminate\Support\Facades\Notification;
use App\Models\User;
use Carbon\Carbon;

class MarkMissedFollowUps implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $users = User::all();
        $overdueFollowUps = FollowUp::where('scheduled_at', '<', Carbon::now())
            ->where('status', '!=', 'missed')
            ->get();

        // Update each overdue follow-up status to "missed" and send out notifications to users
        foreach ($overdueFollowUps as $followUp) {
            $followUp->update([
                'status' => 'missed'
            ]);
            Notification::sendNow($users, new FollowUpMissed($followUp));
        }
    }
}
