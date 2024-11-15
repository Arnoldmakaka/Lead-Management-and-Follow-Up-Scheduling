<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\FollowUp;

class FollowUpMissed extends Notification
{
    use Queueable;

    public $followUpDetails;

    /**
     * Create a new notification instance.
     */
    public function __construct($followUpDetails)
    {
        $this->followUpDetails = $followUpDetails;
    }

    /**
     * Get the notification's database type.
     *
     * @return string
     */
    public function databaseType(object $notifiable): string
    {
        return 'followUp-missed';
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase($notifiable)
    {
        return [
            'message' => 'Missed a follow-up',
            'follow_up_id' => $this->followUpDetails['id'],
            'scheduled_at' => $this->followUpDetails['scheduled_at'],
            'status' => 'Missed',
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'followUp_id' => $this->followUp->id,
        ];
    }
}
