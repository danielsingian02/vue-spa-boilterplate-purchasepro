<?php

namespace App\Mail;

use App\Models\Order;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewOrder extends Mailable
{
    use Queueable, SerializesModels;

   /**
     * Create a new message instance.
     */
    public function __construct(
        public Order $order,
        protected User $user,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Order Confirmed - ' . ' ' . $this->order->order_number,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $name = $this->order->first_name . ' ' . $this->order->last_name;

        return new Content(
            markdown: 'emails.orders.new',
            with: [
                'customerName' => $name ?? $this->user->name,
                'url' => env('APP_URL')
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
